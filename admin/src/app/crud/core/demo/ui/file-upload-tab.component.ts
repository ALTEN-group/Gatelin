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
 * Component for File Upload field configuration tab
 * Provides comprehensive testing of all available options for file upload fields
 */
@Component({
  selector: "frm-file-upload-tab",
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
      Options disponibles pour un champ File Upload
    </p>
    
    <div class="demo-controls">
      <div class="demo-control">
        <label>Label du champ</label>
        <input pInputText [(ngModel)]="fileUploadLabel" placeholder="Label" />
      </div>

      <div class="demo-control">
        <label>Largeur</label>
        <input pInputText 
          [(ngModel)]="fileUploadWidth"  
          placeholder="Largeur (ex: 300px, 50%)" />
      </div>

      <div class="demo-control">
        <label>Texte d'aide</label>
        <input pInputText 
          [(ngModel)]="fileUploadHelpText" 
          placeholder="Texte d'aide sous le champ" />
      </div>

      <div class="demo-control">
        <label>Tooltip</label>
        <input pInputText 
          [(ngModel)]="fileUploadTooltipLabel" 
          placeholder="Texte au survol" />
      </div>

      <div class="demo-control">
        <label>Label des options de contrôle</label>
        <input pInputText 
          [(ngModel)]="fileUploadControlLabel" 
          placeholder="Label dans controlOptions" />
      </div>

      <!-- Options spécifiques File Upload -->
      <div class="demo-control">
        <label>Type de média</label>
        <p-select 
          [options]="mediaTypeOptions" 
          [(ngModel)]="fileUploadMediaType"
          placeholder="Choisir un type"
          [showClear]="true" />
      </div>

      <div class="demo-control">
        <label>Taille maximale (octets)</label>
        <input pInputText 
          type="number"
          [(ngModel)]="fileUploadMaxFileSize" 
          placeholder="ex: 8000000 pour 8MB" />
      </div>

      <!-- Checkboxes pour les options booléennes -->
      <div class="checkboxes">
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="fileUploadRequired"
            binary="true" />
          <label>Obligatoire</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="fileUploadDisabled"
            binary="true" />
          <label>Désactivé</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="fileUploadHidden"
            binary="true" />
          <label>Masqué</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="fileUploadMultiple"
            binary="true" />
          <label>Fichiers multiples</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="fileUploadIsPreviewEnabled"
            binary="true" />
          <label>Activer l'aperçu</label>
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
export class FileUploadTabComponent {
  // Configuration signals for File Upload
  protected readonly fileUploadLabel = signal("Test File Upload");
  protected readonly fileUploadWidth = signal<string | undefined>(undefined);
  protected readonly fileUploadHelpText = signal<string | undefined>(undefined);
  protected readonly fileUploadTooltipLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly fileUploadControlLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly fileUploadRequired = signal(false);
  protected readonly fileUploadDisabled = signal(false);
  protected readonly fileUploadHidden = signal(false);
  protected readonly fileUploadMultiple = signal(false);
  protected readonly fileUploadIsPreviewEnabled = signal(true);
  protected readonly fileUploadMediaType = signal<string | undefined>(
    undefined,
  );
  protected readonly fileUploadMaxFileSize = signal<number | undefined>(
    undefined,
  );

  // Form configuration and reload trigger
  protected readonly config = signal<CrudItemOptions[]>([
    {
      key: "testFileUpload",
      controlType: CONTROL_TYPES.FILES,
      label: this.fileUploadLabel(),
      controlOptions: {
        disabled: this.fileUploadDisabled(),
        hidden: this.fileUploadHidden(),
        validators: [],
        helpText: this.fileUploadHelpText(),
        tooltipLabel: this.fileUploadTooltipLabel(),
        label: this.fileUploadControlLabel(),
        multiple: this.fileUploadMultiple(),
        isPreviewEnabled: this.fileUploadIsPreviewEnabled(),
        mediaType: this.fileUploadMediaType(),
        maxFileSize: this.fileUploadMaxFileSize(),
      },
    },
  ]);
  protected readonly forceReload = signal(0);

  // Media type options
  protected readonly mediaTypeOptions = [
    { label: "Image", value: "image" },
    { label: "Image (PNG)", value: ".png" },
    { label: "Image (JPEG)", value: ".jpeg" },
    { label: "PDF", value: ".pdf" },
    { label: "Document Word", value: ".doc" },
    {
      label: "Document Word (docx)",
      value: ".docx",
    },
    { label: "Excel", value: ".xls" },
    {
      label: "Excel (xlsx)",
      value: ".xlsx",
    },
    { label: "CSV", value: ".csv" },
    { label: "Texte", value: ".txt" },
    { label: "JSON", value: ".json" },
    { label: "ZIP", value: ".zip" },
    { label: "Video", value: "video/*" },
    { label: "Audio", value: "audio/*" },
  ];

  /**
   * Apply the current File Upload configuration to generate the form
   */
  protected applyConfig(): void {
    const validators = [];

    // Add required validator if needed
    if (this.fileUploadRequired()) {
      validators.push(Validators.required);
    }

    const fieldConfig: CrudItemOptions = {
      key: "testFileUpload",
      controlType: CONTROL_TYPES.FILES,
      label: this.fileUploadLabel(),
      controlOptions: {
        disabled: this.fileUploadDisabled(),
        hidden: this.fileUploadHidden(),
        validators: validators.length > 0 ? validators : undefined,
        helpText: this.fileUploadHelpText(),
        tooltipLabel: this.fileUploadTooltipLabel(),
        label: this.fileUploadControlLabel(),
        multiple: this.fileUploadMultiple(),
        isPreviewEnabled: this.fileUploadIsPreviewEnabled(),
        mediaType: this.fileUploadMediaType(),
        maxFileSize: this.fileUploadMaxFileSize(),
      },
    };

    this.config.set([fieldConfig]);
    // Force reload to ensure the form updates
    this.forceReload.set(this.forceReload() + 1);
  }
}
