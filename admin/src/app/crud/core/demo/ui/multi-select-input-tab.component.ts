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
 * Component for Multi-Select field configuration tab
 * Provides comprehensive testing of all available options for multi-select dropdown fields
 */
@Component({
  selector: "frm-multi-select-input-tab",
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
      Options disponibles pour un champ Multi-Select
    </p>
    
    <div class="demo-controls">
      <div class="demo-control">
        <label>Label du champ</label>
        <input pInputText [(ngModel)]="multiSelectLabel" placeholder="Label" />
      </div>

      <div class="demo-control">
        <label>Placeholder</label>
        <input pInputText [(ngModel)]="multiSelectPlaceholder" placeholder="Placeholder" />
      </div>

      <div class="demo-control">
        <label>Icône</label>
        <p-select 
          [options]="iconOptions" 
          [(ngModel)]="multiSelectIcon"
          placeholder="Choisir une icône"
          [showClear]="true" />
      </div>

      <div class="demo-control">
        <label>Largeur</label>
        <input pInputText 
          [(ngModel)]="multiSelectWidth"  
          placeholder="Largeur (ex: 300px, 50%)" />
      </div>

      <div class="demo-control">
        <label>Texte d'aide</label>
        <input pInputText 
          [(ngModel)]="multiSelectHelpText" 
          placeholder="Texte d'aide sous le champ" />
      </div>

      <div class="demo-control">
        <label>Tooltip</label>
        <input pInputText 
          [(ngModel)]="multiSelectTooltipLabel" 
          placeholder="Texte au survol" />
      </div>

      <div class="demo-control">
        <label>Label control</label>
        <input pInputText 
          [(ngModel)]="multiSelectControlLabel" 
          placeholder="Label dans controlOptions" />
      </div>

      <div class="demo-control">
        <label>Nombre max de labels affichés</label>
        <input pInputText 
          type="number"
          [(ngModel)]="multiSelectMaxSelectedLabels" 
          placeholder="ex: 3" />
      </div>

      <!-- Checkboxes pour les options booléennes -->
      <div class="checkboxes">
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="multiSelectRequired"
            binary="true" />
          <label>Obligatoire</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="multiSelectDisabled"
            binary="true" />
          <label>Désactivé</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="multiSelectHidden"
            binary="true" />
          <label>Masqué</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="multiSelectClearable"
            binary="true" />
          <label>Bouton effacer</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="multiSelectOptionsFilterable"
            binary="true" />
          <label>Options filtrables</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="multiSelectAllEnabled"
            binary="true" />
          <label>Option "Tout sélectionner"</label>
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
export class MultiSelectInputTabComponent {
  // Configuration signals for Multi-Select
  protected readonly multiSelectLabel = signal("Test Multi-Select");
  protected readonly multiSelectPlaceholder = signal("Sélectionnez...");
  protected readonly multiSelectIcon = signal<string | undefined>(undefined);
  protected readonly multiSelectWidth = signal<string | undefined>(undefined);
  protected readonly multiSelectHelpText = signal<string | undefined>(
    undefined,
  );
  protected readonly multiSelectTooltipLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly multiSelectControlLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly multiSelectRequired = signal(false);
  protected readonly multiSelectDisabled = signal(false);
  protected readonly multiSelectHidden = signal(false);
  protected readonly multiSelectClearable = signal<boolean>(true);
  protected readonly multiSelectOptionsFilterable = signal<boolean>(true);
  protected readonly multiSelectAllEnabled = signal<boolean>(true);
  protected readonly multiSelectMaxSelectedLabels = signal<number | undefined>(
    undefined,
  );

  // Sample data for multi-select
  private readonly sampleOptions = [
    { label: "France", value: "FR" },
    { label: "États-Unis", value: "US" },
    { label: "Allemagne", value: "DE" },
    { label: "Italie", value: "IT" },
    { label: "Espagne", value: "ES" },
    { label: "Royaume-Uni", value: "GB" },
    { label: "Canada", value: "CA" },
    { label: "Japon", value: "JP" },
    { label: "Australie", value: "AU" },
    { label: "Brésil", value: "BR" },
    { label: "Chine", value: "CN" },
    { label: "Inde", value: "IN" },
    { label: "Mexique", value: "MX" },
    { label: "Pays-Bas", value: "NL" },
    { label: "Suisse", value: "CH" },
  ];

  // Form configuration and reload trigger
  protected readonly config = signal<CrudItemOptions[]>([
    {
      key: "testMultiSelect",
      controlType: CONTROL_TYPES.MULTISELECT,
      label: this.multiSelectLabel(),
      options: this.sampleOptions,
      controlOptions: {
        disabled: this.multiSelectDisabled(),
        hidden: this.multiSelectHidden(),
        validators: [],
        placeholder: this.multiSelectPlaceholder(),
        inputIcon: this.multiSelectIcon(),
        helpText: this.multiSelectHelpText(),
        tooltipLabel: this.multiSelectTooltipLabel(),
        label: this.multiSelectControlLabel(),
        isClearable: this.multiSelectClearable(),
        areOptionsFilterable: this.multiSelectOptionsFilterable(),
        isSelectAllEnabled: this.multiSelectAllEnabled(),
        maxSelectedLabels: this.multiSelectMaxSelectedLabels(),
      },
    },
  ]);
  protected readonly forceReload = signal(0);

  // Icon options for dropdown
  protected readonly iconOptions = [
    { label: "List", value: "pi pi-list" },
    { label: "Check Square", value: "pi pi-check-square" },
    { label: "Users", value: "pi pi-users" },
    { label: "Tag", value: "pi pi-tag" },
    { label: "Tags", value: "pi pi-tags" },
    { label: "Globe", value: "pi pi-globe" },
    { label: "Map Marker", value: "pi pi-map-marker" },
    { label: "Building", value: "pi pi-building" },
  ];

  /**
   * Apply the current Multi-Select configuration to generate the form
   */
  protected applyConfig(): void {
    const validators = [];

    // Add required validator if needed
    if (this.multiSelectRequired()) {
      validators.push(Validators.required);
    }

    const fieldConfig: CrudItemOptions = {
      key: "testMultiSelect",
      controlType: CONTROL_TYPES.MULTISELECT,
      label: this.multiSelectLabel(),
      options: this.sampleOptions,
      controlOptions: {
        disabled: this.multiSelectDisabled(),
        hidden: this.multiSelectHidden(),
        validators: validators.length > 0 ? validators : undefined,
        placeholder: this.multiSelectPlaceholder(),
        inputIcon: this.multiSelectIcon(),
        helpText: this.multiSelectHelpText(),
        tooltipLabel: this.multiSelectTooltipLabel(),
        label: this.multiSelectControlLabel(),
        isClearable: this.multiSelectClearable(),
        areOptionsFilterable: this.multiSelectOptionsFilterable(),
        isSelectAllEnabled: this.multiSelectAllEnabled(),
        maxSelectedLabels: this.multiSelectMaxSelectedLabels(),
      },
    };

    this.config.set([fieldConfig]);
    // Force reload to ensure the form updates
    this.forceReload.set(this.forceReload() + 1);
  }
}
