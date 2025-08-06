import express from 'express';
import path from 'node:path';

const dir = path.resolve('./dist');
const port = process.env.PORT || 3000;

const app = express();

app.use(express.static(dir));

app.get('/', (req, res) => {
  const file = path.join(dir, 'index.html');
  console.log(`serving ${file}`);
  res.sendFile(file, (err) => {
    if (err) {
      res.status(404).send('Not found');
    }
  });
});

app.get('/*rest', (req, res) => {
  const file = path.join(dir, 'index.html');
  console.log(`serving ${file}`);
  res.sendFile(file, (err) => {
    if (err) {
      res.status(404).send('Not found');
    }
  });
});

app.listen(port, () => {
  console.log(`✅ Serving ${dir} on http://localhost:${port}`);
});