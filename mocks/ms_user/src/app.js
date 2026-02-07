import express from 'express';
import helmet from 'helmet';
import healixRouter from '@dwtechs/healix-express';
import { listen } from '@dwtechs/servpico-express';
import { log } from '@dwtechs/winstan';
import { mockUsers } from './data/users.js';
import { mockRoles } from './data/roles.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use('/health', healixRouter);

// Mock access/permissions data
const mockAccess = [
  { id: 1, routeId: 1, roleId: 1, roleName: 'admin', routePattern: '/users', method: 'POST' },
  { id: 2, routeId: 2, roleId: 1, roleName: 'admin', routePattern: '/users', method: 'PUT' },
  { id: 3, routeId: 3, roleId: 2, roleName: 'user', routePattern: '/profile', method: 'GET' }
];

// GET /roles - Get all roles
app.post('/users/roles/search/', (req, res) => {
  log.info('POST /users/roles/search/ - Get all roles');
  
  res.status(200).json({
    rows: mockRoles,
    total: mockRoles.length
  });
});

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

// GET /access - Get access/permissions (used by Gatelin access service)
app.get('/access', (req, res) => {
  log.info('GET /access - Get access permissions');
  
  res.status(200).json({
    rows: mockAccess,
    total: mockAccess.length
  });
});


listen(app);
