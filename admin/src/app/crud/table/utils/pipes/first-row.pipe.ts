import { Pipe, PipeTransform } from "@angular/core";
import { Table } from "primeng/table";

@Pipe({
  name: "firstRow",
})
export class FirstRowPipe implements PipeTransform {
  transform(dataTable: Table | undefined, _cdrTrigger?: number): number {
    if (!dataTable) {
      return 0;
    }
    const { first } = dataTable;
    return (first ?? 0) + 1;
  }
}
