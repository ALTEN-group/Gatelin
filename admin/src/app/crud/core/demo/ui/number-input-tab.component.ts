import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { INPUT_TYPES } from "@crud/core/models/input-type.model";
import { max, min, required } from "@crud/form/utils/common.validators";
import { FormComponent } from "@form/form/form.component";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";

/**
 * Component for Number Input field configuration tab
 * Provides comprehensive testing of all available options for numeric input fields
 */
@Component({
  selector: "frm-number-input-tab",
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
      Options disponibles pour un champ Number Input
    </p>
    
    <div class="demo-controls">
      <div class="demo-control">
        <label>Label du champ</label>
        <input pInputText [(ngModel)]="numberInputLabel" placeholder="Label" />
      </div>

      <div class="demo-control">
        <label>Icône</label>
        <p-select 
          [options]="iconOptions" 
          [(ngModel)]="numberInputIcon"
          placeholder="Choisir une icône"
          [showClear]="true" />
      </div>

      <div class="demo-control">
        <label>Largeur</label>
        <input pInputText 
          [(ngModel)]="numberInputWidth"  
          placeholder="Largeur (ex: 300px, 50%)" />
      </div>

      <div class="demo-control">
        <label>Help Text</label>
        <input pInputText 
          [(ngModel)]="numberInputHelpText" 
          placeholder="Texte d'aide sous le champ" />
      </div>

      <div class="demo-control">
        <label>Tooltip Label</label>
        <input pInputText 
          [(ngModel)]="numberInputTooltipLabel" 
          placeholder="Texte au survol" />
      </div>

      <div class="demo-control">
        <label>Control Options Label</label>
        <input pInputText 
          [(ngModel)]="numberInputControlLabel" 
          placeholder="Label dans controlOptions" />
      </div>

      <!-- Checkboxes pour les options booléennes -->
      <div class="checkboxes">
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="numberInputRequired"
            binary="true" />
          <label>Obligatoire</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="numberInputDisabled"
            binary="true" />
          <label>Désactivé</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="numberInputHidden"
            binary="true" />
          <label>Masqué</label>
        </div>
      </div>

      <!-- Validation numérique -->
      <div class="demo-control">
        <label>Valeur minimale (validateur)</label>
        <input pInputText type="number" [(ngModel)]="numberValidatorMin" placeholder="Min" />
      </div>

      <div class="demo-control">
        <label>Valeur maximale (validateur)</label>
        <input pInputText type="number" [(ngModel)]="numberValidatorMax" placeholder="Max" />
      </div>

      <div class="demo-control">
        <label>Valeur minimale (input)</label>
        <input pInputText type="number" [(ngModel)]="numberInputMin" placeholder="Min" />
      </div>

      <div class="demo-control">
        <label>Valeur maximale (input)</label>
        <input pInputText type="number" [(ngModel)]="numberInputMax" placeholder="Max" />
      </div>

      <div class="demo-control">
        <label>Valeur par défaut</label>
        <input pInputText type="number" [(ngModel)]="numberInputDefaultValue" placeholder="Valeur par défaut" />
      </div>

      <div class="demo-control">
        <label>Nombre minimum de décimales</label>
        <input pInputText type="number" [(ngModel)]="numberInputMinFractionDigits" placeholder="Min Fraction Digits" />
      </div>

      <div class="demo-control">
        <label>Nombre maximum de décimales</label>
        <input pInputText type="number" [(ngModel)]="numberInputMaxFractionDigits" placeholder="Max Fraction Digits" />
      </div>

      <div class="demo-control">
        <label>Incrément (step)</label>
        <input pInputText type="number" [(ngModel)]="numberInputStep" placeholder="Step" />
      </div>

      <div class="demo-control">
        <label>Code devise (currency)</label>
        <input pInputText [(ngModel)]="numberCurrency" placeholder="USD, EUR, GBP..." />
      </div>

      <!-- Checkboxes pour les nouvelles options booléennes -->
      <div class="checkboxes">
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="areNumberInputButtonsVisible"
            binary="true" />
          <label>Afficher les boutons +/-</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="useNumberGrouping"
            binary="true" />
          <label>Utiliser le séparateur de milliers</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="isClearable"
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
export class NumberInputTabComponent {
  // Configuration signals for Number Input
  protected readonly numberInputLabel = signal("Test Number");
  protected readonly numberInputIcon = signal<string | undefined>(undefined);
  protected readonly numberInputWidth = signal<string | undefined>(undefined);
  protected readonly numberInputHelpText = signal<string | undefined>(
    undefined,
  );
  protected readonly numberInputTooltipLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly numberInputControlLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly numberInputRequired = signal(false);
  protected readonly numberInputDisabled = signal(false);
  protected readonly numberInputHidden = signal(false);
  protected readonly numberInputMin = signal<number | undefined>(undefined);
  protected readonly numberInputMax = signal<number | undefined>(undefined);
  protected readonly numberValidatorMin = signal<number | undefined>(undefined);
  protected readonly numberValidatorMax = signal<number | undefined>(undefined);
  protected readonly numberInputDefaultValue = signal<number | undefined>(
    undefined,
  );
  protected readonly numberInputMinFractionDigits = signal<number | undefined>(
    undefined,
  );
  protected readonly numberInputMaxFractionDigits = signal<number | undefined>(
    undefined,
  );
  protected readonly numberInputStep = signal<number | undefined>(undefined);
  protected readonly numberCurrency = signal<string | undefined>(undefined);
  protected readonly areNumberInputButtonsVisible = signal<boolean | undefined>(
    true,
  );
  protected readonly useNumberGrouping = signal<boolean | undefined>(false);
  protected readonly isClearable = signal<boolean | undefined>(true);

  // Form configuration and reload trigger
  protected readonly config = signal<CrudItemOptions[]>([
    {
      key: "testNumber",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.NUMBER,
      label: this.numberInputLabel(),
      controlOptions: {
        defaultValue: this.numberInputDefaultValue(),
        disabled: this.numberInputDisabled(),
        hidden: this.numberInputHidden(),
        validators: [],
        min: this.numberInputMin(),
        max: this.numberInputMax(),
        minFractionDigits: this.numberInputMinFractionDigits(),
        maxFractionDigits: this.numberInputMaxFractionDigits(),
        step: this.numberInputStep(),
        numberCurrency: this.numberCurrency(),
        areNumberInputButtonsVisible: this.areNumberInputButtonsVisible(),
        useNumberGrouping: this.useNumberGrouping(),
        isClearable: this.isClearable(),
        label: this.numberInputControlLabel(),
        inputIcon: this.numberInputIcon(),
        helpText: this.numberInputHelpText(),
        tooltipLabel: this.numberInputTooltipLabel(),
      },
    },
  ]);
  protected readonly forceReload = signal(0);

  // Icon options for dropdown
  protected readonly iconOptions = [
    { label: "Calculator", value: "pi pi-calculator" },
    { label: "Dollar", value: "pi pi-dollar" },
    { label: "Euro", value: "pi pi-euro" },
    { label: "Percentage", value: "pi pi-percentage" },
    { label: "Chart", value: "pi pi-chart-line" },
    { label: "Plus", value: "pi pi-plus" },
    { label: "Minus", value: "pi pi-minus" },
    { label: "Times", value: "pi pi-times" },
  ];

  /**
   * Apply the current Number Input configuration to generate the form
   */
  protected applyConfig(): void {
    const validators = [];

    // Add required validator if needed
    if (this.numberInputRequired()) {
      validators.push(required);
    }

    // Add min validator if specified
    const minValue = this.numberValidatorMin();
    if (minValue !== undefined) {
      validators.push(min(minValue));
    }

    // Add max validator if specified
    const maxValue = this.numberValidatorMax();
    if (maxValue !== undefined) {
      validators.push(max(maxValue));
    }

    const fieldConfig: CrudItemOptions = {
      key: "testNumber",
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.NUMBER,
      label: this.numberInputLabel(),
      controlOptions: {
        defaultValue: this.numberInputDefaultValue(),
        disabled: this.numberInputDisabled(),
        hidden: this.numberInputHidden(),
        validators: validators.length > 0 ? validators : undefined,
        min: this.numberInputMin(),
        max: this.numberInputMax(),
        minFractionDigits: this.numberInputMinFractionDigits(),
        maxFractionDigits: this.numberInputMaxFractionDigits(),
        step: this.numberInputStep(),
        numberCurrency: this.numberCurrency(),
        areNumberInputButtonsVisible: this.areNumberInputButtonsVisible(),
        useNumberGrouping: this.useNumberGrouping(),
        isClearable: this.isClearable(),
        label: this.numberInputControlLabel(),
        inputIcon: this.numberInputIcon(),
        helpText: this.numberInputHelpText(),
        tooltipLabel: this.numberInputTooltipLabel(),
      },
    };

    this.config.set([fieldConfig]);
    // Force reload to ensure the form updates
    this.forceReload.set(this.forceReload() + 1);
  }
}
