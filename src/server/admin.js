import express from 'express';
import fs from 'node:fs';
import path from 'node:path';

export default function(redis) {
  
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

  return router;
}