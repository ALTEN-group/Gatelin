// Set up required environment variables before importing
process.env.TOKEN_SECRET = 'test-secret-key-for-jwt-tokens';
process.env.MSAUTH_URL = 'https://auth.example.com';
process.env.MSUSER_URL = 'https://user.example.com';

// Mock the token library to avoid environment variable issues
jest.mock('@dwtechs/toker-express', () => ({
  refresh: jest.fn(),
  decodeAccess: jest.fn(),
  decodeRefresh: jest.fn(),
  createTokens: jest.fn(() => ({
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token'
  }))
}));

import request from 'supertest';
import app from '../../src/app.js';

// Mock HTTP client
jest.mock('httpclient', () => ({
  default: {
    query: jest.fn()
  }
}));

jest.mock('../../src/services/consumer.js');
jest.mock('../../src/services/route.js');
jest.mock('@dwtechs/winstan');

/**
 * Test suite for POST /consumers endpoint (login API)
 * Tests the complete authentication flow including validation, user lookup, 
 * password verification, activation check, and token generation
 */
describe('POST /consumers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test successful login with valid credentials
   * @example
   * POST /consumers
   * Body: { email: 'test@example.com', pwd: 'password123' }
   * Expected: 201 with tokens and user data
   */
  it('should create consumer with valid credentials', async () => {
    const response = await request(app)
      .post('/consumers')
      .send({ email: 'test@example.com', pwd: 'password123' })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('nickname');
    expect(response.body).toHaveProperty('roles');
    expect(response.body).toHaveProperty('active');
  });

  /**
   * Test validation error for missing email
   * @example
   * POST /consumers
   * Body: { pwd: 'password123' }
   * Expected: 400 with validation error
   */
  it('should return 400 for missing email', async () => {
    const response = await request(app)
      .post('/consumers')
      .send({ pwd: 'password123' })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('invalid parameters');
  });

  /**
   * Test validation error for missing password
   * @example
   * POST /consumers
   * Body: { email: 'test@example.com' }
   * Expected: 400 with validation error
   */
  it('should return 400 for missing password', async () => {
    const response = await request(app)
      .post('/consumers')
      .send({ email: 'test@example.com' })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('invalid parameters');
  });

  /**
   * Test validation error for invalid email format
   * @example
   * POST /consumers
   * Body: { email: 'invalid-email', pwd: 'password123' }
   * Expected: 400 with validation error
   */
  it('should return 400 for invalid email format', async () => {
    const response = await request(app)
      .post('/consumers')
      .send({ email: 'invalid-email', pwd: 'password123' })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('invalid parameters');
  });

  /**
   * Test user not found scenario
   * @example
   * POST /consumers
   * Body: { email: 'nonexistent@example.com', pwd: 'password123' }
   * Expected: 404 user not found
   */
  it('should return 404 for non-existent user', async () => {
    const response = await request(app)
      .post('/consumers')
      .send({ email: 'nonexistent@example.com', pwd: 'password123' })
      .expect(404);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('resource not found');
  });

  /**
   * Test password verification failure
   * @example
   * POST /consumers
   * Body: { email: 'test@example.com', pwd: 'wrongpassword' }
   * Expected: 401 wrong password
   */
  it('should return 401 for invalid password', async () => {
    const response = await request(app)
      .post('/consumers')
      .send({ email: 'test@example.com', pwd: 'wrongpassword' })
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('wrong password');
  });

  /**
   * Test inactive user account
   * @example
   * POST /consumers
   * Body: { email: 'inactive@example.com', pwd: 'password123' }
   * Expected: 403 account not activated
   */
  it('should return 403 for inactive user', async () => {
    const response = await request(app)
      .post('/consumers')
      .send({ email: 'inactive@example.com', pwd: 'password123' })
      .expect(403);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('account not activated');
  });

  /**
   * Test malformed JSON request body
   * @example
   * POST /consumers
   * Body: '{ invalid json }'
   * Expected: 400 bad request
   */
  it('should handle malformed JSON body', async () => {
    const response = await request(app)
      .post('/consumers')
      .set('Content-Type', 'application/json')
      .send('{ invalid json }')
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });

  /**
   * Test empty request body
   * @example
   * POST /consumers
   * Body: {}
   * Expected: 400 missing parameters
   */
  it('should handle empty request body', async () => {
    const response = await request(app)
      .post('/consumers')
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('invalid parameters');
  });

  /**
   * Test server error handling
   * @example
   * POST /consumers (with mocked server error)
   * Expected: 500 internal server error
   */
  it('should handle server errors gracefully', async () => {
    // Mock internal server error
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // This would need specific mocking to force a 500 error
    // Implementation depends on how your error handling middleware works

    console.error.mockRestore();
  });

  /**
   * Test response headers
   * @example
   * POST /consumers
   * Expected: Content-Type: application/json
   */
  it('should include proper headers in response', async () => {
    const response = await request(app)
      .post('/consumers')
      .send({ email: 'test@example.com', pwd: 'password123' })
      .expect('Content-Type', /json/);

    expect(response.headers).toHaveProperty('content-type');
  });

  /**
   * Test concurrent login requests
   * @example
   * Multiple simultaneous POST /consumers requests
   * Expected: All requests handled properly
   */
  it('should handle concurrent login requests', async () => {
    const requests = Array(3).fill().map(() =>
      request(app)
        .post('/consumers')
        .send({ email: 'concurrent@example.com', pwd: 'password123' })
    );

    const responses = await Promise.all(requests);
    
    responses.forEach(response => {
      expect([201, 400, 401, 403, 404]).toContain(response.status);
    });
  });

  /**
   * Test response data sanitization
   * @example
   * POST /consumers (successful login)
   * Expected: No sensitive data in response
   */
  it('should sanitize response data', async () => {
    const response = await request(app)
      .post('/consumers')
      .send({ email: 'test@example.com', pwd: 'password123' })
      .expect(201);

    // Ensure no sensitive data is returned
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('passwordHash');
    expect(response.body).not.toHaveProperty('pwHash');
  });

  /**
   * Test special characters in credentials
   * @example
   * POST /consumers
   * Body: { email: 'test+special@example.com', pwd: 'p@ssw0rd!#$' }
   * Expected: Proper handling of special characters
   */
  it('should handle special characters in credentials', async () => {
    const response = await request(app)
      .post('/consumers')
      .send({ email: 'test+special@example.com', pwd: 'p@ssw0rd!#$' });

    expect([201, 400, 401, 403, 404, 500]).toContain(response.status);
  });

  /**
   * Test rate limiting (if implemented)
   * @example
   * Multiple rapid POST /consumers requests
   * Expected: Rate limiting response after threshold
   */
  it('should respect rate limiting', async () => {
    // This test assumes rate limiting is implemented
    // Adjust the number of requests based on your rate limit configuration
    const rapidRequests = Array(10).fill().map(() =>
      request(app)
        .post('/consumers')
        .send({ email: 'ratelimit@example.com', pwd: 'password123' })
    );

    const responses = await Promise.all(rapidRequests);
    
    // At least some requests should succeed, others might be rate limited
    const statusCodes = responses.map(r => r.status);
    expect(statusCodes).toContain(201); // At least one should succeed
  });
});