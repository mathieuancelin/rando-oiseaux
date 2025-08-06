const validUsername = process.env.ADMIN_USERNAME || 'admin';
const validPassword = process.env.ADMIN_PASSWORD || 'password';

export default function adminMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required');
  }
  const credentials = Buffer.from(auth.slice(6), 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');
  if (username !== validUsername || password !== validPassword) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Invalid credentials');
  }
  next();
}
