import { Component, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { min, required } from "@crud/form/utils/common.validators";
import { FormComponent } from "@form/form/form.component";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { PanelModule } from "primeng/panel";
import { SelectModule } from "primeng/select";

/**
 * Component for Table Control field configuration tab
 * Provides comprehensive testing of all available options for table control fields
 */
@Component({
  selector: "frm-table-control-tab",
  imports: [
    FormComponent,
    FormsModule,
    ButtonModule,
    SelectModule,
    CheckboxModule,
    InputTextModule,
    PanelModule,
  ],
  template: `
    <p-panel header="⚠️ Travaux en cours" [toggleable]="true">
      <p>Les fonctionnalités suivantes sont en cours de développement :</p>
      <ul>
        <li>Validateurs personnalisés pour les colonnes (pour l'instant, seul 'required' est supporté)</li>
        <li>Suppression et création de lignes depuis le tableau</li>
      </ul>
    </p-panel>

    <h3>Configuration</h3>
    <p class="intro-text">
      Options disponibles pour un champ Table Control (tableau éditable avec lignes dynamiques)
    </p>
    
    <div class="demo-controls">
      <div class="demo-control">
        <label>Label du champ</label>
        <input pInputText [(ngModel)]="tableLabel" placeholder="Label" />
      </div>

      <div class="demo-control">
        <label>Largeur</label>
        <input pInputText 
          [(ngModel)]="tableWidth"  
          placeholder="Largeur (ex: 100%, 800px)" />
      </div>

      <div class="demo-control">
        <label>Texte d'aide</label>
        <input pInputText 
          [(ngModel)]="tableHelpText" 
          placeholder="Texte d'aide sous le champ" />
      </div>

      <div class="demo-control">
        <label>Tooltip</label>
        <input pInputText 
          [(ngModel)]="tableTooltipLabel" 
          placeholder="Texte au survol" />
      </div>

      <div class="demo-control">
        <label>Mode d'édition</label>
        <p-select 
          [options]="editionModeOptions" 
          [(ngModel)]="editionMode"
          placeholder="Choisir un mode" />
      </div>

      <!-- Checkboxes pour les options booléennes -->
      <div class="checkboxes">
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="tableRequired"
            binary="true" />
          <label>Obligatoire</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="tableDisabled"
            binary="true" />
          <label>Désactivé</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="tableHidden"
            binary="true" />
          <label>Masqué</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="isHeaderHidden"
            binary="true" />
          <label>Masquer l'en-tête</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="filterable"
            binary="true" />
          <label>Filtrable</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="sortable"
            binary="true" />
          <label>Triable</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="selectable"
            binary="true" />
          <label>Sélectionnable</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="deletable"
            binary="true" />
          <label>Suppression autorisée</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="creatable"
            binary="true" />
          <label>Création autorisée</label>
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
          [model]="initialModel"
          [config]="config()"
          labelStrategy="ifta"
          [forceReload]="forceReload()"
          [showDebug]="true"
        />
    </div>
  `,
})
export class TableControlTabComponent {
  // Configuration signals for Table Control
  protected readonly tableLabel = signal("Work Experience");
  protected readonly tableWidth = signal<string | undefined>("100%");
  protected readonly tableHelpText = signal<string | undefined>(undefined);
  protected readonly tableTooltipLabel = signal<string | undefined>(undefined);
  protected readonly tableRequired = signal(false);
  protected readonly tableDisabled = signal(false);
  protected readonly tableHidden = signal(false);
  protected readonly editionMode = signal<"row" | "cell">("row");
  protected readonly isHeaderHidden = signal(false);
  protected readonly filterable = signal(false);
  protected readonly sortable = signal(false);
  protected readonly selectable = signal(false);
  protected readonly deletable = signal(false);
  protected readonly creatable = signal(false);

  // Edition mode options
  protected readonly editionModeOptions = [
    { label: "Ligne", value: "row" },
    { label: "Cellule", value: "cell" },
  ];

  // Initial model with sample data
  protected readonly initialModel = {
    workExperience: [
      {
        id: 1,
        company: "Tech Corp",
        position: "Senior Developer",
        skills: ["js", "ts", "angular"],
        duration: 24,
      },
      {
        id: 2,
        company: "Innovation Labs",
        position: "Full Stack Developer",
        skills: ["react", "node", "python"],
        duration: 18,
      },
    ],
  };

  // Sample skills options
  private readonly skillsOptions = [
    { label: "JavaScript", value: "js" },
    { label: "TypeScript", value: "ts" },
    { label: "Angular", value: "angular" },
    { label: "React", value: "react" },
    { label: "Vue.js", value: "vue" },
    { label: "Node.js", value: "node" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C#", value: "csharp" },
    { label: "PHP", value: "php" },
  ];

  // Table columns configuration
  private readonly tableColumns: CrudItemOptions[] = [
    {
      key: "company",
      label: "Company",
      controlType: "input",
      type: "text",
      controlOptions: {
        validators: [required],
      },
    },
    {
      key: "position",
      label: "Position",
      controlType: "input",
      type: "text",
      controlOptions: {
        validators: [required],
      },
      columnOptions: {
        isCellEditionDisabled: true,
      },
    },
    {
      key: "skills",
      label: "Skills Used",
      controlType: "multiselect",
      options: this.skillsOptions,
    },
    {
      key: "duration",
      label: "Duration",
      controlType: "input",
      type: "number",
      controlOptions: {
        validators: [required, min(1)],
      },
    },
  ];

  /**
   * Computed table control configuration based on current signal values
   */
  private readonly currentTableCtrlConfig = computed(() => ({
    editionMode: this.editionMode(),
    isHeaderHidden: this.isHeaderHidden(),
    filterable: this.filterable(),
    sortable: this.sortable(),
    selectable: this.selectable(),
    isDeletionEnabled: this.deletable(),
    isCreationEnabled: this.creatable(),
  }));

  // Form configuration and reload trigger
  protected readonly config = signal<CrudItemOptions[]>([
    {
      key: "workExperience",
      label: this.tableLabel(),
      controlType: CONTROL_TYPES.TABLE,
      controlOptions: {
        disabled: this.tableDisabled(),
        hidden: this.tableHidden(),
        validators: [],
        helpText: this.tableHelpText(),
        tooltipLabel: this.tableTooltipLabel(),
        width: this.tableWidth(),
        tableCtrlConfig: this.currentTableCtrlConfig(),
        tableCtrlColumns: this.tableColumns,
      },
    },
  ]);
  protected readonly forceReload = signal(0);

  /**
   * Apply the current Table Control configuration to generate the form
   */
  protected applyConfig(): void {
    const validators = [];

    // Add required validator if needed
    if (this.tableRequired()) {
      validators.push(required);
    }

    const fieldConfig: CrudItemOptions = {
      key: "workExperience",
      label: this.tableLabel(),
      controlType: CONTROL_TYPES.TABLE,
      controlOptions: {
        disabled: this.tableDisabled(),
        hidden: this.tableHidden(),
        validators: validators.length > 0 ? validators : undefined,
        helpText: this.tableHelpText(),
        tooltipLabel: this.tableTooltipLabel(),
        width: this.tableWidth(),
        tableCtrlConfig: this.currentTableCtrlConfig(),
        tableCtrlColumns: this.tableColumns,
      },
    };

    this.config.set([fieldConfig]);
    // Force reload to ensure the form updates
    this.forceReload.set(this.forceReload() + 1);
  }
}
