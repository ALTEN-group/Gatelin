import { Component, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ButtonSeverity } from "primeng/button";
import { ButtonType, CrudButtonComponent } from "./crud-buttons.component";

@Component({
  template: `<crd-crud-button 
      [type]="type" 
      [disabled]="disabled"
      [loading]="loading"
      [label]="label"
      [icon]="icon"
      [severity]="severity"
      [functionalityKey]="functionalityKey"
      (clicked)="onButtonClick()"
    />`,
  standalone: true,
  imports: [CrudButtonComponent],
})
class TestWrapperComponent {
  type: ButtonType = "validate";
  disabled = false;
  loading = false;
  label = "";
  icon = "";
  severity: ButtonSeverity | undefined = undefined;
  functionalityKey = "";
  onButtonClick = jasmine.createSpy("onButtonClick");
}

describe("CrudButtonComponent", () => {
  let fixture: ComponentFixture<TestWrapperComponent>;

  // get p button debug element
  const getPButtonDebugElement = (type: ButtonType): DebugElement => {
    return fixture.debugElement.query(
      (de) => de.attributes["data-testid"] === `${type}-button`,
    );
  };

  // Get primeng button element
  const getPButton = (type: ButtonType): HTMLElement | null => {
    const de = getPButtonDebugElement(type);
    return de ? de.nativeElement : null;
  };

  // get html button element inside primeng wrapper
  const getButton = (type: ButtonType): HTMLButtonElement | null => {
    const pButtonElement = getPButton(type);
    return pButtonElement ? pButtonElement.querySelector("button") : null;
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    fixture.detectChanges();
  });

  it("should create and render validate button", () => {
    expect(fixture).toBeTruthy();
    const button: HTMLElement = fixture.nativeElement.querySelector("button");
    expect(button).toBeTruthy();
    expect(button.textContent?.trim()).toBe("Valider");
  });

  describe("Button Types", () => {
    it("should render validate button with correct text", () => {
      fixture.componentInstance.type = "validate";
      fixture.detectChanges();

      const button = getPButton("validate");
      expect(button).toBeTruthy();
      expect(button?.textContent?.trim()).toBe("Valider");
    });

    it("should render cancel button with correct text", () => {
      fixture.componentInstance.type = "cancel";
      fixture.detectChanges();

      const button = getPButton("cancel");
      expect(button).toBeTruthy();
      expect(button?.textContent?.trim()).toBe("Annuler");
    });

    it("should render delete button with correct text", () => {
      fixture.componentInstance.type = "delete";
      fixture.detectChanges();

      const button = getPButton("delete");
      expect(button).toBeTruthy();
      expect(button?.textContent?.trim()).toBe("Supprimer");
    });

    it("should render edit button with correct text", () => {
      fixture.componentInstance.type = "edit";
      fixture.detectChanges();

      const button = getPButton("edit");
      expect(button).toBeTruthy();
      expect(button?.textContent?.trim()).toBe("Modifier");
    });
  });

  describe("Button Properties", () => {
    it("should use custom label when provided", () => {
      fixture.componentInstance.type = "validate";
      fixture.componentInstance.label = "Custom Label";
      fixture.detectChanges();

      const button = getPButton("validate");
      expect(button?.textContent?.trim()).toBe("Custom Label");
    });

    it("should apply disabled state", () => {
      fixture.componentInstance.type = "validate";
      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      const buttonElement = getButton("validate");
      expect(buttonElement?.disabled).toBe(true);
    });

    it("should apply loading state", () => {
      fixture.componentInstance.type = "validate";
      fixture.componentInstance.loading = true;
      fixture.detectChanges();

      const button = getPButton("validate");
      expect(button).toBeTruthy();

      // PrimeNG buttons typically add loading-related classes or show a spinner
      // The actual button element should be disabled when loading
      const buttonElement = getButton("validate");
      expect(buttonElement?.disabled).toBe(true);

      // Check for loading spinner or loading-related classes
      const spinner =
        button?.querySelector(".p-button-loading-icon") ||
        button?.querySelector(".pi-spin") ||
        button?.querySelector('[class*="loading"]');
      expect(spinner).toBeTruthy();
    });

    it("should not show loading state when loading is false", () => {
      fixture.componentInstance.type = "validate";
      fixture.componentInstance.loading = false;
      fixture.detectChanges();

      const button = getPButton("validate");
      expect(button).toBeTruthy();

      // Button should not be disabled when not loading (unless explicitly disabled)
      const buttonElement = getButton("validate");
      expect(buttonElement?.disabled).toBe(false);

      // Should not have loading spinner
      const spinner =
        button?.querySelector(".p-button-loading-icon") ||
        button?.querySelector(".pi-spin") ||
        button?.querySelector('[class*="loading"]');
      expect(spinner).toBeFalsy();
    });
  });

  describe("Button Events", () => {
    it("should emit clicked event when clicked", () => {
      fixture.componentInstance.type = "validate";
      fixture.detectChanges();

      const de = getPButtonDebugElement("validate");
      de.triggerEventHandler("onClick");
      expect(fixture.componentInstance.onButtonClick).toHaveBeenCalled();
    });

    it("should emit clicked event for simple-icon button when clicked", () => {
      fixture.componentInstance.type = "simple-icon";
      fixture.componentInstance.icon = "pi pi-check";
      fixture.detectChanges();

      const de = getPButtonDebugElement("simple-icon");
      de.triggerEventHandler("onClick");

      expect(fixture.componentInstance.onButtonClick).toHaveBeenCalled();
    });
  });

  describe("Additional Button Properties", () => {
    it("should apply custom severity", () => {
      fixture.componentInstance.type = "validate";
      fixture.componentInstance.severity = "danger";
      fixture.detectChanges();

      const button = getButton("validate");
      expect(button?.classList).toContain("p-button-danger");
    });

    it("should render simple-icon button with custom icon", () => {
      fixture.componentInstance.type = "simple-icon";
      fixture.componentInstance.icon = "pi pi-heart";
      fixture.detectChanges();

      const button = getPButton("simple-icon");
      const iconElement = button?.querySelector(".pi-heart");
      expect(iconElement).toBeTruthy();
    });

    it("should handle functionalityKey input", () => {
      fixture.componentInstance.type = "delete";
      fixture.componentInstance.functionalityKey = "user.delete";
      fixture.detectChanges();

      const button = getPButton("delete");
      expect(button).toBeTruthy();
    });

    it("should render button without functionalityKey", () => {
      fixture.componentInstance.type = "edit";
      fixture.detectChanges();

      const button = getPButton("edit");
      expect(button).toBeTruthy();
    });
  });

  describe("Button States Combinations", () => {
    it("should handle disabled and loading states together", () => {
      fixture.componentInstance.type = "validate";
      fixture.componentInstance.disabled = true;
      fixture.componentInstance.loading = true;
      fixture.detectChanges();

      const buttonElement = getButton("validate");
      expect(buttonElement?.disabled).toBe(true);
    });

    it("should handle custom label with icon", () => {
      fixture.componentInstance.type = "validate";
      fixture.componentInstance.label = "Custom Icon Label";
      fixture.componentInstance.icon = "pi pi-star";
      fixture.detectChanges();

      const button = getPButton("validate");
      expect(button?.textContent?.trim()).toBe("Custom Icon Label");
      expect(button?.querySelector(".pi-star")).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty icon for simple-icon type", () => {
      fixture.componentInstance.type = "simple-icon";
      fixture.componentInstance.icon = "";
      fixture.detectChanges();

      const button = getPButton("simple-icon");
      expect(button).toBeTruthy();
    });

    it("should handle whitespace in label", () => {
      fixture.componentInstance.type = "validate";
      fixture.componentInstance.label = "   Spaced Label   ";
      fixture.detectChanges();

      const button = getPButton("validate");
      expect(button?.textContent?.includes("Spaced Label")).toBe(true);
    });

    it("should not emit clicked event when disabled", () => {
      fixture.componentInstance.type = "validate";
      fixture.componentInstance.disabled = true;
      fixture.detectChanges();

      const spy = fixture.componentInstance.onButtonClick;
      spy.calls.reset();

      const buttonElement = getButton("validate");
      buttonElement?.click();

      expect(spy).not.toHaveBeenCalled();
    });

    it("should not emit clicked event when loading", () => {
      fixture.componentInstance.type = "validate";
      fixture.componentInstance.loading = true;
      fixture.detectChanges();

      const spy = fixture.componentInstance.onButtonClick;
      spy.calls.reset();

      const buttonElement = getButton("validate");
      buttonElement?.click();

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
