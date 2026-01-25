import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  viewChild,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormFieldBaseComponent } from "@form/ui/renderers/form-field-base.component";
import { SelectItem } from "primeng/api";
import { AutoComplete, AutoCompleteModule } from "primeng/autocomplete";
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from "rxjs";

const newOption = (query: string) => [
  {
    value: query,
    label: query,
    extraData: {
      customLabelDisplay: {
        mainLabel: query,
        subLabel: $localize`:@@Shared_NewAutocompleteOption:(nouveau)`,
      },
    },
  },
];

@Component({
  selector: "frm-autocomplete-control",
  templateUrl: "./autocomplete-control.component.html",
  imports: [AutoCompleteModule, ReactiveFormsModule, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteControlComponent extends FormFieldBaseComponent {
  private readonly autocomplete = viewChild(AutoComplete);

  public readonly isCompleteOnFocusDisabled = computed(
    () => this.options().isCompleteOnFocusDisabled ?? false,
  );

  private readonly isOptionCreationEnabled = computed(
    () => this.options().isOptionCreationEnabled ?? false,
  );

  private readonly autocompleteQuery$: BehaviorSubject<string> =
    new BehaviorSubject("");

  public readonly autocompleteSuggestions$: Observable<SelectItem[]> =
    this.autocompleteQuery$.pipe(
      switchMap((query) => {
        const searchFunction = this.options()?.searchOptionsFn;
        if (!searchFunction) {
          const filteredOptions = (this.selectOptions() ?? []).filter((opt) =>
            opt.label?.toLowerCase().includes(query.toLowerCase()),
          );
          return of(filteredOptions);
        }
        return searchFunction(query).pipe(catchError(() => of([])));
      }),
      map((options) => {
        const query = this.autocompleteQuery$.getValue();
        if (this.isOptionCreationEnabled() && !options.length && query.trim()) {
          return newOption(query);
        }
        return this.getActiveSuggestionsOnly(options);
      }),
      tap((suggestions) => {
        this.writeAsyncValue(suggestions);
      }),
    );

  /**
   * Updates the autocomplete input with the label of the currently selected option
   * when there are no base select options and asynchronous suggestions are available.
   *
   * @param suggestions - An array of `SelectItem` objects representing asynchronous suggestions.
   *
   * The method checks if there are no base select options and if there are asynchronous suggestions.
   * If so, it finds the suggestion matching the current control value and writes its label
   * to the autocomplete input, ensuring the displayed value matches the selected option.
   */
  private writeAsyncValue(suggestions: SelectItem[]): void {
    const hasNoBaseSelectOptions = !this.selectOptions()?.length;
    const hasAsyncSuggestions = suggestions.length > 0;
    if (hasNoBaseSelectOptions && hasAsyncSuggestions) {
      const selectedOption = suggestions.find(
        (option) => option.value === this.control().value,
      );
      const autocomplete = this.autocomplete();
      if (selectedOption && autocomplete) {
        autocomplete.writeValue(selectedOption.label);
      }
    }
  }

  private getActiveSuggestionsOnly(options: SelectItem[]): SelectItem[] {
    const selectedValue = this.control().value;
    const selectedOption = options.find(
      (option) => option.value === selectedValue,
    );
    const activeSuggestions = options.filter((option) => !option.disabled);
    if (selectedOption?.disabled) {
      activeSuggestions.unshift(selectedOption);
    }
    return activeSuggestions;
  }

  public handleOnAutocomplete(event: string): void {
    this.autocompleteQuery$.next(event);
  }
}
