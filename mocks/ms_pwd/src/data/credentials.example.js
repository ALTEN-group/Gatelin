// Mock credentials database (based on wapstr pwd entity)
// pwd placeholders are filled in by mocks/ms_pwd/scripts/generate-credentials.mjs -> credentials.js (gitignored)
// pwdHash is the @dwtechs/hashitaka encrypted form of the plaintext password shown in swagger
export const mockCredentials = [
  {
    id: 1,
    userId: 1,
    pwdHash: "__PWD_GATELIN_ADMIN__",
  },
  {
    id: 2,
    userId: 2,
    pwdHash: "__PWD_GATELIN_USER__",
  },
  {
    id: 3,
    userId: 3,
    pwdHash: "__PWD_GATELIN_SUPER_ADMIN__",
  },
  {
    id: 4,
    userId: 4,
    pwdHash: "__PWD_GATELIN_GUEST__",
  },
  {
    id: 5,
    userId: 5,
    pwdHash: "__PWD_EBOUTIQUE_USER__",
  },
  {
    id: 6,
    userId: 6,
    pwdHash: "__PWD_EBOUTIQUE_SUPER_ADMIN__",
  },
  {
    id: 7,
    userId: 7,
    pwdHash: "__PWD_EBOUTIQUE_ADMIN__",
  },
];
