// Mock credentials database (based on wapstr pwd entity)
// Note: In production, pwdHash would be actual hashed passwords
// For mock purposes, we store plain passwords for validation
export const mockCredentials = [
  {
    id: 1,
    userId: 1,
    email: 'admin@example.com',
    pwdHash: 'Admin1234!' // In real app, this would be hashed
  },
  {
    id: 2,
    userId: 2,
    email: 'test@example.com',
    pwdHash: 'Test1234!'
  },
  {
    id: 3,
    userId: 3,
    email: 'coco@example.com',
    pwdHash: 'admin34!U'
  },
  {
    id: 4,
    userId: 4,
    email: 'user@example.com',
    pwdHash: 'User1234!'
  },
  {
    id: 5,
    userId: 5,
    email: 'john_doe@supermail.com',
    pwdHash: 'p@s5WOrd!99'
  }
];
