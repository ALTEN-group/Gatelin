// Mock credentials database (based on wapstr pwd entity)
// pwd placeholders are filled in by scripts/setup-mocks.sh -> credentials.js (gitignored)
// Note: In production, pwdHash would be actual hashed passwords
// For mock purposes, we store plain passwords for validation
export const mockCredentials = [
  {
    id: 1,
    userId: 1,
    pwd: "__PWD_GATELIN_ADMIN__", // In real app, this would be hashed
  },
  {
    id: 2,
    userId: 2,
    pwd: "__PWD_GATELIN_USER__",
  },
  {
    id: 3,
    userId: 3,
    pwd: "__PWD_GATELIN_SUPER_ADMIN__",
  },
  {
    id: 4,
    userId: 4,
    pwd: "__PWD_GATELIN_GUEST__",
  },
  {
    id: 5,
    userId: 5,
    pwd: "__PWD_EBOUTIQUE_USER__",
  },
  {
    id: 6,
    userId: 6,
    pwd: "__PWD_EBOUTIQUE_SUPER_ADMIN__",
  },
  {
    id: 7,
    userId: 7,
    pwd: "__PWD_EBOUTIQUE_ADMIN__",
  },
];
