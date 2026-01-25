import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { requiredTrue } from "@crud/form/utils/common.validators";
import { FormComponent } from "@form/form/form.component";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";

/**
 * Component for Checkbox field configuration tab
 * Provides comprehensive testing of all available options for checkbox fields
 */
@Component({
  selector: "frm-checkbox-input-tab",
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
      Options disponibles pour un champ Checkbox
    </p>
    
    <div class="demo-controls">
      <div class="demo-control">
        <label>Label du champ</label>
        <input pInputText [(ngModel)]="checkboxLabel" placeholder="Label" />
      </div>

      <div class="demo-control">
        <label>Largeur</label>
        <input pInputText 
          [(ngModel)]="checkboxWidth"  
          placeholder="Largeur (ex: 300px, 50%)" />
      </div>

      <div class="demo-control">
        <label>Help Text</label>
        <input pInputText 
          [(ngModel)]="checkboxHelpText" 
          placeholder="Texte d'aide sous le champ" />
      </div>

      <div class="demo-control">
        <label>Tooltip Label</label>
        <input pInputText 
          [(ngModel)]="checkboxTooltipLabel" 
          placeholder="Texte au survol" />
      </div>

      <div class="demo-control">
        <label>Control Options Label</label>
        <input pInputText 
          [(ngModel)]="checkboxControlLabel" 
          placeholder="Label dans controlOptions" />
      </div>

      <!-- Checkboxes pour les options booléennes -->
      <div class="checkboxes">
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="checkboxRequired"
            binary="true" />
          <label>Obligatoire</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="checkboxDisabled"
            binary="true" />
          <label>Désactivé</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="checkboxHidden"
            binary="true" />
          <label>Masqué</label>
        </div>

      <p-button 
        label="Appliquer"
        (click)="applyConfig()"
        class="apply-btn" />
    </div>
    
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
export class CheckboxInputTabComponent {
  // Configuration signals for Checkbox
  protected readonly checkboxLabel = signal("Test Checkbox");
  protected readonly checkboxWidth = signal<string | undefined>(undefined);
  protected readonly checkboxHelpText = signal<string | undefined>(undefined);
  protected readonly checkboxTooltipLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly checkboxControlLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly checkboxRequired = signal(false);
  protected readonly checkboxDisabled = signal(false);
  protected readonly checkboxHidden = signal(false);

  // Form configuration and reload trigger
  protected readonly config = signal<CrudItemOptions[]>([
    {
      key: "testCheckbox",
      controlType: CONTROL_TYPES.CHECKBOX,
      label: this.checkboxLabel(),
      controlOptions: {
        disabled: this.checkboxDisabled(),
        hidden: this.checkboxHidden(),
        validators: [],
        width: this.checkboxWidth(),
        helpText: this.checkboxHelpText(),
        label: this.checkboxControlLabel(),
        tooltipLabel: this.checkboxTooltipLabel(),
      },
    },
  ]);
  protected readonly forceReload = signal(0);

  /**
   * Apply the current Checkbox configuration to generate the form
   */
  protected applyConfig(): void {
    const validators = [];

    // Add required validator if needed
    if (this.checkboxRequired()) {
      validators.push(requiredTrue);
    }

    const fieldConfig: CrudItemOptions = {
      key: "testCheckbox",
      controlType: CONTROL_TYPES.CHECKBOX,
      label: this.checkboxLabel(),
      controlOptions: {
        disabled: this.checkboxDisabled(),
        hidden: this.checkboxHidden(),
        validators: validators.length > 0 ? validators : undefined,
        label: this.checkboxControlLabel(),
        helpText: this.checkboxHelpText(),
        width: this.checkboxWidth(),
        tooltipLabel: this.checkboxTooltipLabel(),
      },
    };

    this.config.set([fieldConfig]);
    // Force reload to ensure the form updates
    this.forceReload.set(this.forceReload() + 1);
  }
}
