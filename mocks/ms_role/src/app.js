import express from 'express';
import helmet from 'helmet';
import healixRouter from '@dwtechs/healix-express';
import { listen } from '@dwtechs/servpico-express';
import { log } from '@dwtechs/winstan';
import { mockRoles } from './data/roles.js';
import { mockPermissions, getPermissionName } from './data/permissions.js';
import { mockRolePermissions } from './data/role-permissions.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use('/health', healixRouter);

// POST /roles/search/ - Search for roles
app.post('/roles/search/', (req, res) => {
  log.info('POST /roles/search/ - Search roles');
  
  res.status(200).json({
    rows: mockRoles,
    total: mockRoles.length
  });
});

// POST /permissions/search/ - Search for permissions
app.post('/permissions/search/', (req, res) => {
  log.info('POST /permissions/search/ - Search permissions');
  
  // Compute permission names dynamically
  const permissionsWithNames = mockPermissions.map(permission => ({
    ...permission,
    name: getPermissionName(permission)
  }));
  
  res.status(200).json({
    rows: permissionsWithNames,
    total: permissionsWithNames.length
  });
});

// // GET /roles/:roleId/permissions - Get permissions for a specific role
// app.get('/roles/:roleId/permissions', (req, res) => {
//   const roleId = parseInt(req.params.roleId);
//   log.info(`GET /roles/${roleId}/permissions - Get permissions for role`);

//   const rolePermissions = mockRolePermissions.filter(rp => rp.roleId === roleId);
//   const permissionNames = rolePermissions.map(rp => rp.permissionName);

//   log.debug(`GET /roles/${roleId}/permissions - Found ${permissionNames.length} permissions`);
//   res.status(200).json({
//     roleId,
//     permissions: permissionNames,
//     total: permissionNames.length
//   });
// });

// POST /role-permissions/search/ - Search role-permission mappings
app.post('/role-permissions/search/', (req, res) => {
  log.info('POST /role-permissions/search/ - Search role permissions');
  
  res.status(200).json({
    rows: mockRolePermissions,
    total: mockRolePermissions.length
  });
});

listen(app);
