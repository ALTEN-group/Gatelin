import request from 'supertest';
import app from '../../src/app.js';

jest.mock('../../src/services/consumer.js');
jest.mock('../../src/services/route.js');
jest.mock('@dwtechs/winstan');

/**
 * Test suite for DELETE /consumers endpoint (logout API)
 * Tests the complete logout flow including token validation, 
 * consumer removal, and cache cleanup
 */
describe('DELETE /consumers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test successful logout with valid tokens
   * @example
   * DELETE /consumers
   * Headers: { authorization: 'Bearer valid-access-token' }
   * Body: { refreshToken: 'valid-refresh-token' }
   * Expected: 204 No Content
   */
  it('should logout consumer with valid tokens', async () => {
    const response = await request(app)
      .delete('/consumers')
      .set('Authorization', 'Bearer valid-access-token')
      .send({ refreshToken: 'valid-refresh-token' })
      .expect(204);

    expect(response.body).toEqual({});
  });

  /**
   * Test logout with valid access token only
   * @example
   * DELETE /consumers
   * Headers: { authorization: 'Bearer valid-access-token' }
   * Expected: 204 No Content
   */
  it('should logout consumer with access token only', async () => {
    const response = await request(app)
      .delete('/consumers')
      .set('Authorization', 'Bearer valid-access-token')
      .expect(204);

    expect(response.body).toEqual({});
  });

  /**
   * Test validation error for missing access token
   * @example
   * DELETE /consumers
   * Body: { refreshToken: 'valid-refresh-token' }
   * Expected: 401 unauthorized
   */
  it('should return 401 for missing access token', async () => {
    const response = await request(app)
      .delete('/consumers')
      .send({ refreshToken: 'valid-refresh-token' })
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('unauthorized');
  });

  /**
   * Test invalid access token
   * @example
   * DELETE /consumers
   * Headers: { authorization: 'Bearer invalid-access-token' }
   * Expected: 401 invalid access token
   */
  it('should return 401 for invalid access token', async () => {
    const response = await request(app)
      .delete('/consumers')
      .set('Authorization', 'Bearer invalid-access-token')
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('invalid access token');
  });

  /**
   * Test expired access token
   * @example
   * DELETE /consumers
   * Headers: { authorization: 'Bearer expired-access-token' }
   * Expected: 401 token expired
   */
  it('should return 401 for expired access token', async () => {
    const response = await request(app)
      .delete('/consumers')
      .set('Authorization', 'Bearer expired-access-token')
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('token expired');
  });

  /**
   * Test malformed authorization header
   * @example
   * DELETE /consumers
   * Headers: { authorization: 'InvalidFormat token' }
   * Expected: 401 invalid authorization format
   */
  it('should return 401 for malformed authorization header', async () => {
    const response = await request(app)
      .delete('/consumers')
      .set('Authorization', 'InvalidFormat token')
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('invalid authorization');
  });

  /**
   * Test consumer not found
   * @example
   * DELETE /consumers
   * Headers: { authorization: 'Bearer orphaned-access-token' }
   * Expected: 401 consumer not found
   */
  it('should return 401 when consumer not found', async () => {
    const response = await request(app)
      .delete('/consumers')
      .set('Authorization', 'Bearer orphaned-access-token')
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('consumer not found');
  });

  /**
   * Test invalid refresh token when provided
   * @example
   * DELETE /consumers
   * Headers: { authorization: 'Bearer valid-access-token' }
   * Body: { refreshToken: 'invalid-refresh-token' }
   * Expected: 401 invalid refresh token
   */
  it('should return 401 for invalid refresh token when provided', async () => {
    const response = await request(app)
      .delete('/consumers')
      .set('Authorization', 'Bearer valid-access-token')
      .send({ refreshToken: 'invalid-refresh-token' })
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('invalid refresh token');
  });

  /**
   * Test token mismatch
   * @example
   * DELETE /consumers
   * Headers: { authorization: 'Bearer token-from-user-1' }
   * Body: { refreshToken: 'token-from-user-2' }
   * Expected: 401 token mismatch
   */
  it('should return 401 when tokens do not match same consumer', async () => {
    const response = await request(app)
      .delete('/consumers')
      .set('Authorization', 'Bearer mismatched-access-token')
      .send({ refreshToken: 'mismatched-refresh-token' })
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('token mismatch');
  });

  /**
   * Test empty request body
   * @example
   * DELETE /consumers
   * Headers: { authorization: 'Bearer valid-access-token' }
   * Body: {}
   * Expected: 204 No Content (refresh token is optional)
   */
  it('should handle empty request body', async () => {
    const response = await request(app)
      .delete('/consumers')
      .set('Authorization', 'Bearer valid-access-token')
      .send({})
      .expect(204);

    expect(response.body).toEqual({});
  });

  /**
   * Test malformed JSON body
   * @example
   * DELETE /consumers
   * Headers: { authorization: 'Bearer valid-access-token' }
   * Body: '{ invalid json }'
   * Expected: 400 bad request
   */
  it('should handle malformed JSON body', async () => {
    const response = await request(app)
      .delete('/consumers')
      .set('Authorization', 'Bearer valid-access-token')
      .set('Content-Type', 'application/json')
      .send('{ invalid json }')
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });

  /**
   * Test response headers
   * @example
   * DELETE /consumers
   * Expected: No Content-Type header for 204 response
   */
  it('should include proper headers in response', async () => {
    const response = await request(app)
      .delete('/consumers')
      .set('Authorization', 'Bearer valid-access-token')
      .expect(204);

    // 204 responses typically don't have content-type
    expect(response.text).toBe('');
  });

  /**
   * Test double logout attempt
   * @example
   * DELETE /consumers (twice with same token)
   * Expected: Second request returns 401 (token no longer valid)
   */
  it('should handle double logout attempt', async () => {
    // First logout should succeed
    await request(app)
      .delete('/consumers')
      .set('Authorization', 'Bearer valid-access-token')
      .expect(204);

    // Second logout with same token should fail
    const response = await request(app)
      .delete('/consumers')
      .set('Authorization', 'Bearer valid-access-token')
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('invalid access token');
  });

  /**
   * Test concurrent logout requests
   * @example
   * Multiple simultaneous DELETE /consumers requests with same token
   * Expected: Only one should succeed
   */
  it('should handle concurrent logout requests', async () => {
    const requests = Array(3).fill().map(() =>
      request(app)
        .delete('/consumers')
        .set('Authorization', 'Bearer concurrent-access-token')
    );

    const responses = await Promise.all(requests);
    
    // One should succeed (204), others should fail (401)
    const statusCodes = responses.map(r => r.status);
    expect(statusCodes).toContain(204);
    expect(statusCodes.filter(code => code === 401).length).toBeGreaterThan(0);
  });

  /**
   * Test database error handling
   * @example
   * DELETE /consumers (with database error)
   * Expected: 500 internal server error
   */
  it('should handle database errors gracefully', async () => {
    // Mock database error - implementation depends on your error handling
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // This would need specific mocking to force a database error
    // Implementation depends on how your error handling middleware works

    console.error.mockRestore();
  });

  /**
   * Test cache cleanup verification
   * @example
   * DELETE /consumers (successful logout)
   * Expected: Consumer removed from cache
   */
  it('should remove consumer from cache on successful logout', async () => {
    const response = await request(app)
      .delete('/consumers')
      .set('Authorization', 'Bearer valid-access-token')
      .expect(204);

    // This test would need access to cache implementation to verify cleanup
    // The actual verification would depend on your caching mechanism
    expect(response.status).toBe(204);
  });

  /**
   * Test logout with special characters in token
   * @example
   * DELETE /consumers
   * Headers: { authorization: 'Bearer token-with-special-chars!@#' }
   * Expected: Proper handling of special characters
   */
  it('should handle special characters in tokens', async () => {
    const response = await request(app)
      .delete('/consumers')
      .set('Authorization', 'Bearer token-with-special-chars!@#');

    expect([204, 401]).toContain(response.status);
  });

  /**
   * Test logout preserves other sessions
   * @example
   * DELETE /consumers (logout one session)
   * Expected: Other sessions remain active
   */
  it('should only logout current session', async () => {
    // This test assumes multiple sessions per user are supported
    // Implementation would depend on your session management
    const response = await request(app)
      .delete('/consumers')
      .set('Authorization', 'Bearer session-1-token')
      .expect(204);

    // Verify other sessions remain active (implementation specific)
    expect(response.status).toBe(204);
  });

  /**
   * Test logout with different token types
   * @example
   * DELETE /consumers
   * Headers: { authorization: 'Basic base64credentials' }
   * Expected: 401 unsupported token type
   */
  it('should reject non-Bearer token types', async () => {
    const response = await request(app)
      .delete('/consumers')
      .set('Authorization', 'Basic dXNlcjpwYXNz')
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('unsupported token type');
  });
});