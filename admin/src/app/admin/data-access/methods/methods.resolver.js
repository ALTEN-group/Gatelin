import { inject } from "@angular/core";
import { MethodsService } from "app/admin/data-access/methods/methods.service";
export const methodsResolver = (_route, _state) => {
    const service = inject(MethodsService);
    return service.getAndCacheAll();
};
//# sourceMappingURL=methods.resolver.js.map