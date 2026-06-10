import { __decorate } from "tslib";
import { computed, Directive, effect, ElementRef, inject, input, } from "@angular/core";
import { AclService } from "@core/acl/acl.service";
let ProtectFeatureDirective = class ProtectFeatureDirective {
    constructor() {
        this.elementRef = inject(ElementRef);
        this.aclService = inject(AclService);
        /** Represents the functionality to access, "routes" for instance */
        this.protectFeature = input.required();
        /** Represents the id of access level necessary to see the feature (1: read, 2: write...) */
        this.operation = input(undefined);
        this.hasAccess = computed(() => {
            return this.aclService.hasAccess(this.protectFeature(), this.operation());
        });
        /**
         * Effect that controls the disabled state of the host element based on user access permissions.
         *
         * When the user lacks access, the "p-disabled" class is added to the element.
         * When the user has access, the "p-disabled" class is removed from the element.
         *
         * This effect automatically runs whenever the `hasAccess` signal changes.
         */
        this.toggleDisabledEffect = effect(() => {
            const hasAccess = this.hasAccess();
            const element = this.elementRef.nativeElement;
            if (!hasAccess) {
                element.classList.add("p-disabled");
            }
            else {
                element.classList.remove("p-disabled");
            }
        });
    }
};
ProtectFeatureDirective = __decorate([
    Directive({
        selector: "[protectFeature]",
    })
], ProtectFeatureDirective);
export { ProtectFeatureDirective };
//# sourceMappingURL=protect-feature.directive.js.map