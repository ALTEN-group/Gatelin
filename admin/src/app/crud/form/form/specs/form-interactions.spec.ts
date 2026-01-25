import { ComponentFixture } from "@angular/core/testing";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { FormFieldInteractionEvent } from "@crud/core/models/form-field-interaction.event";
import { FormComponent } from "@form/form/form.component";
import {
  createInputConfig,
  createInteractionEvent,
  setupFormTest,
  TestWrapperComponent,
} from "./form.component.spec-helpers";

describe("FormComponent - Actions and Interactions", () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: FormComponent;

  beforeEach(async () => {
    ({ fixture, component } = await setupFormTest());
  });

  it("should emit fieldInteraction when emitInteraction is called", (done) => {
    // Arrange
    fixture.componentInstance.config = [
      createInputConfig("sourceField", "Source Field"),
    ];
    fixture.componentInstance.model = { sourceField: "" };
    fixture.detectChanges();

    const event: FormFieldInteractionEvent = createInteractionEvent(
      "sourceField",
      "test value",
      CONTROL_TYPES.INPUT,
    );

    // Subscribe to fieldInteraction
    component.fieldInteraction.subscribe((emittedEvent) => {
      expect(emittedEvent.key).toBe(event.key);
      expect(emittedEvent.value).toBe(event.value);
      done();
    });

    // Act
    component.emitInteraction(event);
  });

  it("should execute action and add to pending actions with set mode", () => {
    // Arrange
    fixture.componentInstance.config = [
      {
        key: "sourceField",
        label: "Source Field",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          action: (event) => {
            return [
              {
                key: "targetField",
                value: `Processed: ${event.value}`,
                mode: "set",
              },
            ];
          },
        },
      },
      createInputConfig("targetField", "Target Field"),
    ];
    fixture.componentInstance.model = {
      sourceField: "",
      targetField: "",
    };
    fixture.detectChanges();

    const event: FormFieldInteractionEvent = createInteractionEvent(
      "sourceField",
      "test",
      CONTROL_TYPES.INPUT,
    );

    // Act
    component.emitInteraction(event);

    // Assert - Action should be in pending actions
    const pendingActions = component["pendingActions"]();
    expect(pendingActions.length).toBe(1);
    expect(pendingActions[0].key).toBe("targetField");
    expect(pendingActions[0].value).toBe("Processed: test");
    expect(pendingActions[0].mode).toBe("set");
  });

  it("should handle action with push mode on empty array", () => {
    // Arrange
    fixture.componentInstance.config = [
      {
        key: "addButton",
        label: "Add Item",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          action: (event) => {
            return [
              {
                key: "tags",
                value: event.value,
                mode: "push",
              },
            ];
          },
        },
      },
      createInputConfig("tags", "Tags"),
    ];
    fixture.componentInstance.model = {
      addButton: "",
      tags: null,
    };
    fixture.detectChanges();

    const event: FormFieldInteractionEvent = createInteractionEvent(
      "addButton",
      "newTag",
      CONTROL_TYPES.INPUT,
    );

    // Act
    component.emitInteraction(event);

    // Assert - Action should be in pending actions with push mode
    const pendingActions = component["pendingActions"]();
    expect(pendingActions.length).toBe(1);
    expect(pendingActions[0].mode).toBe("push");
    expect(pendingActions[0].key).toBe("tags");
    expect(pendingActions[0].value).toBe("newTag");
  });

  it("should handle action with push mode on existing array", (done) => {
    // Arrange
    fixture.componentInstance.config = [
      {
        key: "addButton",
        label: "Add Item",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          action: (event) => {
            return [
              {
                key: "tags",
                value: event.value,
                mode: "push",
              },
            ];
          },
        },
      },
      createInputConfig("tags", "Tags"),
    ];
    fixture.componentInstance.model = {
      addButton: "",
      tags: ["tag1", "tag2"],
    };
    fixture.detectChanges();

    component.modelChange.subscribe((newModel) => {
      expect(newModel.tags).toEqual(["tag1", "tag2", "tag3"]);
      done();
    });

    // Act
    const event: FormFieldInteractionEvent = createInteractionEvent(
      "addButton",
      "tag3",
      CONTROL_TYPES.INPUT,
    );
    component.emitInteraction(event);

    // Trigger value change
    const form = component.form();
    form?.get("addButton")?.setValue("trigger");
  });

  it("should handle action with remove mode", (done) => {
    // Arrange
    fixture.componentInstance.config = [
      {
        key: "removeButton",
        label: "Remove Item",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          action: (event) => {
            return [
              {
                key: "tags",
                value: event.value,
                mode: "remove",
              },
            ];
          },
        },
      },
      createInputConfig("tags", "Tags"),
    ];
    fixture.componentInstance.model = {
      removeButton: "",
      tags: ["tag1", "tag2", "tag3"],
    };
    fixture.detectChanges();

    // Act
    const event: FormFieldInteractionEvent = createInteractionEvent(
      "removeButton",
      "tag2",
      CONTROL_TYPES.INPUT,
    );
    component.emitInteraction(event);

    component.modelChange.subscribe((newModel) => {
      expect(newModel.tags).toEqual(["tag1", "tag3"]);
      done();
    });

    // Trigger value change
    const form = component.form();
    form?.get("removeButton")?.setValue("trigger");
  });

  it("should handle soft action that does not override existing value", (done) => {
    // Arrange
    fixture.componentInstance.config = [
      {
        key: "sourceField",
        label: "Source Field",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          action: () => {
            return [
              {
                key: "targetField",
                value: "default value",
                soft: true,
              },
            ];
          },
        },
      },
      createInputConfig("targetField", "Target Field"),
    ];
    fixture.componentInstance.model = {
      sourceField: "",
      targetField: "existing value",
    };
    fixture.detectChanges();

    component.modelChange.subscribe((newModel) => {
      // Soft action should not override existing value
      expect(newModel.targetField).toBe("existing value");
      done();
    });

    // Act
    const event: FormFieldInteractionEvent = createInteractionEvent(
      "sourceField",
      CONTROL_TYPES.INPUT,
      "test",
    );
    component.emitInteraction(event);

    // Trigger value change
    const form = component.form();
    form?.get("sourceField")?.setValue("trigger");
  });

  it("should handle soft action that sets value when field is empty", (done) => {
    // Arrange
    fixture.componentInstance.config = [
      {
        key: "sourceField",
        label: "Source Field",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          action: () => {
            return [
              {
                key: "targetField",
                value: "default value",
                soft: true,
              },
            ];
          },
        },
      },
      createInputConfig("targetField", "Target Field"),
    ];
    fixture.componentInstance.model = {
      sourceField: "",
      targetField: "",
    };
    fixture.detectChanges();

    component.modelChange.subscribe((newModel) => {
      // Soft action should set value when field is empty
      expect(newModel.targetField).toBe("default value");
      done();
    });

    // Act
    const event: FormFieldInteractionEvent = createInteractionEvent(
      "sourceField",
      CONTROL_TYPES.INPUT,
      "test",
    );
    component.emitInteraction(event);

    // Trigger value change
    const form = component.form();
    form?.get("sourceField")?.setValue("trigger");
  });

  it("should handle action returning multiple results", (done) => {
    // Arrange
    fixture.componentInstance.config = [
      {
        key: "sourceField",
        label: "Source Field",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          action: (event) => {
            return [
              {
                key: "targetField1",
                value: `Value1: ${event.value}`,
              },
              {
                key: "targetField2",
                value: `Value2: ${event.value}`,
              },
            ];
          },
        },
      },
      createInputConfig("targetField1", "Target Field 1"),
      createInputConfig("targetField2", "Target Field 2"),
    ];
    fixture.componentInstance.model = {
      sourceField: "",
      targetField1: "",
      targetField2: "",
    };
    fixture.detectChanges();

    component.modelChange.subscribe((newModel) => {
      expect(newModel.targetField1).toBe("Value1: test");
      expect(newModel.targetField2).toBe("Value2: test");
      done();
    });

    // Act
    const event: FormFieldInteractionEvent = createInteractionEvent(
      "sourceField",
      "test",
      CONTROL_TYPES.INPUT,
    );
    component.emitInteraction(event);

    // Trigger value change
    const form = component.form();
    form?.get("sourceField")?.setValue("trigger");
  });

  it("should handle action returning undefined", () => {
    // Arrange
    fixture.componentInstance.config = [
      {
        key: "sourceField",
        label: "Source Field",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          action: () => {
            return undefined;
          },
        },
      },
    ];
    fixture.componentInstance.model = {
      sourceField: "",
    };
    fixture.detectChanges();

    const event: FormFieldInteractionEvent = createInteractionEvent(
      "sourceField",
      CONTROL_TYPES.INPUT,
      "test",
    );

    // Act
    component.emitInteraction(event);

    // Assert - No pending actions should be added
    const pendingActions = component["pendingActions"]();
    expect(pendingActions.length).toBe(0);
  });

  it("should clear pending actions after processing", (done) => {
    // Arrange
    fixture.componentInstance.config = [
      {
        key: "sourceField",
        label: "Source Field",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          action: (event) => {
            return [
              {
                key: "targetField",
                value: event.value,
              },
            ];
          },
        },
      },
      createInputConfig("targetField", "Target Field"),
    ];
    fixture.componentInstance.model = {
      sourceField: "",
      targetField: "",
    };
    fixture.detectChanges();

    component.modelChange.subscribe(() => {
      // Check pending actions are cleared after processing
      setTimeout(() => {
        const pendingActions = component["pendingActions"]();
        expect(pendingActions.length).toBe(0);
        done();
      }, 50);
    });

    // Act
    const event: FormFieldInteractionEvent = createInteractionEvent(
      "sourceField",
      CONTROL_TYPES.INPUT,
      "test",
    );
    component.emitInteraction(event);

    // Trigger value change
    const form = component.form();
    form?.get("sourceField")?.setValue("trigger");
  });
});
