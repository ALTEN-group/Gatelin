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
 * Component for Input Text field configuration tab
 * Provides comprehensive testing of all available options for text input fields
 */
@Component({
  selector: "frm-input-text-tab",
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
      Options disponibles pour un champ Input Text
    </p>
    
    <div class="demo-controls">
      <div class="demo-control">
        <label>Label du champ</label>
        <input pInputText [(ngModel)]="inputTextLabel" placeholder="Label" />
      </div>

      <div class="demo-control">
        <label>Placeholder</label>
        <input pInputText [(ngModel)]="inputTextPlaceholder" placeholder="Placeholder" />
      </div>

      <div class="demo-control">
        <label>Icône</label>
        <p-select 
          [options]="iconOptions" 
          [(ngModel)]="inputTextIcon"
          placeholder="Choisir une icône"
          [showClear]="true" />
      </div>

      <div class="demo-control">
        <label>Largeur</label>
        <input pInputText 
          [(ngModel)]="inputTextWidth"  
          placeholder="Largeur (ex: 300px, 50%)" />
      </div>

      <div class="demo-control">
        <label>Help Text</label>
        <input pInputText 
          [(ngModel)]="inputTextHelpText" 
          placeholder="Texte d'aide sous le champ" />
      </div>

      <div class="demo-control">
        <label>Tooltip Label</label>
        <input pInputText 
          [(ngModel)]="inputTextTooltipLabel" 
          placeholder="Texte au survol" />
      </div>

      <div class="demo-control">
        <label>Control Options Label</label>
        <input pInputText 
          [(ngModel)]="inputTextControlLabel" 
          placeholder="Label dans controlOptions" />
      </div>

      <!-- Checkboxes pour les options booléennes -->
      <div class="checkboxes">
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="inputTextRequired"
            binary="true" />
          <label>Obligatoire</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="inputTextDisabled"
            binary="true" />
          <label>Désactivé</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="inputTextHidden"
            binary="true" />
          <label>Masqué</label>
        </div>
      </div>

      <!-- Validation -->
      <div class="demo-control">
        <label>Longueur minimale</label>
        <input pInputText type="number" [(ngModel)]="inputTextMinLength" placeholder="0" />
      </div>

      <div class="demo-control">
        <label>Longueur maximale</label>
        <input pInputText type="number" [(ngModel)]="inputTextMaxLength" placeholder="Illimité" />
      </div>

      <div class="demo-control">
        <label>Valeur par défaut</label>
        <input pInputText [(ngModel)]="inputTextDefaultValue" placeholder="Valeur par défaut" />
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
export class InputTextTabComponent {
  // Configuration signals for Input Text
  protected readonly inputTextLabel = signal("Test Input");
  protected readonly inputTextPlaceholder = signal("");
  protected readonly inputTextIcon = signal<string | undefined>(undefined);
  protected readonly inputTextWidth = signal<string | undefined>(undefined);
  protected readonly inputTextHelpText = signal<string | undefined>(undefined);
  protected readonly inputTextTooltipLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly inputTextControlLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly inputTextRequired = signal(false);
  protected readonly inputTextDisabled = signal(false);
  protected readonly inputTextHidden = signal(false);
  protected readonly inputTextMinLength = signal<number | undefined>(undefined);
  protected readonly inputTextMaxLength = signal<number | undefined>(undefined);
  protected readonly inputTextDefaultValue = signal<string | undefined>(
    undefined,
  );

  // Form configuration and reload trigger
  protected readonly config = signal<CrudItemOptions[]>([
    {
      key: "testInput",
      controlType: CONTROL_TYPES.INPUT,
      label: this.inputTextLabel(),
      controlOptions: {
        defaultValue: this.inputTextDefaultValue(),
        disabled: this.inputTextDisabled(),
        hidden: this.inputTextHidden(),
        validators: [],
      },
    },
  ]);
  protected readonly forceReload = signal(0);

  // Icon options for dropdown
  protected readonly iconOptions = [
    { label: "User", value: "pi pi-user" },
    { label: "Email", value: "pi pi-envelope" },
    { label: "Phone", value: "pi pi-phone" },
    { label: "Search", value: "pi pi-search" },
    { label: "Calendar", value: "pi pi-calendar" },
    { label: "Home", value: "pi pi-home" },
    { label: "Building", value: "pi pi-building" },
    { label: "Globe", value: "pi pi-globe" },
  ];

  /**
   * Apply the current Input Text configuration to generate the form
   */
  protected applyConfig(): void {
    const validators = [];

    // Add required validator if needed
    if (this.inputTextRequired()) {
      validators.push(Validators.required);
    }

    // Add min length validator if specified
    const minLength = this.inputTextMinLength();
    if (minLength !== undefined && minLength > 0) {
      validators.push(Validators.minLength(minLength));
    }

    // Add max length validator if specified
    const maxLength = this.inputTextMaxLength();
    if (maxLength !== undefined && maxLength > 0) {
      validators.push(Validators.maxLength(maxLength));
    }

    const fieldConfig: CrudItemOptions = {
      key: "testInput",
      controlType: CONTROL_TYPES.INPUT,
      label: this.inputTextLabel(),
      controlOptions: {
        placeholder: this.inputTextPlaceholder(),
        defaultValue: this.inputTextDefaultValue(),
        disabled: this.inputTextDisabled(),
        hidden: this.inputTextHidden(),
        validators: validators.length > 0 ? validators : undefined,
        inputIcon: this.inputTextIcon(),
        width: this.inputTextWidth(),
        helpText: this.inputTextHelpText(),
        tooltipLabel: this.inputTextTooltipLabel(),
        label: this.inputTextControlLabel(),
      },
    };

    this.config.set([fieldConfig]);
    // Force reload to ensure the form updates
    this.forceReload.set(this.forceReload() + 1);
  }
}
