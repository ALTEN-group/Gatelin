// Mock credentials database (based on wapstr pwd entity)
// Note: In production, pwdHash would be actual hashed passwords
// For mock purposes, we store plain passwords for validation
export const mockCredentials = [
  {
    id: 1,
    userId: 1,
    pwd: 'Admin1234!' // In real app, this would be hashed
  },
  {
    id: 2,
    userId: 2,
    pwd: 'Test1234!'
  },
  {
    id: 3,
    userId: 3,
    pwd: 'admin34!U'
  },
  {
    id: 4,
    userId: 4,
    pwd: 'User1234!'
  },
  {
    id: 5,
    userId: 5,
    pwd: 'p@s5WOrd!99'
  }
];
