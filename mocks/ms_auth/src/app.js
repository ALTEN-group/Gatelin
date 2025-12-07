import express from 'express';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());

// Mock credentials database
const validCredentials = [
  { email: 'admin@example.com', password: 'admin123' },
  { email: 'test@example.com', password: 'test123' },
  { email: 'user@example.com', password: 'user123' }
];

// POST /login/ - Validate user credentials
app.post('/login/', (req, res) => {
  console.log('POST /login/ - Validate credentials', { email: req.body.email });
  
  const { email, password } = req.body;
  
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
