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
 * Component for Rich Text Editor (WYSIWYG) field configuration tab
 * Provides comprehensive testing of all available options for rich text editor controls
 */
@Component({
  selector: "frm-rich-text-editor-tab",
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
      Options disponibles pour un champ Rich Text Editor (WYSIWYG - éditeur de texte enrichi)
    </p>
    
    <div class="demo-controls">
      <div class="demo-control">
        <label>Label du champ</label>
        <input pInputText [(ngModel)]="editorLabel" placeholder="Label" />
      </div>

      <div class="demo-control">
        <label>Hauteur de l'éditeur</label>
        <input pInputText 
          [(ngModel)]="editorHeight"  
          placeholder="Hauteur (ex: 200px, 300px)" />
      </div>

      <div class="demo-control">
        <label>Largeur</label>
        <input pInputText 
          [(ngModel)]="editorWidth"  
          placeholder="Largeur (ex: 300px, 50%)" />
      </div>

      <div class="demo-control">
        <label>Texte d'aide</label>
        <input pInputText 
          [(ngModel)]="editorHelpText" 
          placeholder="Texte d'aide sous le champ" />
      </div>

      <div class="demo-control">
        <label>Tooltip</label>
        <input pInputText 
          [(ngModel)]="editorTooltipLabel" 
          placeholder="Texte au survol" />
      </div>

      <div class="demo-control">
        <label>Label control</label>
        <input pInputText 
          [(ngModel)]="editorControlLabel" 
          placeholder="Label dans controlOptions" />
      </div>

      <!-- Checkboxes pour les options booléennes -->
      <div class="checkboxes">
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="editorRequired"
            binary="true" />
          <label>Obligatoire</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="editorDisabled"
            binary="true" />
          <label>Désactivé</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="editorHidden"
            binary="true" />
          <label>Masqué</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="editorShowHtmlToggle"
            binary="true" />
          <label>Afficher bouton HTML</label>
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
export class RichTextEditorTabComponent {
  // Configuration signals for Rich Text Editor
  protected readonly editorLabel = signal("Test Rich Text Editor");
  protected readonly editorHeight = signal<string>("200px");
  protected readonly editorWidth = signal<string | undefined>(undefined);
  protected readonly editorHelpText = signal<string | undefined>(undefined);
  protected readonly editorTooltipLabel = signal<string | undefined>(undefined);
  protected readonly editorControlLabel = signal<string | undefined>(undefined);
  protected readonly editorRequired = signal(false);
  protected readonly editorDisabled = signal(false);
  protected readonly editorHidden = signal(false);
  protected readonly editorShowHtmlToggle = signal<boolean>(true);

  // Form configuration and reload trigger
  protected readonly config = signal<CrudItemOptions[]>([
    {
      key: "testEditor",
      controlType: CONTROL_TYPES.WYSIWYG,
      label: this.editorLabel(),
      controlOptions: {
        disabled: this.editorDisabled(),
        hidden: this.editorHidden(),
        validators: [],
        helpText: this.editorHelpText(),
        tooltipLabel: this.editorTooltipLabel(),
        label: this.editorControlLabel(),
        textEditorHeight: this.editorHeight(),
        isHtmlToggleable: this.editorShowHtmlToggle(),
      },
    },
  ]);
  protected readonly forceReload = signal(0);

  /**
   * Apply the current Rich Text Editor configuration to generate the form
   */
  protected applyConfig(): void {
    const validators = [];

    // Add required validator if needed
    if (this.editorRequired()) {
      validators.push(Validators.required);
    }

    const fieldConfig: CrudItemOptions = {
      key: "testEditor",
      controlType: CONTROL_TYPES.WYSIWYG,
      label: this.editorLabel(),
      controlOptions: {
        disabled: this.editorDisabled(),
        hidden: this.editorHidden(),
        validators: validators.length > 0 ? validators : undefined,
        helpText: this.editorHelpText(),
        tooltipLabel: this.editorTooltipLabel(),
        label: this.editorControlLabel(),
        textEditorHeight: this.editorHeight(),
        isHtmlToggleable: this.editorShowHtmlToggle(),
      },
    };

    this.config.set([fieldConfig]);
    // Force reload to ensure the form updates
    this.forceReload.set(this.forceReload() + 1);
  }
}
