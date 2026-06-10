import { inject } from "@angular/core";
import { FieldsService } from "app/admin/data-access/fields/fields.service";
export const fieldsResolver = (_route, _state) => {
    const service = inject(FieldsService);
    return service.getAndCacheAll();
};
//# sourceMappingURL=fields.resolver.js.map