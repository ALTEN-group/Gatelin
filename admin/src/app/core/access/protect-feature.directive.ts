import {
  Directive,
  ElementRef,
  computed,
  effect,
  inject,
  input,
} from "@angular/core";
import { AccessLevelsService } from "@core/access/access-levels.service";

@Directive({
  selector: "[protectFeature]",
})
export class ProtectFeatureDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly accessControl = inject(AccessLevelsService);

  /** Represents the feature to be accessed (users, cities, blogs...) */
  public readonly protectFeature = input.required<string | undefined>();

  /** Represents the id of access level necessary to see the feature (1: read, 2: write...) */
  public readonly minimalOperation = input<number | undefined>(undefined);

  protected readonly hasAccess = computed(() => {
    return this.accessControl.userHasAccess(
      this.protectFeature(),
      this.minimalOperation(),
      // this.acAttribute(),
    );
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
    if (!hasAccess) {
      // Hide the element if the user does not have access
      this.elementRef.nativeElement.style.display = "none";
    } else {
      // Show the element if the user has access
      this.elementRef.nativeElement.style.display = this.initialDisplayStyle;
    }
  });

  private storeInitialDisplayStyle() {
    if (this.initialDisplayStyle !== undefined) {
      return;
    }
    this.initialDisplayStyle =
      this.elementRef.nativeElement.style.display ?? "";
  }
}
