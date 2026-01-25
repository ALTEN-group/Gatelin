import { ComponentFixture } from "@angular/core/testing";
import { FormComponent } from "@form/form/form.component";
import {
  setupFormTest,
  TestWrapperComponent,
} from "./form.component.spec-helpers";

describe("FormComponent", () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: FormComponent;

  beforeEach(async () => {
    ({ fixture, component } = await setupFormTest());
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
