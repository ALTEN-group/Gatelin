import express from "express";
import helmet from "helmet";
import healixRouter from "@dwtechs/healix-express";
import { listen } from "@dwtechs/servpico-express";
import { log } from "@dwtechs/winstan";
import { errorHandler } from "@dwtechs/errandler-express";
import { mockUsers } from "./data/users.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use("/users/health", healixRouter);

// POST /users/search - Get user by filter (used by Gatelin getUserByEmail middleware)
app.post("/users/users/search/", (req, res) => {
  log.info(
    `POST /users/users/search/ - Get user by filters ${JSON.stringify(req.body)}`,
  );

  const { filters } = req.body;

  if (!filters || (!filters.email && !filters.id))
    return res.status(400).json({ error: "Missing email or id filter" });

  let user;

  if (filters.email) {
    const email = filters.email.value;
    user = mockUsers.find((u) => u.email === email);
  } else if (filters.id) {
    const id = filters.id.value;
    user = mockUsers.find((u) => u.id === id);
  }

  if (!user) return res.status(404).json({ error: "User not found" });

  log.debug(`POST /users/users/search/ - success: ${JSON.stringify(user)}`);
  res.status(200).json({
    rows: [user],
    total: 1,
  });
});

// GET /users/me - Get authenticated user's essential info (for login/navbar)
app.get("/users/users/me/", (req, res) => {
  log.info(
    "GET /users/users/me/ - Get authenticated user essentials from x-consumer-user-id header",
  );

  const userId = req.headers["x-consumer-user-id"];
  log.debug(`Extracted userId from x-consumer-user-id header: ${userId}`);
  const user = mockUsers.find((u) => u.id === +userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const essentials = {
    nickname: user.nickname,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  log.debug(`GET /users/users/me/ - success: ${user.nickname}`);
  res.status(200).json(essentials);
});

// // GET /users/:id - Get user account by ID (used after login)
// app.get('/users/users/:id', (req, res) => {
//   const userId = parseInt(req.params.id, 10);
//   log.info(`GET /users/users/${userId} - Get user account`);

//   if (isNaN(userId) || userId <= 0)
//     return res.status(400).json({ error: 'Invalid user ID' });

//   const user = mockUsers.find(u => u.id === userId);

//   if (!user)
//     return res.status(404).json({ error: 'User not found' });

//   if (user.archived)
//     return res.status(404).json({ error: 'User archived' });

//   log.debug(`GET /users/users/${userId} - success: ${user.nickname}`);
//   res.status(200).json(user);
// });

errorHandler(app);

listen(app);
