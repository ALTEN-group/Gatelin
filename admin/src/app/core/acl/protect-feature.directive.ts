import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
} from "@angular/core";
import { AclService } from "@core/acl/acl.service";
import { Calls } from "@crud/core/utils/crud-service/crud.model";

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
   * Stores the initial display style of the element before any access control modifications.
   * This allows the directive to restore the original display value when access is granted
   * after previously being hidden.
   */
  private initialDisplayStyle: string | undefined;

  readonly storeDisplayEffect = effect(() => {
    this.storeInitialDisplayStyle();
  });

  /**
   * Effect that controls the visibility of the host element based on user access permissions.
   *
   * When the user lacks access, the element's display style is set to "none" to hide it.
   * When the user has access, the element's display style is restored to its initial value.
   *
   * This effect automatically runs whenever the `hasAccess` signal changes.
   *
   * @remarks
   * The effect preserves the original display style of the element and restores it
   * when access is granted, ensuring the element returns to its intended layout behavior.
   */
  readonly hideEffect = effect(() => {
    const hasAccess = this.hasAccess();
    // Hide the element if the user does not have access
    if (!hasAccess) this.elementRef.nativeElement.style.display = "none";
    else this.elementRef.nativeElement.style.display = this.initialDisplayStyle;
  });

  private storeInitialDisplayStyle() {
    if (this.initialDisplayStyle !== undefined) return;
    this.initialDisplayStyle =
      this.elementRef.nativeElement.style.display ?? "";
  }
}
