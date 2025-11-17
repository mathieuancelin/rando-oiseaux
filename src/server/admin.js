import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' })

export default function(redis, s3Client) {

  const bucketName = "larandodesoiseaux";
  
  const router = express.Router()
  const static_oiseaux = JSON.parse(fs.readFileSync(path.resolve('./dist/data/oiseaux.json'))).map(o => ({ ...o, static: true }));

  router.get('/oiseaux', async (req, res) => {
    const keys = await redis.keys('oiseaux:*');
    const oiseaux_redis = await Promise.all(keys.map(key => redis.get(key)));
    const oiseaux = [...static_oiseaux, ...oiseaux_redis.map(o => JSON.parse(o))];
    res.json({
      oiseaux
    });
  });

  router.get('/oiseaux/:id', async (req, res) => {
    const id = req.params.id;
    const oiseau_statis = static_oiseaux.find(o => o.id === id);
    const oiseau_redis = await redis.get(`oiseaux:${id}`);
    const oiseau = oiseau_statis || (oiseau_redis ? JSON.parse(oiseau_redis) : null);
    res.json({
      oiseau
    })
  });

  router.get('/scores', async (req, res) => {
    const keys = await redis.keys('scores:*');
    const scores = await Promise.all(keys.map(key => redis.get(key)));
    res.json({
      scores: scores.map(score => JSON.parse(score))
    })
  });

  router.post('/oiseaux/:id', async (req, res) => {
    const id = req.params.id;
    await redis.set(`oiseaux:${id}`, JSON.stringify(req.body));
    res.json({
      oiseau: req.body
    })
  });

  router.delete('/oiseaux/:id', async (req, res) => {
    const id = req.params.id;
    const oiseau = await redis.get(`oiseaux:${id}`);
    if (!oiseau) {
      return res.status(404).json({
        error: 'Oiseau non trouvé'
      });
    }
    await redis.del(`oiseaux:${id}`);
    res.json({
      oiseau: JSON.parse(oiseau)
    })
  });

  router.post('/uploads', upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'Fichier manquant' });
      }
      const originalName = file.name || 'upload';
      const ext = path.extname(originalName);
      const base = path.basename(originalName, ext).replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 80) || 'file';
      const key = `${new Date().toISOString().slice(0,10)}/${base}-${Date.now()}${ext}`;
      const contentType = file.mimetype || 'application/octet-stream';

      await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.data || file.buffer,
        ContentType: contentType,
        ACL: 'public-read'
      }));

      const endpoint = process.env.CELLAR_ADDON_HOST || 'cellar-c2.services.clever-cloud.com';
      const url = `https://${bucketName}.${endpoint}/${encodeURIComponent(key).replace(/%2F/g, '/')}`;

      res.json({ url, key, bucket: bucketName })
    } catch (e) {
      res.status(500).json({ error: 'Erreur lors de l\'upload', details: e.message })
    }
  });

  return router;
}