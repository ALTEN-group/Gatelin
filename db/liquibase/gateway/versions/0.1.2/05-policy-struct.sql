
CREATE TABLE IF NOT EXISTS policy (
	id SERIAL PRIMARY KEY,
  "routeId" INT NOT NULL,
  "permissionName" VARCHAR(100) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_policy_route
		FOREIGN KEY ("routeId") REFERENCES route (id)
		ON DELETE CASCADE
    ON UPDATE CASCADE,
  UNIQUE("routeId", "permissionName")
);