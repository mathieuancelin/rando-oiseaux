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

let redis = null;

function connectRedis() {
  console.log('connecting to redis');
  redis = createClient({
    url: process.env.REDIS_URL || 'redis://:iNsq9Zebs6yUJhwvDEw@bnlzmallvkrlichobfur-redis.services.clever-cloud.com:40414',
    socket: {
      // délai max entre 2 tentatives de connexion
      reconnectStrategy: (retries) => {
        // retries = nombre de tentatives déjà effectuées
        if (retries > 10) {
          // abandonner après 10 tentatives
          console.error('Redis: too many reconnection attempts, giving up.');
          return new Error('Redis reconnection failed');
        }
        const delay = Math.min(retries * 500, 5000); // backoff linéaire max 5s
        console.warn(`Redis: reconnecting in ${delay}ms (attempt #${retries})`);
        return delay;
      },
      connectTimeout: 10000,     // 10s pour se connecter
      keepAlive: 5000            // ping TCP réguliers
    }
  });
  // Événements utiles pour logguer/debugger
  redis.on('connect', () => {
    console.log('Redis: connecting…');
  });

  redis.on('ready', () => {
    console.log('Redis: connection ready ✅');
  });

  redis.on('end', () => {
    console.warn('Redis: connection closed');
  });
  redis.on('reconnecting', () => {
    console.warn('Redis: reconnecting…');
  });
  // on redis error like socket close, relaunch connection
  redis.on('error', (e) => {
    console.log('Redis Client Error', e);
    // try {
    //   if (redis) redis.close();
    //   console.log('try to reconnect')
    //   connectRedis();
    // } catch (ex) {
    //   console.log('Redis Client close error', ex);
    // }
  });
  return redis;
}

function serveIndex(req, res) {
  console.log('serveIndex', req.url);
  res.sendFile(path.resolve('./dist/index.html'));
}

function getRedis() {
  return redis;
}

connectRedis();

redis.connect().then(() => {
  
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.use('/admin', authMiddleware);
  app.use('/admin*rest', authMiddleware);
  app.use('/admin/api', adminRoutes(getRedis, s3Client));
  app.use('/api', apiRoutes(getRedis));

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
