// Mock credentials database (based on wapstr pwd entity)
// pwd placeholders are filled in by mocks/ms_pwd/scripts/generate-credentials.mjs -> credentials.js (gitignored)
// pwdHash is the @dwtechs/hashitaka encrypted form of the plaintext password shown in swagger
//
// The auth-state columns below mirror the Foxnox `pwd` row returned by POST /foxnox/compare.
// Gatelin's challenge-login middleware reads them to decide whether a mid-login
// challenge (2FA / expired password) is required, so each state has a dedicated user:
//   userId 1 (admin@example.com)  — clean login, used by the e2e suite
//   userId 3 (coco@example.com)   — 2FA challenge then trusted-device prompt
//   userId 4 (guest@example.com)  — expired password rotation
//   userId 5 (ebuser@example.com) — locked out until 2099
export const mockCredentials = [
  {
    id: 1,
    userId: 1,
    pwdHash: "__PWD_GATELIN_ADMIN__",
    pwdExpiry: null,
    failedAttempts: 0,
    lockedUntil: null,
    twoFactorEnabled: false,
  },
  {
    id: 2,
    userId: 2,
    pwdHash: "__PWD_GATELIN_USER__",
    pwdExpiry: null,
    failedAttempts: 0,
    lockedUntil: null,
    twoFactorEnabled: false,
  },
  {
    id: 3,
    userId: 3,
    pwdHash: "__PWD_GATELIN_SUPER_ADMIN__",
    pwdExpiry: null,
    failedAttempts: 0,
    lockedUntil: null,
    twoFactorEnabled: true,
  },
  {
    id: 4,
    userId: 4,
    pwdHash: "__PWD_GATELIN_GUEST__",
    pwdExpiry: "2020-01-01T00:00:00.000Z",
    failedAttempts: 0,
    lockedUntil: null,
    twoFactorEnabled: false,
  },
  {
    id: 5,
    userId: 5,
    pwdHash: "__PWD_EBOUTIQUE_USER__",
    pwdExpiry: null,
    failedAttempts: 3,
    lockedUntil: "2099-01-01T00:00:00.000Z",
    twoFactorEnabled: false,
  },
  {
    id: 6,
    userId: 6,
    pwdHash: "__PWD_EBOUTIQUE_SUPER_ADMIN__",
    pwdExpiry: null,
    failedAttempts: 0,
    lockedUntil: null,
    twoFactorEnabled: false,
  },
  {
    id: 7,
    userId: 7,
    pwdHash: "__PWD_EBOUTIQUE_ADMIN__",
    pwdExpiry: null,
    failedAttempts: 0,
    lockedUntil: null,
    twoFactorEnabled: false,
  },
];
