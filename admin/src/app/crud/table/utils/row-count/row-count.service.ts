import { Injectable } from "@angular/core";

// WIP: could be used to dynamically set the number of rows in a table based on viewport height

const ROW_HEIGHT = 22; // Approximate height of a table row in pixels
const MIN_ROWS = 5; // Minimum number of rows to display
const MAX_ROWS = 30; // Maximum number of rows to display

const NAVBAR_HEIGHT = 36; // Approximate height of the navbar in pixels
const TOOLBAR_HEIGHT = 40; // Approximate height of the toolbar in pixels
const PAGINATOR_HEIGHT = 35; // Approximate height of the paginator in pixels
const HEADER_HEIGHT = 40; // Approximate height of the table header in pixels

@Injectable({ providedIn: "root" })
export class RowCountService {
  private availableHeight = this.getAvailableHeight();

  public getRowCount(): number {
    const possibleRows = Math.floor(this.availableHeight / ROW_HEIGHT);
    return Math.min(Math.max(possibleRows, MIN_ROWS), MAX_ROWS);
  }

  private getAvailableHeight(): number {
    const totalHeight = window.innerHeight;
    return (
      totalHeight -
      (NAVBAR_HEIGHT + TOOLBAR_HEIGHT + PAGINATOR_HEIGHT + HEADER_HEIGHT)
    );
  }
}
