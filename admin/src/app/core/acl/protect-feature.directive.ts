import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
} from "@angular/core";
import { AclService } from "@core/acl/acl.service";
import { Calls } from "@dwtechs/crud-builder";

@Directive({
  selector: "[protectFeature]",
})
export class ProtectFeatureDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly aclService = inject(AclService);

  /** Represents the functionality to access, "routes" for instance */
  public readonly protectFeature = input.required<string | undefined>();

  /** Represents the id of access level necessary to see the feature (1: read, 2: write...) */
  public readonly operation = input<keyof Calls<unknown> | undefined>(
    undefined,
  );

  protected readonly hasAccess = computed(() => {
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
  readonly toggleDisabledEffect = effect(() => {
    const hasAccess = this.hasAccess();
    const element = this.elementRef.nativeElement;

    if (!hasAccess) {
      element.classList.add("p-disabled");
    } else {
      element.classList.remove("p-disabled");
    }
  });
}
