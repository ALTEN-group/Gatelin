CREATE TABLE IF NOT EXISTS permission_operation (
  "permissionId" INT NOT NULL,
  "operationId"  INT NOT NULL,
  PRIMARY KEY ("permissionId", "operationId"),
  CONSTRAINT fk_perm_op_permission
    FOREIGN KEY ("permissionId") REFERENCES permission (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_perm_op_operation
    FOREIGN KEY ("operationId") REFERENCES operation (id)
    ON DELETE CASCADE ON UPDATE CASCADE
);
