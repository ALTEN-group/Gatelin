CREATE TABLE IF NOT EXISTS permission (
  id            SERIAL PRIMARY KEY,
  "roleId"      INT NOT NULL,
  "routeId"     INT NOT NULL,
  "operationId" INT NOT NULL,
  fields        TEXT[],
  scopes        TEXT[],
  CONSTRAINT permission_unique UNIQUE ("roleId", "routeId", "operationId"),
  CHECK ("roleId">=0),
  CHECK ("routeId">=0),
  CHECK ("operationId">=0),
  CONSTRAINT fk_permission_route
    FOREIGN KEY ("routeId") REFERENCES route (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_permission_operation
    FOREIGN KEY ("operationId") REFERENCES operation (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
