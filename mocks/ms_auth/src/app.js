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
  log.debug(`POST /login/ - Full request body: ${JSON.stringify(req.body, null, 2)}`);
  
  // Extract filters
  const userId = req.body.filters?.userId?.value;
  const pwd = req.body.filters?.pwd?.value;
  
  // Validate userId format
  if (!Number.isInteger(userId) || userId <= 0)
    return res.status(400).json({ error: 'Invalid userId format' });

  // Validate pwd (min 1, max 255 characters)
  if (!isStringOfLength(pwd, 1, 255))
    return res.status(400).json({ error: 'Invalid pwd format' });
  // Check credentials
  const credential = mockCredentials.find(
    c => c.userId === userId && c.pwd === pwd
  );

  if (!credential)
    return res.status(401).json({ error: 'Invalid credentials' });

  log.debug(`POST /login/ - success: ${JSON.stringify(credential)}`);
  res.status(200).json({
    success: true,
    message: 'Authentication successful'
  });
});

listen(app);
