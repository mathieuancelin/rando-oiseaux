import express from 'express';
import fs from 'node:fs';
import path from 'node:path';

export default function(redis) {

  const router = express.Router()
  const static_oiseaux = []; //JSON.parse(fs.readFileSync(path.resolve('./dist/data/oiseaux.json'))).map(o => ({ ...o, static: true }));

  async function allOiseaux() {
    const keys = await redis.keys('oiseaux:*');
    const oiseaux_redis = await Promise.all(keys.map(key => redis.get(key)));
    const oiseaux = [...static_oiseaux, ...oiseaux_redis.map(o => JSON.parse(o))];
    return oiseaux;
  }

  async function pickRandomItems(excludeId, n) {
    const oiseaux = await allOiseaux();
    const oiseau = oiseaux.find(o => o.id === excludeId);
    const choices = oiseau?.choices?.replace(/\n/g, '').replace(/\n\t/g, '').split(',').map(c => c.trim()).map(c => ({ nom: c })) || [];
    return choices;
    //const filtered = oiseaux.filter(item => item.id !== excludeId);
    //const shuffled = filtered.sort(() => Math.random() - 0.5);
    //return shuffled.slice(0, n);
  }

  router.get('/oiseaux/:id/choices', async (req, res) => {
    const id = req.params.id;
    const choices = await pickRandomItems(id, 2);
    res.json(choices);
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

  router.get('/oiseaux', async (req, res) => {
    const oiseaux = await allOiseaux();
    res.json({
      oiseaux
    })
  });

  router.post('/scores/:uid', async (req, res) => {
    const uid = req.params.uid;
    const score = req.body;
    await redis.set(`scores:${uid}`, JSON.stringify(score));
    res.json({ success: true });
  });

  return router;
}