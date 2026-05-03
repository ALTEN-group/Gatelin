
CREATE TABLE IF NOT EXISTS route_operation (
  "routeId" INT NOT NULL,
  "operationId" INT NOT NULL,
  PRIMARY KEY ("routeId", "operationId"),
  CONSTRAINT fk_route_operation_route
    FOREIGN KEY ("routeId") REFERENCES route (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_route_operation_operation
    FOREIGN KEY ("operationId") REFERENCES operation (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
