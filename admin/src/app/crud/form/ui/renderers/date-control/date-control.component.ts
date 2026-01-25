import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DATE_FORMAT_CALENDAR } from "@crud/core/utils/dates/dates.utils";
import { isArray } from "@dwtechs/checkard";
import { FormFieldBaseComponent } from "@form/ui/renderers/form-field-base.component";
import { SharedModule } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { DividerModule } from "primeng/divider";

@Component({
  selector: "frm-date-control",
  templateUrl: "./date-control.component.html",
  styleUrls: ["./date-control.component.scss"],
  encapsulation: ViewEncapsulation.None,
  imports: [
    DatePickerModule,
    FormsModule,
    SharedModule,
    DividerModule,
    ButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateControlComponent extends FormFieldBaseComponent {
  readonly setDateEffect = effect(() => {
    const _trigger = this.syncValueInc(); // trigger effect on syncValueInc change
    const value = this.control().value;
    this.computeDateValue(value);
    this.manualDateSet(this.dateValue);
  });

  public readonly dateSelectionMode = computed(
    () => this.options().dateSelectionMode || "single",
  );

  public readonly dateShowTime = computed(
    () =>
      this.options().dateShowTime === true &&
      this.dateSelectionMode() === "single",
  );

  public readonly dateFormat = computed(() => {
    const customFormat = this.options().dateFormat;
    if (customFormat) {
      return customFormat;
    }
    if (this.options().dateViewMode === "month") {
      return "mm/yy";
    }
    if (this.options().dateViewMode === "year") {
      return "yy";
    }
    return DATE_FORMAT_CALENDAR;
  });

  public readonly dateOverlayWidth = computed(() => {
    // custom width
    if (this.options().dateOverlayWidth) {
      return this.options().dateOverlayWidth;
    }
    // default
    return this.options().dateTimeOnly ? "200px" : "500px";
  });

  public dateValue: Date | Date[] | "" | ""[] = "";

  public onDateTyped(event: Event) {
    if (this.options().dateSelectionMode === "range") {
      return;
    }
    const value = (event.target as HTMLInputElement).value;
    const validDateLength = 10;
    if (value.length !== validDateLength) {
      this.manualDateSet(null);
    } else {
      this.manualDateSet(new Date(value));
    }
  }

  public selectToday() {
    const today = new Date();
    this.computeDateValue(today);
    this.onDateSelected();
  }

  public onDateSelected() {
    this.manualDateSet(this.dateValue);
    this.emitInteractionEvent("valueChange");
    this.control().markAsTouched();
    this.control().markAsDirty();
  }

  public onDateCleared() {
    this.manualDateSet(null);
    this.emitInteractionEvent("clear");
    this.control().markAsTouched();
    this.control().markAsDirty();
  }

  private manualDateSet(value: Date | Date[] | "" | ""[] | null) {
    const newValue = this.getTimeFromControl(value);
    this.control().setValue(newValue);
  }

  private getTimeFromControl(value: Date | Date[] | "" | ""[] | null) {
    if (!value) {
      return null;
    }
    if (value instanceof Date) {
      return value.getTime();
    }
    return value.map((v) => (v ? new Date(v).getTime() : null));
  }

  private computeDateValue(value: unknown) {
    switch (this.dateSelectionMode()) {
      case "single": {
        if (isArray(value)) {
          this.dateValue = value.length ? new Date(value[0] as string) : "";
        } else {
          this.dateValue = value ? new Date(value as string) : "";
        }
        break;
      }
      // Multiple and range modes both use array of dates
      default: {
        if (isArray(value)) {
          const dates = value as Date[];
          this.dateValue = dates.map((v) => new Date(v));
        } else {
          this.dateValue = value ? [new Date(value as string)] : [];
        }
      }
    }
  }
}
