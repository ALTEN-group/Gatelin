import { Pipe, PipeTransform } from "@angular/core";
import { Table } from "primeng/table";

@Pipe({
  name: "lastRow",
})
export class LastRowPipe implements PipeTransform {
  transform(
    dataTable: Table | undefined,
    total: string | number,
    _cdrTrigger?: number,
  ): number {
    if (!dataTable) {
      return 0;
    }
    const { first, rows } = dataTable;
    if (!rows) {
      return 0;
    }
    return Math.min((first ?? 0) + rows, Number(total));
  }
}
