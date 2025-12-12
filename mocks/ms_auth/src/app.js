import express from 'express';
import helmet from 'helmet';
import healixRouter from '@dwtechs/healix-express';
import { listen } from '@dwtechs/servpico-express';
import { log } from '@dwtechs/winstan';
import { isEmail, isStringOfLength, isArray } from '@dwtechs/checkard';
import { mockCredentials } from './data/credentials.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use('/health', healixRouter);

// POST /login/ - Validate user credentials (used by Gatelin check-pwd middleware)
app.post('/login/', (req, res) => {
  log.debug('POST /login/ - Full request body:', JSON.stringify(req.body, null, 2));
  
  // Validate request body format
  if (!isArray(req.body.rows, ">=", 1))
    return res.status(400).json({ error: 'Invalid request format: rows array required' });
  
  const email = req.body.rows[0].email;
  const password = req.body.rows[0].pwd;
  
  log.info('POST /login/ - Extracted credentials', { email, password });
  
  // Validate email format
  if (!isEmail(email))
    return res.status(400).json({ error: 'Invalid email format' });

  // Validate password (min 1, max 128 characters)
  if (!isStringOfLength(password, 1, 128))
    return res.status(400).json({ error: 'Invalid password format' });

  // Check credentials
  const credential = mockCredentials.find(
    c => c.email === email && c.pwdHash === password
  );

  if (!credential)
    return res.status(401).json({ error: 'Invalid credentials' });

  res.status(200).json({
    success: true,
    message: 'Authentication successful'
  });
});

listen(app);
