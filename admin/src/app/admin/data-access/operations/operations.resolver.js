import { inject } from "@angular/core";
import { OperationsService } from "app/admin/data-access/operations/operations.service";
export const operationsResolver = (_route, _state) => {
    const service = inject(OperationsService);
    return service.getAndCacheAll();
};
//# sourceMappingURL=operations.resolver.js.map