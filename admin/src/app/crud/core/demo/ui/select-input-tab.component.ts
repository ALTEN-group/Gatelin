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
 * Component for Select field configuration tab
 * Provides comprehensive testing of all available options for select dropdown fields
 */
@Component({
  selector: "frm-select-input-tab",
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
      Options disponibles pour un champ Select (dropdown simple)
    </p>
    
    <div class="demo-controls">
      <div class="demo-control">
        <label>Label du champ</label>
        <input pInputText [(ngModel)]="selectLabel" placeholder="Label" />
      </div>

      <div class="demo-control">
        <label>Placeholder</label>
        <input pInputText [(ngModel)]="selectPlaceholder" placeholder="Placeholder" />
      </div>

      <div class="demo-control">
        <label>Icône</label>
        <p-select 
          [options]="iconOptions" 
          [(ngModel)]="selectIcon"
          placeholder="Choisir une icône"
          [showClear]="true" />
      </div>

      <div class="demo-control">
        <label>Largeur</label>
        <input pInputText 
          [(ngModel)]="selectWidth"  
          placeholder="Largeur (ex: 300px, 50%)" />
      </div>

      <div class="demo-control">
        <label>Texte d'aide</label>
        <input pInputText 
          [(ngModel)]="selectHelpText" 
          placeholder="Texte d'aide sous le champ" />
      </div>

      <div class="demo-control">
        <label>Tooltip</label>
        <input pInputText 
          [(ngModel)]="selectTooltipLabel" 
          placeholder="Texte au survol" />
      </div>

      <div class="demo-control">
        <label>Label control</label>
        <input pInputText 
          [(ngModel)]="selectControlLabel" 
          placeholder="Label dans controlOptions" />
      </div>

      <!-- Checkboxes pour les options booléennes -->
      <div class="checkboxes">
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="selectRequired"
            binary="true" />
          <label>Obligatoire</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="selectDisabled"
            binary="true" />
          <label>Désactivé</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="selectHidden"
            binary="true" />
          <label>Masqué</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="selectClearable"
            binary="true" />
          <label>Bouton effacer</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="selectOptionsFilterable"
            binary="true" />
          <label>Options filtrables</label>
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
export class SelectInputTabComponent {
  // Configuration signals for Select
  protected readonly selectLabel = signal("Test Select");
  protected readonly selectPlaceholder = signal("Sélectionnez une option...");
  protected readonly selectIcon = signal<string | undefined>(undefined);
  protected readonly selectWidth = signal<string | undefined>(undefined);
  protected readonly selectHelpText = signal<string | undefined>(undefined);
  protected readonly selectTooltipLabel = signal<string | undefined>(undefined);
  protected readonly selectControlLabel = signal<string | undefined>(undefined);
  protected readonly selectRequired = signal(false);
  protected readonly selectDisabled = signal(false);
  protected readonly selectHidden = signal(false);
  protected readonly selectClearable = signal<boolean>(true);
  protected readonly selectOptionsFilterable = signal<boolean>(true);

  // Sample data for select
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
      key: "testSelect",
      controlType: CONTROL_TYPES.SELECT,
      label: this.selectLabel(),
      options: this.sampleOptions,
      controlOptions: {
        disabled: this.selectDisabled(),
        hidden: this.selectHidden(),
        validators: [],
        placeholder: this.selectPlaceholder(),
        inputIcon: this.selectIcon(),
        helpText: this.selectHelpText(),
        tooltipLabel: this.selectTooltipLabel(),
        label: this.selectControlLabel(),
        isClearable: this.selectClearable(),
        areOptionsFilterable: this.selectOptionsFilterable(),
      },
    },
  ]);
  protected readonly forceReload = signal(0);

  // Icon options for dropdown
  protected readonly iconOptions = [
    { label: "List", value: "pi pi-list" },
    { label: "Check", value: "pi pi-check" },
    { label: "Users", value: "pi pi-users" },
    { label: "User", value: "pi pi-user" },
    { label: "Tag", value: "pi pi-tag" },
    { label: "Globe", value: "pi pi-globe" },
    { label: "Map Marker", value: "pi pi-map-marker" },
    { label: "Building", value: "pi pi-building" },
  ];

  /**
   * Apply the current Select configuration to generate the form
   */
  protected applyConfig(): void {
    const validators = [];

    // Add required validator if needed
    if (this.selectRequired()) {
      validators.push(Validators.required);
    }

    const fieldConfig: CrudItemOptions = {
      key: "testSelect",
      controlType: CONTROL_TYPES.SELECT,
      label: this.selectLabel(),
      options: this.sampleOptions,
      controlOptions: {
        disabled: this.selectDisabled(),
        hidden: this.selectHidden(),
        validators: validators.length > 0 ? validators : undefined,
        placeholder: this.selectPlaceholder(),
        inputIcon: this.selectIcon(),
        helpText: this.selectHelpText(),
        tooltipLabel: this.selectTooltipLabel(),
        label: this.selectControlLabel(),
        isClearable: this.selectClearable(),
        areOptionsFilterable: this.selectOptionsFilterable(),
      },
    };

    this.config.set([fieldConfig]);
    // Force reload to ensure the form updates
    this.forceReload.set(this.forceReload() + 1);
  }
}
