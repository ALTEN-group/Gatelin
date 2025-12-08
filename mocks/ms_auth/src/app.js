import express from 'express';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());

// Mock credentials database
const validCredentials = [
  { email: 'admin@example.com', password: 'Admin1234!' },
  { email: 'test@example.com', password: 'Test1234!' },
  { email: 'user@example.com', password: 'User1234!' },
  { email: 'ludoclub@hotmail.com', password: 'admin34!U' },
  { email: 'john_doe@supermail.com', password: 'p@s5WOrd!99' }
];

// POST /login/ - Validate user credentials
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
  const user = validCredentials.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.status(200).json({
    success: true,
    message: 'Authentication successful'
  });
});

// POST /activate/ - Send activation email
app.post('/activate/', (req, res) => {
  console.log('POST /activate/ - Send activation email', req.body);
  
  const { id, email } = req.body;
  
  if (!id && !email) {
    return res.status(400).json({ error: 'Missing user id or email' });
  }

  res.status(200).json({
    success: true,
    message: 'Activation email sent',
    activationToken: 'mock-activation-token-123'
  });
});

// POST /reset-password/ - Send password reset email
app.post('/reset-password/', (req, res) => {
  console.log('POST /reset-password/ - Send reset email', req.body);
  
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  res.status(200).json({
    success: true,
    message: 'Password reset email sent',
    resetToken: 'mock-reset-token-456'
  });
});

// POST /verify-token/ - Verify authentication token
app.post('/verify-token/', (req, res) => {
  console.log('POST /verify-token/ - Verify token', req.body);
  
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  // Mock validation - accept any non-empty token
  res.status(200).json({
    valid: true,
    userId: 'user123'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'ms_auth_mock' });
});

app.listen(PORT, () => {
  console.log(`ms_auth mock server running on port ${PORT}`);
});
