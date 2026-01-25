import { Component, signal } from "@angular/core";
import { FormsModule, Validators } from "@angular/forms";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormComponent } from "@form/form/form.component";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";

/**
 * Component for Radio Group field configuration tab
 * Provides comprehensive testing of all available options for radio button group controls
 */
@Component({
  selector: "frm-radiogroup-input-tab",
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
      Options disponibles pour un champ Radio Group (groupe de boutons radio)
    </p>
    
    <div class="demo-controls">
      <div class="demo-control">
        <label>Label du champ</label>
        <input pInputText [(ngModel)]="radioGroupLabel" placeholder="Label" />
      </div>

      <div class="demo-control">
        <label>Direction des options</label>
        <p-select 
          [options]="directionOptions" 
          [(ngModel)]="radioGroupDirection"
          placeholder="Choisir une direction" />
      </div>

      <div class="demo-control">
        <label>Largeur</label>
        <input pInputText 
          [(ngModel)]="radioGroupWidth"  
          placeholder="Largeur (ex: 300px, 50%)" />
      </div>

      <div class="demo-control">
        <label>Texte d'aide</label>
        <input pInputText 
          [(ngModel)]="radioGroupHelpText" 
          placeholder="Texte d'aide sous le champ" />
      </div>

      <div class="demo-control">
        <label>Tooltip</label>
        <input pInputText 
          [(ngModel)]="radioGroupTooltipLabel" 
          placeholder="Texte au survol" />
      </div>

      <div class="demo-control">
        <label>Label control</label>
        <input pInputText 
          [(ngModel)]="radioGroupControlLabel" 
          placeholder="Label dans controlOptions" />
      </div>

      <!-- Checkboxes pour les options booléennes -->
      <div class="checkboxes">
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="radioGroupRequired"
            binary="true" />
          <label>Obligatoire</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="radioGroupDisabled"
            binary="true" />
          <label>Désactivé</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="radioGroupHidden"
            binary="true" />
          <label>Masqué</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="radioGroupClearable"
            binary="true" />
          <label>Bouton effacer</label>
        </div>
      </div>

      <p-button 
        label="Appliquer"
        (click)="applyConfig()"
        class="apply-btn" />
    </div>
    
    <div class="live-demo">
        <h3>Rendu</h3>
        <frm-form
          [model]="{}"
          [config]="config()"
          labelStrategy="ifta"
          [forceReload]="forceReload()"
          [showDebug]="true"
        />
    </div>
  `,
})
export class RadioGroupInputTabComponent {
  // Configuration signals for Radio Group
  protected readonly radioGroupLabel = signal("Test Radio Group");
  protected readonly radioGroupDirection = signal<"row" | "column">("column");
  protected readonly radioGroupWidth = signal<string | undefined>(undefined);
  protected readonly radioGroupHelpText = signal<string | undefined>(undefined);
  protected readonly radioGroupTooltipLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly radioGroupControlLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly radioGroupRequired = signal(false);
  protected readonly radioGroupDisabled = signal(false);
  protected readonly radioGroupHidden = signal(false);
  protected readonly radioGroupClearable = signal<boolean>(true);

  // Direction options
  protected readonly directionOptions = [
    { label: "Colonne (vertical)", value: "column" },
    { label: "Ligne (horizontal)", value: "row" },
  ];

  // Sample data for radio group
  private readonly sampleOptions = [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" },
    { label: "Option 3", value: "opt3" },
    { label: "Option 4", value: "opt4" },
    { label: "Option 5", value: "opt5" },
  ];

  // Form configuration and reload trigger
  protected readonly config = signal<CrudItemOptions[]>([
    {
      key: "testRadioGroup",
      controlType: CONTROL_TYPES.RADIO,
      label: this.radioGroupLabel(),
      options: this.sampleOptions,
      controlOptions: {
        disabled: this.radioGroupDisabled(),
        hidden: this.radioGroupHidden(),
        validators: [],
        helpText: this.radioGroupHelpText(),
        tooltipLabel: this.radioGroupTooltipLabel(),
        label: this.radioGroupControlLabel(),
        isClearable: this.radioGroupClearable(),
        radioOptionsDirection: this.radioGroupDirection(),
      },
    },
  ]);
  protected readonly forceReload = signal(0);

  /**
   * Apply the current Radio Group configuration to generate the form
   */
  protected applyConfig(): void {
    const validators = [];

    // Add required validator if needed
    if (this.radioGroupRequired()) {
      validators.push(Validators.required);
    }

    const fieldConfig: CrudItemOptions = {
      key: "testRadioGroup",
      controlType: CONTROL_TYPES.RADIO,
      label: this.radioGroupLabel(),
      options: this.sampleOptions,
      controlOptions: {
        disabled: this.radioGroupDisabled(),
        hidden: this.radioGroupHidden(),
        validators: validators.length > 0 ? validators : undefined,
        helpText: this.radioGroupHelpText(),
        tooltipLabel: this.radioGroupTooltipLabel(),
        label: this.radioGroupControlLabel(),
        isClearable: this.radioGroupClearable(),
        radioOptionsDirection: this.radioGroupDirection(),
      },
    };

    this.config.set([fieldConfig]);
    // Force reload to ensure the form updates
    this.forceReload.set(this.forceReload() + 1);
  }
}
