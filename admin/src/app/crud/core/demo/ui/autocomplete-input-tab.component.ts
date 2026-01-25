import { Component, signal } from "@angular/core";
import { FormsModule, Validators } from "@angular/forms";
import { ExtendedSelectItem } from "@crud/core/models/control-options.model";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormComponent } from "@form/form/form.component";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

/**
 * Component for Autocomplete field configuration tab
 * Provides comprehensive testing of all available options for autocomplete input fields
 */
@Component({
  selector: "frm-autocomplete-input-tab",
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
      Options disponibles pour un champ Autocomplete
    </p>
    
    <div class="demo-controls">
      <div class="demo-control">
        <label>Label du champ</label>
        <input pInputText [(ngModel)]="autocompleteLabel" placeholder="Label" />
      </div>

      <div class="demo-control">
        <label>Placeholder</label>
        <input pInputText [(ngModel)]="autocompletePlaceholder" placeholder="Placeholder" />
      </div>

      <div class="demo-control">
        <label>Icône</label>
        <p-select 
          [options]="iconOptions" 
          [(ngModel)]="autocompleteIcon"
          placeholder="Choisir une icône"
          [showClear]="true" />
      </div>

      <div class="demo-control">
        <label>Largeur</label>
        <input pInputText 
          [(ngModel)]="autocompleteWidth"  
          placeholder="Largeur (ex: 300px, 50%)" />
      </div>

      <div class="demo-control">
        <label>Texte d'aide</label>
        <input pInputText 
          [(ngModel)]="autocompleteHelpText" 
          placeholder="Texte d'aide sous le champ" />
      </div>

      <div class="demo-control">
        <label>Tooltip</label>
        <input pInputText 
          [(ngModel)]="autocompleteTooltipLabel" 
          placeholder="Texte au survol" />
      </div>

      <div class="demo-control">
        <label>Label des options de contrôle</label>
        <input pInputText 
          [(ngModel)]="autocompleteControlLabel" 
          placeholder="Label dans controlOptions" />
      </div>

      <div class="demo-control">
        <label>Longueur minimale de requête</label>
        <input pInputText 
          type="number"
          [(ngModel)]="autocompleteMinQueryLength" 
          placeholder="Nombre de caractères min" />
      </div>

      <div class="demo-control">
        <label>Délai (ms)</label>
        <input pInputText 
          type="number"
          [(ngModel)]="autocompleteDelay" 
          placeholder="Délai en millisecondes" />
      </div>

      <div class="demo-control">
        <label>Hauteur du dropdown</label>
        <input pInputText 
          [(ngModel)]="autocompleteScrollHeight" 
          placeholder="ex: 200px, 300px" />
      </div>

      <!-- Checkboxes pour les options booléennes -->
      <div class="checkboxes">
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="autocompleteRequired"
            binary="true" />
          <label>Obligatoire</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="autocompleteDisabled"
            binary="true" />
          <label>Désactivé</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="autocompleteHidden"
            binary="true" />
          <label>Masqué</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="autocompleteClearable"
            binary="true" />
          <label>Bouton effacer</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="autocompleteCompleteOnFocusDisabled"
            binary="true" />
          <label>Désactiver suggestions au focus</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="autocompleteOptionCreationEnabled"
            binary="true" />
          <label>Permettre création d'options</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="autocompleteMultiple"
            binary="true" />
          <label>Sélection multiple</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="autocompleteDropdown"
            binary="true" />
          <label>Afficher bouton dropdown</label>
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
export class AutocompleteInputTabComponent {
  // Configuration signals for Autocomplete
  protected readonly autocompleteLabel = signal("Test Autocomplete");
  protected readonly autocompletePlaceholder = signal("Rechercher...");
  protected readonly autocompleteIcon = signal<string | undefined>(undefined);
  protected readonly autocompleteWidth = signal<string | undefined>(undefined);
  protected readonly autocompleteHelpText = signal<string | undefined>(
    undefined,
  );
  protected readonly autocompleteTooltipLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly autocompleteControlLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly autocompleteRequired = signal(false);
  protected readonly autocompleteDisabled = signal(false);
  protected readonly autocompleteHidden = signal(false);
  protected readonly autocompleteClearable = signal<boolean>(true);
  protected readonly autocompleteCompleteOnFocusDisabled =
    signal<boolean>(false);
  protected readonly autocompleteOptionCreationEnabled = signal<boolean>(false);
  protected readonly autocompleteMinQueryLength = signal<number | undefined>(
    undefined,
  );
  protected readonly autocompleteDelay = signal<number | undefined>(undefined);
  protected readonly autocompleteScrollHeight = signal<string | undefined>(
    undefined,
  );
  protected readonly autocompleteMultiple = signal<boolean>(false);
  protected readonly autocompleteDropdown = signal<boolean>(false);

  // Sample data for autocomplete
  private readonly sampleCountries = [
    { label: "France", value: "FR", icon: "🇫🇷" },
    { label: "United States", value: "US", icon: "🇺🇸" },
    { label: "Germany", value: "DE", icon: "🇩🇪" },
    { label: "Italy", value: "IT", icon: "🇮🇹" },
    { label: "Spain", value: "ES", icon: "🇪🇸" },
    { label: "United Kingdom", value: "GB", icon: "🇬🇧" },
    { label: "Canada", value: "CA", icon: "🇨🇦" },
    { label: "Japan", value: "JP", icon: "🇯🇵" },
    { label: "Australia", value: "AU", icon: "🇦🇺" },
    { label: "Brazil", value: "BR", icon: "🇧🇷" },
    { label: "China", value: "CN", icon: "🇨🇳" },
    { label: "India", value: "IN", icon: "🇮🇳" },
    { label: "Mexico", value: "MX", icon: "🇲🇽" },
    { label: "Netherlands", value: "NL", icon: "🇳🇱" },
    { label: "Switzerland", value: "CH", icon: "🇨🇭" },
  ];

  // Form configuration and reload trigger
  protected readonly config = signal<CrudItemOptions[]>([
    {
      key: "testAutocomplete",
      controlType: CONTROL_TYPES.AUTOCOMPLETE,
      label: this.autocompleteLabel(),
      controlOptions: {
        disabled: this.autocompleteDisabled(),
        hidden: this.autocompleteHidden(),
        validators: [],
        placeholder: this.autocompletePlaceholder(),
        inputIcon: this.autocompleteIcon(),
        helpText: this.autocompleteHelpText(),
        tooltipLabel: this.autocompleteTooltipLabel(),
        label: this.autocompleteControlLabel(),
        isClearable: this.autocompleteClearable(),
        isCompleteOnFocusDisabled: this.autocompleteCompleteOnFocusDisabled(),
        isOptionCreationEnabled: this.autocompleteOptionCreationEnabled(),
        autocompleteMinQueryLength: this.autocompleteMinQueryLength(),
        autocompleteDelay: this.autocompleteDelay(),
        autocompleteScrollHeight: this.autocompleteScrollHeight(),
        autocompleteMultiple: this.autocompleteMultiple(),
        autocompleteDropdown: this.autocompleteDropdown(),
        searchOptionsFn: (query: string) => this.searchCountries(query),
      },
    },
  ]);
  protected readonly forceReload = signal(0);

  // Icon options for dropdown
  protected readonly iconOptions = [
    { label: "Search", value: "pi pi-search" },
    { label: "User", value: "pi pi-user" },
    { label: "Users", value: "pi pi-users" },
    { label: "Building", value: "pi pi-building" },
    { label: "Globe", value: "pi pi-globe" },
    { label: "Map Marker", value: "pi pi-map-marker" },
    { label: "Tag", value: "pi pi-tag" },
    { label: "List", value: "pi pi-list" },
  ];

  /**
   * Search function for autocomplete
   * Simulates async search with filtering and delay
   */
  private searchCountries(query: string): Observable<ExtendedSelectItem[]> {
    const filtered = this.sampleCountries
      .filter(
        (country) =>
          country.label.toLowerCase().includes(query.toLowerCase()) ||
          country.value.toLowerCase().includes(query.toLowerCase()),
      )
      .map((country) => ({
        label: country.label,
        value: country.value,
        icon: country.icon,
        extraData: country,
      }));

    // Simulate async search with 200ms delay
    return of(filtered).pipe(delay(200));
  }

  /**
   * Apply the current Autocomplete configuration to generate the form
   */
  protected applyConfig(): void {
    const validators = [];

    // Add required validator if needed
    if (this.autocompleteRequired()) {
      validators.push(Validators.required);
    }

    const fieldConfig: CrudItemOptions = {
      key: "testAutocomplete",
      controlType: CONTROL_TYPES.AUTOCOMPLETE,
      label: this.autocompleteLabel(),
      controlOptions: {
        disabled: this.autocompleteDisabled(),
        hidden: this.autocompleteHidden(),
        validators: validators.length > 0 ? validators : undefined,
        placeholder: this.autocompletePlaceholder(),
        inputIcon: this.autocompleteIcon(),
        helpText: this.autocompleteHelpText(),
        tooltipLabel: this.autocompleteTooltipLabel(),
        label: this.autocompleteControlLabel(),
        isClearable: this.autocompleteClearable(),
        isCompleteOnFocusDisabled: this.autocompleteCompleteOnFocusDisabled(),
        isOptionCreationEnabled: this.autocompleteOptionCreationEnabled(),
        autocompleteMinQueryLength: this.autocompleteMinQueryLength(),
        autocompleteDelay: this.autocompleteDelay(),
        autocompleteScrollHeight: this.autocompleteScrollHeight(),
        autocompleteMultiple: this.autocompleteMultiple(),
        autocompleteDropdown: this.autocompleteDropdown(),
        searchOptionsFn: (query: string) => this.searchCountries(query),
      },
    };

    this.config.set([fieldConfig]);
    // Force reload to ensure the form updates
    this.forceReload.set(this.forceReload() + 1);
  }
}
