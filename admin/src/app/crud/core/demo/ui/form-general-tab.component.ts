import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DEMO_CONF } from "@crud/core/demo/demo.conf";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "@crud/core/models/form-field-interaction.event";
import { FormComponent } from "@form/form/form.component";
import { LabelStrategy } from "@form/utils/label-strategy.model";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";

interface FormGeneralConfig {
  config: CrudItemOptions[];
  model: Record<string, unknown>;
  labelStrategy: LabelStrategy;
  labelStrategyVariant?: "on" | "in" | "over";
  columnsCount: 1 | 2 | 3;
  showSubmit?: boolean;
  showReset?: boolean;
  showDebug?: boolean;
  isReadonly?: boolean;
  submitButtonLabel?: string;
  resetButtonLabel?: string;
}

/**
 * Component for general form configuration tab
 * Provides controls for overall form settings like layout, labels, and buttons
 */
@Component({
  selector: "frm-form-general-tab",
  imports: [
    FormComponent,
    FormsModule,
    ButtonModule,
    SelectModule,
    CheckboxModule,
    InputTextModule,
  ],
  template: `
    <h3>Configuration</h3>
    <p class="intro-text">
        Options disponibles pour un formulaire
    </p>
    
    <div class="demo-controls">
      <div class="demo-control">
        <label>Label Strategy</label>
        <p-select 
          [options]="labelStrategies" 
          [(ngModel)]="selectedLabelStrategy"
          placeholder="labelStrategy" 
        />
      </div>

      @if (selectedLabelStrategy() === 'float') {
        <div class="demo-control">
          <label>Label Variant</label>
          <p-select 
            [options]="labelVariants" 
            [(ngModel)]="selectedLabelVariant"
            placeholder="labelVariant" 
          />
        </div>
      }
      
      <div class="demo-control">
        <label>Columns count</label>
        <p-select 
          [options]="columnsCountOptions" 
          [(ngModel)]="selectedColumnsCount"
          placeholder="columnsCount" 
        />
      </div>

      <div class="demo-control">
        <label>Submit Button Label</label>
        <input 
          pInputText 
          [(ngModel)]="selectedSubmitButtonLabel"
          placeholder="Submit button label" />
      </div>
      
      <div class="demo-control">
        <label>Reset Button Label</label>
        <input 
          pInputText 
          [(ngModel)]="selectedResetButtonLabel"
          placeholder="Reset button label" />
      </div>

      <div class="checkboxes">            
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="selectedShowSubmit"
            binary="true" />
          <label>Show Submit Button</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="selectedShowReset"
            binary="true" />
          <label>Show Reset Button</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="selectedShowDebug"
            binary="true" />
          <label>Show Debug Panel</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="selectedIsReadonly"
            binary="true" />
          <label>Read-only Mode</label>
        </div>
      </div>
      <p-button label="Appliquer" (click)="applyConfig()" />
    </div>
    
    <div class="live-demo">
        <h3>Rendu</h3>
      @if (formConfig(); as config) {
        <frm-form
          [(model)]="config.model"
          [config]="config.config"
          [labelStrategy]="config.labelStrategy"
          [labelStrategyVariant]="config.labelStrategyVariant"
          [columnsCount]="config.columnsCount"
          [showSubmit]="config.showSubmit"
          [showReset]="config.showReset"
          [showDebug]="config.showDebug"
          [isReadonly]="config.isReadonly"
          [submitButtonLabel]="config.submitButtonLabel"
          [resetButtonLabel]="config.resetButtonLabel"
          [forceReload]="forceReload()"
          (submitted)="onFormSubmit($event)"
          (reset)="onFormReset()"
          (validityChange)="onValidityChange($event)"
          (fieldInteraction)="onFieldInteraction($event)"
        />
      }
    </div>
  `,
})
export class FormGeneralTabComponent {
  // Configuration signals
  protected readonly selectedLabelStrategy = signal<LabelStrategy>("ifta");
  protected readonly selectedLabelVariant = signal<"on" | "in" | "over">("on");
  protected readonly selectedColumnsCount = signal<1 | 2 | 3>(2);
  protected readonly selectedSubmitButtonLabel = signal("Enregistrer");
  protected readonly selectedResetButtonLabel = signal("Réinitialiser");
  protected readonly selectedShowSubmit = signal(true);
  protected readonly selectedShowReset = signal(true);
  protected readonly selectedShowDebug = signal(false);
  protected readonly selectedIsReadonly = signal(false);

  // Form configuration
  protected readonly formConfig = signal<FormGeneralConfig>({
    config: DEMO_CONF,
    model: {},
    labelStrategy: this.selectedLabelStrategy(),
    labelStrategyVariant: this.selectedLabelVariant(),
    columnsCount: this.selectedColumnsCount(),
    showSubmit: this.selectedShowSubmit(),
    showReset: this.selectedShowReset(),
    showDebug: this.selectedShowDebug(),
    isReadonly: this.selectedIsReadonly(),
    submitButtonLabel: this.selectedSubmitButtonLabel(),
    resetButtonLabel: this.selectedResetButtonLabel(),
  });

  public readonly forceReload = signal(0);

  // Options for dropdowns
  protected readonly labelStrategies = [
    { label: "Normal", value: "normal" },
    { label: "Float", value: "float" },
    { label: "IFTA", value: "ifta" },
  ];

  protected readonly labelVariants = [
    { label: "On", value: "on" },
    { label: "In", value: "in" },
    { label: "Over", value: "over" },
  ];

  protected readonly columnsCountOptions = [
    { label: "1 Column", value: 1 },
    { label: "2 Columns", value: 2 },
    { label: "3 Columns", value: 3 },
  ];

  /**
   * Apply the current configuration to generate the form
   */
  protected applyConfig(): void {
    const config: FormGeneralConfig = {
      config: DEMO_CONF,
      model: {},
      labelStrategy: this.selectedLabelStrategy(),
      labelStrategyVariant: this.selectedLabelVariant(),
      columnsCount: this.selectedColumnsCount(),
      showSubmit: this.selectedShowSubmit(),
      showReset: this.selectedShowReset(),
      showDebug: this.selectedShowDebug(),
      isReadonly: this.selectedIsReadonly(),
      submitButtonLabel: this.selectedSubmitButtonLabel(),
      resetButtonLabel: this.selectedResetButtonLabel(),
    };

    this.formConfig.set(config);
    this.forceReload.update((n) => n + 1);
  }

  /**
   * Handle form submission event
   * @param {Record<string, unknown>} event - Form submission data
   */
  protected onFormSubmit(event: Record<string, unknown>): void {
    // this.formSubmit.emit(event);
  }

  /**
   * Handle form reset event
   */
  protected onFormReset(): void {
    // this.formReset.emit();
  }

  /**
   * Handle form validity change
   * @param {boolean} isValid - Form validity status
   */
  protected onValidityChange(isValid: boolean): void {
    // this.validityChange.emit(isValid);
  }

  /**
   * Handle field interaction events
   * @param {FormFieldInteractionEvent} event - Field interaction event
   */
  protected onFieldInteraction(event: FormFieldInteractionEvent): void {
    // this.fieldInteraction.emit(event);
  }
}
