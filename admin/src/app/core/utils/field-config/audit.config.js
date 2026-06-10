import { inject } from "@angular/core";
import { createAuditConfig, CRUD_LABELS, } from "@dwtechs/crud-builder";
export function buildAuditConfig() {
    const labels = inject(CRUD_LABELS);
    return createAuditConfig(labels.auditConfig);
}
//# sourceMappingURL=audit.config.js.map