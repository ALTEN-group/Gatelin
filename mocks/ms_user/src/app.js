import express from 'express';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());

// Mock users database
const mockUsers = [
  {
    id: 'user1',
    email: 'admin@example.com',
    nickname: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    roles: ['admin', 'user'],
    active: true,
    portrait: null
  },
  {
    id: 'user2',
    email: 'test@example.com',
    nickname: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    roles: ['user'],
    active: true,
    portrait: null
  },
  {
    id: 'user3',
    email: 'ludoclub@hotmail.com',
    nickname: 'ludoclub',
    firstName: 'Ludovic',
    lastName: 'Club',
    roles: ['admin', 'user'],
    active: true,
    portrait: null
  }
];

// Mock access/routes data
const mockAccess = [
  { id: 1, routeId: 1, roleId: 1, roleName: 'admin', routePattern: '/users', method: 'POST' },
  { id: 2, routeId: 2, roleId: 1, roleName: 'admin', routePattern: '/users', method: 'PUT' },
  { id: 3, routeId: 3, roleId: 2, roleName: 'user', routePattern: '/profile', method: 'GET' }
];

// POST /users/ - Get user by filters (used by getUserByEmail middleware)
app.post('/users/', (req, res) => {
  console.log('POST /users/ - Get user by filters', req.body);
  
  const { filters } = req.body;
  
  if (!filters || !filters.email) {
    return res.status(400).json({ error: 'Missing email filter' });
  }

  const email = filters.email.value;
  const user = mockUsers.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json({
    rows: [user],
    total: 1
  });
});

// GET /users - Get all users
app.get('/users', (req, res) => {
  console.log('GET /users - Get all users');
  
  res.status(200).json({
    rows: mockUsers,
    total: mockUsers.length
  });
});

// GET /users/:id - Get user by ID
app.get('/users/:id', (req, res) => {
  console.log('GET /users/:id - Get user by ID', req.params.id);
  
  const user = mockUsers.find(u => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json({
    rows: [user],
    total: 1
  });
});

// POST /users - Create new user
app.post('/users', (req, res) => {
  console.log('POST /users - Create new user', req.body);
  
  const newUser = {
    id: `user${mockUsers.length + 1}`,
    ...req.body,
    active: true,
    portrait: null
  };

  mockUsers.push(newUser);

  res.status(201).json({
    rows: [newUser],
    total: 1
  });
});

// PUT /users - Update users
app.put('/users', (req, res) => {
  console.log('PUT /users - Update users', req.body);
  
  res.status(200).json({
    rows: [],
    total: 0,
    message: 'Users updated successfully'
  });
});

// GET /access - Get access/permissions
app.get('/access', (req, res) => {
  console.log('GET /access - Get access permissions');
  
  res.status(200).json({
    rows: mockAccess,
    total: mockAccess.length
  });
});

// PUT /access - Update access permissions
app.put('/access', (req, res) => {
  console.log('PUT /access - Update access permissions', req.body);
  
  res.status(200).json({
    rows: [],
    total: 0,
    message: 'Access updated successfully'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'ms_user_mock' });
});

app.listen(PORT, () => {
  console.log(`ms_user mock server running on port ${PORT}`);
});
