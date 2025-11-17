import express from 'express';
import { createClient } from 'redis';
import staticRoutes from './static.js';
import authMiddleware from './auth.js';
import apiRoutes from './api.js';
import adminRoutes from './admin.js';

const port = process.env.PORT || 3022;

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://:iNsq9Zebs6yUJhwvDEw@bnlzmallvkrlichobfur-redis.services.clever-cloud.com:40414'
});
redis.on('error', err => console.log('Redis Client Error', err));
redis.connect().then(() => {
  
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.use('/admin', authMiddleware);
  app.use('/admin*rest', authMiddleware);

  app.use('/admin/api', adminRoutes(redis));
  app.use('/api', apiRoutes(redis));
  app.use('/', staticRoutes);

  app.listen(port, () => {
    console.log(`✅ Serving on http://0.0.0.0:${port}`);
  });
});
