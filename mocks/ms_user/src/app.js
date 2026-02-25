import express from "express";
import helmet from "helmet";
import healixRouter from "@dwtechs/healix-express";
import { listen } from "@dwtechs/servpico-express";
import { log } from "@dwtechs/winstan";
import { mockUsers } from "./data/users.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use("/users/health", healixRouter);

// Cache for roles fetched from ms_role service
let rolesCache = null;

/**
 * Fetch roles from ms_role service
 * @returns {Promise<Array>} Array of role objects with permissions
 */
async function fetchRoles() {
  if (rolesCache) return rolesCache;
  
  const url = process.env.MSROLE_SEARCH_URL;
  if (!url) {
    log.error("MSROLE_SEARCH_URL environment variable not set");
    return [];
  }

  try {
    log.debug(`Fetching roles from: ${url}`);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      log.error(`Failed to fetch roles: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    rolesCache = data.rows || [];
    log.info(`Fetched ${rolesCache.length} roles from ms_role service`);
    return rolesCache;
  } catch (error) {
    log.error(`Error fetching roles: ${error.message}`);
    return [];
  }
}

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

/**
 * Compute permissions for a user based on their roles
 * Merges all permissions from all user's roles and deduplicates
 * @param {number[]} userRoleIds - Array of role IDs
 * @param {Array} roles - Array of role objects from ms_role service
 * @returns {Array} Array of unique permissions
 */
function getUserPermissions(userRoleIds, roles) {
  const userRoles = roles.filter((role) => userRoleIds.includes(role.id));
  const allPermissions = userRoles.flatMap((role) => role.permissions);
  
  // Deduplicate permissions by route+operations
  const permissionsMap = new Map();
  allPermissions.forEach((perm) => {
    const key = perm.route;
    if (permissionsMap.has(key)) {
      // Merge operations arrays and deduplicate
      const existing = permissionsMap.get(key);
      const mergedOps = [...new Set([...existing.operations, ...perm.operations])];
      permissionsMap.set(key, { route: perm.route, operations: mergedOps });
    } else
      permissionsMap.set(key, { route: perm.route, operations: [...perm.operations] });
  });
  
  return Array.from(permissionsMap.values());
}

// GET /users/me - Get authenticated user's essential info (for login/navbar)
app.get("/users/users/me/", async (req, res) => {
  log.info(
    "GET /users/users/me/ - Get authenticated user essentials from x-consumer-id header",
  );

  // Gatelin adds x-consumer-id header (userId from JWT's iss claim)
  const userId = req.headers["x-consumer-id"];
  log.debug(`Extracted userId from x-consumer-id header: ${userId}`);
  const user = mockUsers.find((u) => u.id === +userId);
  if (!user)
    return res.status(404).json({ error: "User not found" });

  // Fetch roles from ms_role service
  const roles = await fetchRoles();
  
  // Compute user's permissions from their roles
  const permissions = getUserPermissions(user.roles, roles);

  // Return only essential fields for login/session
  const essentials = {
    nickname: user.nickname,
    firstName: user.firstName,
    lastName: user.lastName,
    permissions, // Include computed permissions
  };

  log.debug(`GET /users/users/me/ - success: ${user.nickname} with ${permissions.length} permissions`);
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

listen(app);
