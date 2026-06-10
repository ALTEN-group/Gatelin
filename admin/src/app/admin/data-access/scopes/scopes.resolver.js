import { inject } from "@angular/core";
import { ScopesService } from "app/admin/data-access/scopes/scopes.service";
export const scopesResolver = (_route, _state) => {
    const service = inject(ScopesService);
    return service.getAndCacheAll();
};
//# sourceMappingURL=scopes.resolver.js.map