import { inject } from "@angular/core";
import { ConditionsService } from "app/admin/data-access/conditions/conditions.service";
export const conditionsResolver = (_route, _state) => {
    const service = inject(ConditionsService);
    return service.getAndCacheAll();
};
//# sourceMappingURL=conditions.resolver.js.map