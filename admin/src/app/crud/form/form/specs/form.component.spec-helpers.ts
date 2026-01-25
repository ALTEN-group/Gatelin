import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormComponent } from "@form/form/form.component";
import { FormBuilderService } from "../../form-builder.service";

/**
 * Test wrapper component that wraps FormComponent for testing
 */
@Component({
  template: `<frm-form 
      [config]="config" 
      [model]="model"
      [isReadonly]="isReadonly"
      [showReset]="showReset"
      [showSubmit]="showSubmit"
    />`,
  standalone: true,
  imports: [FormComponent],
})
export class TestWrapperComponent {
  config: CrudItemOptions[] = [];
  model: { [key: string]: unknown } = {};
  isReadonly = false;
  showReset = false;
  showSubmit = false;
}

/**
 * Setup function to create test fixture and get form component instance
 */
export async function setupFormTest(): Promise<{
  fixture: ComponentFixture<TestWrapperComponent>;
  component: FormComponent;
}> {
  await TestBed.configureTestingModule({
    imports: [TestWrapperComponent, ReactiveFormsModule],
    providers: [FormBuilderService, provideAnimations()],
  }).compileComponents();

  const fixture = TestBed.createComponent(TestWrapperComponent);
  const component = fixture.debugElement.children[0]
    .componentInstance as FormComponent;

  return { fixture, component };
}

/**
 * Factory to create a simple input field config
 */
export function createInputConfig(
  key: string,
  label: string,
  options?: Partial<CrudItemOptions>,
): CrudItemOptions {
  return {
    key,
    label,
    controlType: CONTROL_TYPES.INPUT,
    ...options,
  };
}

/**
 * Factory to create a select field config
 */
export function createSelectConfig(
  key: string,
  label: string,
  options: Array<{ label: string; value: unknown }>,
  otherOptions?: Partial<CrudItemOptions>,
): CrudItemOptions {
  return {
    key,
    label,
    controlType: CONTROL_TYPES.SELECT,
    options,
    ...otherOptions,
  };
}

/**
 * Factory to create a checkbox field config
 */
export function createCheckboxConfig(
  key: string,
  label: string,
  options?: Partial<CrudItemOptions>,
): CrudItemOptions {
  return {
    key,
    label,
    controlType: CONTROL_TYPES.CHECKBOX,
    ...options,
  };
}

/**
 * Factory to create a group field config
 */
export function createGroupConfig(
  key: string,
  label: string,
  children: CrudItemOptions[],
  options?: Partial<CrudItemOptions>,
): CrudItemOptions {
  return {
    key,
    label,
    controlType: CONTROL_TYPES.GROUP,
    children,
    ...options,
  };
}

/**
 * Factory to create a form array field config
 */
export function createFormArrayConfig(
  key: string,
  label: string,
  options?: Partial<CrudItemOptions>,
): CrudItemOptions {
  return {
    key,
    label,
    controlType: CONTROL_TYPES.INPUT,
    controlOptions: {
      isFormArray: true,
    },
    ...options,
  };
}

/**
 * Helper to create a FormFieldInteractionEvent
 */
export function createInteractionEvent(
  key: string,
  value: unknown,
  controlType: string = CONTROL_TYPES.INPUT,
) {
  return {
    key,
    controlType,
    value,
    interactionType: "valueChange" as const,
    timestamp: new Date(),
  };
}

/**
 * Helper to wait for debounce in tests
 */
export function waitForDebounce(ms = 350) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
