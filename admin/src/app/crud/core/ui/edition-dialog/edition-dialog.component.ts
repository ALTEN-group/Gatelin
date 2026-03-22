import { AsyncPipe } from "@angular/common";
import {
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { ValidatorFn } from "@angular/forms";
import { ProtectFeatureDirective } from "@core/acl/protect-feature.directive";
import { ProtectFeaturePipe } from "@core/acl/protect-feature.pipe";
import { CrudItemBase } from "@crud/core/models/crud-item-base.class";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { CrudButtonComponent } from "@crud/core/ui/crud-buttons/crud-buttons.component";
import { HistoryComponent } from "@crud/core/ui/history/history.component";
import { HistorizedData } from "@crud/core/ui/history/history.model";
import { NO_ROWS_AND_COUNT } from "@crud/core/utils/crud-service/no-rows";
import { CrudFeatures } from "@crud/core/utils/table/crud-loader.class";
import { FormComponent } from "@crud/form/form/form.component";
import { AccordionModule } from "primeng/accordion";
import { SharedModule } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { DialogModule } from "primeng/dialog";
import { distinctUntilChanged, filter, Observable, of, switchMap } from "rxjs";

@Component({
  selector: "crd-edition-dialog",
  templateUrl: "./edition-dialog.component.html",
  styleUrls: ["./edition-dialog.component.scss"],
  imports: [
    DialogModule,
    SharedModule,
    FormComponent,
    AccordionModule,
    HistoryComponent,
    CheckboxModule,
    ButtonModule,
    ProtectFeatureDirective,
    AsyncPipe,
    ProtectFeaturePipe,
    CrudButtonComponent,
  ],
})
export class EditionDialogComponent<TData extends CrudItemBase> {
  // Inputs
  /** Configuration array that defines the structure and behavior of form fields */
  public readonly config = input<CrudItemOptions[]>([]);

  /** CRUD features configuration that defines available operations */
  public readonly features = input<CrudFeatures>({} as CrudFeatures);

  /** Unique identifier for functionality access control */
  public readonly functionalityKey = input<string>();

  /** Function to retrieve history data for an entry by ID */
  public readonly getHistory =
    input<
      (id: number) => Observable<{
        rows: HistorizedData<TData>[];
        total: number;
      }>
    >();

  /** Custom validator applied to the entire form group */
  public readonly groupValidator = input<ValidatorFn>();

  /** Dialog header title text */
  public readonly customHeader = input("");

  /** Displayed entity label */
  public readonly entityLabel = input("");

  /** Dialog height (CSS value) */
  public readonly height = input<string | undefined>();

  /** Whether the dialog is in creation mode (vs edit mode) */
  public readonly isCreation = input(false);

  /** Whether the dialog is in readonly mode */
  public readonly isReadonly = input(false);

  /** Controls dialog visibility state */
  public readonly isVisible = model(false);

  /** Whether deletion action requires additional protection */
  public readonly protectDeletion = input(false);

  /** Dialog width (CSS value) */
  public readonly width = input<string | undefined>(undefined);

  /**
   * Optional option to configure the default size of the dialog
   * @param "xs" | "s" | "m" | "l"
   * @default "s"
   * */
  public readonly size = input<"xs" | "s" | "m" | "l">("s");

  /** Is something loading */
  public readonly isLoading = input(false);

  // Model inputs
  /** The data object being edited (two-way binding) */
  public readonly editedEntry = model.required<TData>();

  // Outputs
  /** Emitted when entry is archived/deleted */
  public readonly archived = output<TData | null>();

  /** Emitted when entry is restored */
  public readonly restored = output<TData | null>();

  /** Emitted when entry is edited (value changes) */
  public readonly edited = output<TData | null>();

  /** Emitted when form values change */
  public readonly formChanged = output<TData>();

  /** Emitted when dialog should be hidden */
  public readonly hide = output();

  /** Emitted when entry is saved */
  public readonly saved = output<TData | null>();

  /** Emitted when form validation state changes */
  public readonly validityChanged = output<boolean>();

  // Public properties
  /** Whether the form is currently invalid */
  public invalidForm = true;

  /** Timestamp to force form reload */
  public forceReloadTime = signal(0);

  // Computed
  /** ID of the currently edited entry */
  private readonly editedEntryId = computed(() => this.editedEntry()?.id);

  /** Calculated width of the dialog based on size or fixed width */
  public readonly calculatedWidth = computed(() => {
    const size = this.size();
    const fixedWidth = this.width();
    if (fixedWidth) {
      return fixedWidth;
    }
    switch (size) {
      case "xs":
        return "400px";
      case "s":
        return "50vw";
      case "m":
        return "70vw";
      case "l":
        return "90vw";
      default:
        return "50vw";
    }
  });

  public readonly formColumnsCount = computed(() => {
    const size = this.size();
    switch (size) {
      case "xs":
        return 1;
      case "s":
        return 2;
      case "m":
        return 3;
      case "l":
        return 4;
      default:
        return 1;
    }
  });

  /** Dialog header label */
  public readonly dialogTitle = computed(() => {
    if (this.customHeader()) {
      return this.customHeader();
    }
    let action: string;
    if (this.isCreation()) {
      action = $localize`:@@EditionDialog_Creation:Création`;
    } else if (this.isReadonly()) {
      action = $localize`:@@EditionDialog_Consultation:Consultation`;
    } else {
      action = $localize`:@@EditionDialog_Edition:Édition`;
    }
    return `${action} - ${this.entityLabel()}`;
  });

  /** Observable stream of history data for the current entry */
  public readonly history$ = toObservable(this.editedEntryId).pipe(
    distinctUntilChanged(),
    filter((id): id is number => !!id),
    switchMap((id) => {
      const getHistory = this.getHistory();
      if (this.features().getHistory && getHistory) {
        return getHistory(id);
      }
      return of(NO_ROWS_AND_COUNT);
    }),
  );

  /** Whether the save button should be displayed based on form state and permissions */
  public readonly canInteract = computed(() => {
    const isCreation = this.isCreation();
    const isUpdateEnabled = this.features().update;
    const isFormReadonly = this.config().every(
      (ctrl) => ctrl.controlOptions?.disabled || ctrl.controlOptions?.hidden,
    );
    return isCreation || (isUpdateEnabled && !isFormReadonly);
  });

  public readonly closeButtonLabel = computed(() => {
    return this.canInteract()
      ? $localize`:@@EditionDialog_CloseButtonCancel:Annuler`
      : $localize`:@@EditionDialog_CloseButtonClose:Fermer`;
  });

  private readonly canArchiveRestore = computed(() => {
    if (!this.canInteract()) return false;
    if (this.isCreation()) return false;
    return true;
  });

  public readonly isArchiveBtnDisplayed = computed(() => {
    return (
      this.features().archive &&
      this.canArchiveRestore() &&
      !this.editedEntry()?.archived
    );
  });

  public readonly isRestoreBtnDisplayed = computed(() => {
    return (
      this.features().restore &&
      this.canArchiveRestore() &&
      this.editedEntry()?.archived
    );
  });

  // Public methods
  /**
   * Handles form value changes and updates the edited entry
   * @param value - The new form values
   */
  public onFormChanged(value: TData): void {
    this.editedEntry.set(value);

    // if (this.canOnlyCloseEditionModal()) {
    //   this.edited.emit(this.editedEntry());
    // }
  }

  /**
   * Handles form validation state changes
   * @param valid - Whether the form is currently valid
   */
  public onValidityChange(valid: boolean): void {
    this.invalidForm = !valid;
  }

  /**
   * Handles selection of a history entry to restore
   * @param entry - The history entry to restore
   */
  public onHistorySelect(entry: HistorizedData<TData>) {
    this.editedEntry.set(entry.old_val);
    this.invalidForm = false;
    this.forceReloadTime.set(Date.now());
  }

  /**
   * Handles save action and emits the current entry
   */
  public onSave(): void {
    this.saved.emit(this.editedEntry());
  }

  /**
   * Handles dialog hide action
   */
  public onHide(): void {
    this.hide.emit();
  }

  /**
   * Handles delete/archive action and emits the current entry
   */
  public onArchive() {
    this.archived.emit(this.editedEntry());
  }

  public onRestore() {
    this.restored.emit(this.editedEntry());
  }
}
