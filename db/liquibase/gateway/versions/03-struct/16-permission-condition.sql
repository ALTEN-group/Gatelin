CREATE TABLE IF NOT EXISTS permission_condition (
  "permissionId" INT NOT NULL,
  "conditionId"  INT NOT NULL,
  PRIMARY KEY ("permissionId", "conditionId"),
  CONSTRAINT fk_perm_cond_permission
    FOREIGN KEY ("permissionId") REFERENCES permission (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_perm_cond_condition
    FOREIGN KEY ("conditionId") REFERENCES condition (id)
    ON DELETE CASCADE ON UPDATE CASCADE
);
