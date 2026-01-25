import { Component, ViewEncapsulation } from "@angular/core";
import { AutocompleteInputTabComponent } from "@crud/core/demo/ui/autocomplete-input-tab.component";
import { FileUploadTabComponent } from "@crud/core/demo/ui/file-upload-tab.component";
import { MultiSelectInputTabComponent } from "@crud/core/demo/ui/multi-select-input-tab.component";
import { PicklistInputTabComponent } from "@crud/core/demo/ui/picklist-input-tab.component";
import { RadioGroupInputTabComponent } from "@crud/core/demo/ui/radiogroup-input-tab.component";
import { RichTextEditorTabComponent } from "@crud/core/demo/ui/rich-text-editor-tab.component";
import { SelectButtonInputTabComponent } from "@crud/core/demo/ui/select-button-input-tab.component";
import { SelectInputTabComponent } from "@crud/core/demo/ui/select-input-tab.component";
import { TableControlTabComponent } from "@crud/core/demo/ui/table-control-tab.component";
import { TextareaInputTabComponent } from "@crud/core/demo/ui/textarea-input-tab.component";
import { TabsModule } from "primeng/tabs";
import { CheckboxInputTabComponent } from "./ui/checkbox-input-tab.component";
import { DateInputTabComponent } from "./ui/date-input-tab.component";
import { FormGeneralTabComponent } from "./ui/form-general-tab.component";
import { InputTextTabComponent } from "./ui/input-text-tab.component";
import { NumberInputTabComponent } from "./ui/number-input-tab.component";

/**
 * Main demo component that orchestrates all form demonstration tabs
 * Provides a clean interface to test different form configurations and field types
 */
@Component({
  selector: "frm-demo",
  imports: [
    TabsModule,
    FormGeneralTabComponent,
    InputTextTabComponent,
    NumberInputTabComponent,
    CheckboxInputTabComponent,
    DateInputTabComponent,
    AutocompleteInputTabComponent,
    FileUploadTabComponent,
    MultiSelectInputTabComponent,
    SelectInputTabComponent,
    PicklistInputTabComponent,
    RadioGroupInputTabComponent,
    SelectButtonInputTabComponent,
    TextareaInputTabComponent,
    RichTextEditorTabComponent,
    TableControlTabComponent,
  ],
  styleUrls: ["./form-demo.scss"],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="form-demo-container">
      <p-tabs value="0">
        <p-tablist>
          <p-tab value="0">Form</p-tab>
          <p-tab value="1">Text input</p-tab>
          <p-tab value="2">Number input</p-tab>
          <p-tab value="3">Checkbox</p-tab>
          <p-tab value="4">Date</p-tab>
          <p-tab value="5">Autocomplete</p-tab>
          <p-tab value="6">File Upload</p-tab>
          <p-tab value="7">Multi-Select</p-tab>
          <p-tab value="8">Select</p-tab>
          <p-tab value="9">Picklist</p-tab>
          <p-tab value="10">Radio Group</p-tab>
          <p-tab value="11">Select Button</p-tab>
          <p-tab value="12">Textarea</p-tab>
          <p-tab value="13">Rich Text Editor</p-tab>
          <p-tab value="14">Table Control</p-tab>
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel value="0">
            <frm-form-general-tab />
          </p-tabpanel>
          
          <p-tabpanel value="1">
            <frm-input-text-tab />
          </p-tabpanel>

          <p-tabpanel value="2">
            <frm-number-input-tab />
          </p-tabpanel>

          <p-tabpanel value="3">
            <frm-checkbox-input-tab />
          </p-tabpanel>

          <p-tabpanel value="4">
            <frm-date-input-tab />
          </p-tabpanel>

          <p-tabpanel value="5">
            <frm-autocomplete-input-tab />
          </p-tabpanel>

          <p-tabpanel value="6">
            <frm-file-upload-tab />
          </p-tabpanel>

          <p-tabpanel value="7">
            <frm-multi-select-input-tab />
          </p-tabpanel>

          <p-tabpanel value="8">
            <frm-select-input-tab />
          </p-tabpanel>
          
          <p-tabpanel value="9">
            <frm-picklist-input-tab />
          </p-tabpanel>

          <p-tabpanel value="10">
            <frm-radiogroup-input-tab />
          </p-tabpanel>
          
          <p-tabpanel value="11">
            <frm-select-button-input-tab />
          </p-tabpanel>

          <p-tabpanel value="12">
            <frm-textarea-input-tab />
          </p-tabpanel>

          <p-tabpanel value="13">
            <frm-rich-text-editor-tab />
          </p-tabpanel>

          <p-tabpanel value="14">
            <frm-table-control-tab />
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>
    </div>
  `,
})
export class FormDemo {}
