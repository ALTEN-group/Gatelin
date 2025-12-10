import express from 'express';
import helmet from 'helmet';
import healixRouter from '@dwtechs/healix-express';
import { listen } from '@dwtechs/servpico-express';
import { mockCredentials } from './data/credentials.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use('/health', healixRouter);

// POST /login/ - Validate user credentials (used by Gatelin check-pwd middleware)
app.post('/login/', (req, res) => {
  console.log('POST /login/ - Full request body:', JSON.stringify(req.body, null, 2));
  
  // Handle both direct format and rows format
  let email, password;
  
  if (req.body.rows && req.body.rows[0]) {
    // Format: {rows: [{email, pwd}], ...}
    email = req.body.rows[0].email;
    password = req.body.rows[0].pwd;
  } else {
    // Format: {email, password}
    email = req.body.email;
    password = req.body.password || req.body.pwd;
  }
  
  console.log('POST /login/ - Extracted credentials', { email, password: password ? '***' : undefined });
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  // Check credentials
  const credential = mockCredentials.find(
    c => c.email === email && c.pwdHash === password
  );

  if (!credential) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.status(200).json({
    success: true,
    message: 'Authentication successful'
  });
});

listen(app);
