import express from 'express';
import fs from 'node:fs';
import path from 'node:path';

export default function(redis) {

  const router = express.Router()
  const oiseaux = JSON.parse(fs.readFileSync(path.resolve('./dist/data/oiseaux.json')));

  function pickRandomItems(excludeId, n) {
    const filtered = oiseaux.filter(item => item.id !== excludeId);
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  }

  router.get('/oiseaux/:id/choices', (req, res) => {
    const id = req.params.id;
    const choices = pickRandomItems(id, 2);
    res.json(choices);
  });

  router.get('/oiseaux/:id', (req, res) => {
    const id = req.params.id;
    const oiseau = oiseaux.find(o => o.id === id);
    res.json(oiseau);
  });

  return router;
}