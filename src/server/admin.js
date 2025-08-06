import express from 'express';
import fs from 'node:fs';
import path from 'node:path';

export default function(redis) {
  
  const router = express.Router()
  const oiseaux = JSON.parse(fs.readFileSync(path.resolve('./dist/data/oiseaux.json')));

  router.get('/oiseaux', (req, res) => {
    res.json({
      oiseaux
    })
  });

  router.get('/oiseaux/:id', (req, res) => {
    const id = req.params.id;
    const oiseau = oiseaux.find(o => o.id === id);
    res.json({
      oiseau
    })
  });

  return router;
}