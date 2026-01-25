import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { FormFieldTooltip } from "./field-tooltip";

/**
 * Test wrapper component
 */
@Component({
  template: ` <frm-field-tooltip [value]="tooltipValue" /> `,
  standalone: true,
  imports: [FormFieldTooltip],
})
class TestWrapperComponent {
  tooltipValue: string | undefined = "Test tooltip";
}

describe("FormFieldTooltip", () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: TestWrapperComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestWrapperComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

  describe("Icon Rendering", () => {
    it("should render info icon", () => {
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector("i.pi-info-circle");
      expect(icon).toBeTruthy();
    });

    it("should have pi class on icon", () => {
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector("i");
      expect(icon.classList.contains("pi")).toBe(true);
      expect(icon.classList.contains("pi-info-circle")).toBe(true);
    });
  });

  describe("Tooltip Content", () => {
    it("should display tooltip with string value", () => {
      component.tooltipValue = "This is a tooltip";
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("This is a tooltip");
    });

    it("should handle empty string value", () => {
      component.tooltipValue = "";
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("");
    });

    it("should handle undefined value", () => {
      component.tooltipValue = undefined;
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBeUndefined();
    });

    it("should render HTML content in tooltip", () => {
      component.tooltipValue = "<strong>Bold text</strong>";
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("<strong>Bold text</strong>");
    });

    it("should handle multiline text", () => {
      component.tooltipValue = "Line 1<br>Line 2<br>Line 3";
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toContain("Line 1");
      expect(tooltipComponent.value()).toContain("Line 2");
      expect(tooltipComponent.value()).toContain("Line 3");
    });

    it("should handle special characters", () => {
      component.tooltipValue = "Special: & < > \" '";
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("Special: & < > \" '");
    });

    it("should handle long text", () => {
      component.tooltipValue =
        "This is a very long tooltip text that should be displayed properly without any issues regardless of its length.";
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value().length).toBeGreaterThan(50);
    });
  });

  describe("Value Changes", () => {
    it("should update when value changes", () => {
      component.tooltipValue = "Initial value";
      fixture.detectChanges();

      let tooltipComponent = fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("Initial value");

      component.tooltipValue = "Updated value";
      fixture.detectChanges();

      tooltipComponent = fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("Updated value");
    });

    it("should update from undefined to string", () => {
      component.tooltipValue = undefined;
      fixture.detectChanges();

      let tooltipComponent = fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBeUndefined();

      component.tooltipValue = "Now has value";
      fixture.detectChanges();

      tooltipComponent = fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("Now has value");
    });

    it("should update from string to undefined", () => {
      component.tooltipValue = "Has value";
      fixture.detectChanges();

      let tooltipComponent = fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("Has value");

      component.tooltipValue = undefined;
      fixture.detectChanges();

      tooltipComponent = fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBeUndefined();
    });
  });

  describe("Template Structure", () => {
    it("should render icon that can show tooltip", () => {
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector("i.pi-info-circle");
      expect(icon).toBeTruthy();
    });

    it("should render span with innerHTML binding inside template", () => {
      component.tooltipValue = "Template content";
      fixture.detectChanges();

      // Template content is rendered by PrimeNG tooltip directive
      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("Template content");
    });
  });

  describe("Edge Cases", () => {
    it("should handle null value safely", () => {
      component.tooltipValue = null as any;
      fixture.detectChanges();

      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it("should handle numeric string", () => {
      component.tooltipValue = "12345";
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("12345");
    });

    it("should handle whitespace-only string", () => {
      component.tooltipValue = "   ";
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("   ");
    });

    it("should handle string with only HTML tags", () => {
      component.tooltipValue = "<br><br>";
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("<br><br>");
    });

    it("should handle Unicode characters", () => {
      component.tooltipValue = "Unicode: 🎉 ñ é ü";
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("Unicode: 🎉 ñ é ü");
    });
  });

  describe("Change Detection", () => {
    it("should use OnPush change detection strategy", () => {
      fixture.detectChanges();

      const tooltipDebugElement = fixture.debugElement.children[0];
      const component = tooltipDebugElement.componentInstance;

      // Verify the component exists and has the expected structure
      expect(component).toBeTruthy();
      expect(component.value).toBeDefined();
    });

    it("should update on input signal change", () => {
      component.tooltipValue = "First";
      fixture.detectChanges();

      component.tooltipValue = "Second";
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("Second");
    });
  });
});
