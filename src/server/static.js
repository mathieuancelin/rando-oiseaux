import express from 'express';
import path from 'node:path';

const dir = path.resolve('./dist');

const router = express.Router()

router.use(express.static(dir)); 

router.get('/', (req, res) => {
  const file = path.join(dir, 'index.html');
  console.log(`serving ${file}`);
  res.sendFile(file, (err) => {
    if (err) {
      res.status(404).send('Not found');
    }
  });
});

router.get('/*rest', (req, res) => {
  const file = path.join(dir, 'index.html');
  console.log(`serving ${file}`);
  res.sendFile(file, (err) => {
    if (err) {
      res.status(404).send('Not found');
    }
  });
});

export default router;

