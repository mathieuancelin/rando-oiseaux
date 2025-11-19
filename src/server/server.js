import express from 'express';
import { createClient } from 'redis';
import staticRoutes from './static.js';
import authMiddleware from './auth.js';
import apiRoutes from './api.js';
import adminRoutes from './admin.js';
import { S3Client } from "@aws-sdk/client-s3";
import path from 'node:path';

const port = process.env.PORT || 3022;

const s3Client = new S3Client({
  endpoint: process.env.CELLAR_ADDON_HOST || 'https://cellar-c2.services.clever-cloud.com',
  region: 'eu-west-2',
  credentials: {
    accessKeyId: process.env.CELLAR_ADDON_KEY_ID || 'JEI0SHI40A7Y5L2HUVE2',
    secretAccessKey: process.env.CELLAR_ADDON_KEY_SECRET || 'xVjXES9xmzltv1BU9YPjPCoGWoGvBkZQZLk7rsAW'
  }
});

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://:iNsq9Zebs6yUJhwvDEw@bnlzmallvkrlichobfur-redis.services.clever-cloud.com:40414'
});

function serveIndex(req, res) {
  console.log('serveIndex', req.url);
  res.sendFile(path.resolve('./dist/index.html'));
}

redis.on('error', err => console.log('Redis Client Error', err));

redis.connect().then(() => {
  
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.use('/admin', authMiddleware);
  app.use('/admin*rest', authMiddleware);
  app.use('/admin/api', adminRoutes(redis, s3Client));
  app.use('/api', apiRoutes(redis));

  // app.get('/admin/scores', serveIndex);
  // app.get('/admin', serveIndex);
  // app.get('/oiseau/:uuid', serveIndex);
  // app.get('/qrcode/score', serveIndex);
  // app.get('/qrcode/:uuid', serveIndex);
  // app.get('/score', serveIndex);
  // app.get('/scores', serveIndex);
  // app.get('/index.html', staticRoutes);
  app.use('/', staticRoutes);

  app.listen(port, () => {
    console.log(`✅ Serving on http://0.0.0.0:${port}`);
  });
});
