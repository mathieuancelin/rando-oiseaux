const express = require('express');
const path = require('path');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));
const dir = path.resolve(argv.dir || './docs');
const port = argv.port|| process.env.PORT || 3000;

const app = express();

app.use(express.static(dir));

app.get('/', (req, res) => {
  res.sendFile(path.join(dir, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Not found');
    }
  });
});

app.get('/new', (req, res) => {
  res.sendFile(path.join(dir, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Not found');
    }
  });
});

app.listen(port, () => {
  console.log(`✅ Serving ${dir} on http://localhost:${port}`);
});