import express from 'express';
import helmet from 'helmet';
import healixRouter from '@dwtechs/healix-express';
import { listen } from '@dwtechs/servpico-express';
import { log } from '@dwtechs/winstan';
import { mockRoles } from './data/roles.js';
import { mockPermissions } from './data/permissions.js';

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
  res.status(200).json({
    rows: mockPermissions,
    total: mockPermissions.length
  });
});

listen(app);
