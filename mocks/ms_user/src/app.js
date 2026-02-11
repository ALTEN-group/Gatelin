import express from 'express';
import helmet from 'helmet';
import healixRouter from '@dwtechs/healix-express';
import { listen } from '@dwtechs/servpico-express';
import { log } from '@dwtechs/winstan';
import { mockUsers } from './data/users.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use('/health', healixRouter);

// POST /users/ - Get user by email filter (used by Gatelin getUserByEmail middleware)
app.post('/users/', (req, res) => {
  log.info(`POST /users/ - Get user by filters ${JSON.stringify(req.body)}`);
  
  const { filters } = req.body;
  
  if (!filters || !filters.email)
    return res.status(400).json({ error: 'Missing email filter' });

  const email = filters.email.value;
  const user = mockUsers.find(u => u.email === email);

  if (!user)
    return res.status(404).json({ error: 'User not found' });

  log.debug(`POST /users/ - success: ${JSON.stringify(user)}`);
  res.status(200).json({
    rows: [user],
    total: 1
  });
});


listen(app);
