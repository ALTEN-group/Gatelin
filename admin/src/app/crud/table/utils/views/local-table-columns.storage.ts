import { Injectable, inject } from "@angular/core";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { LocalStorageService } from "@core/utils/local-storage/local-storage.service";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { TableColumn } from "@crud/core/utils/table/table-column.model";
import { ColumnConfig } from "@table/data-access/table-config.model";

type TablesConfigs = Record<string, ColumnConfig[]>;

@Injectable({ providedIn: "root" })
export class LocalTableColumnsStorage {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly tablesStorageKey =
    inject(APP_CONFIG).storageKeys.TABLE_CONFIG;

  private _configs: TablesConfigs = {};

  get configs() {
    return this._configs ?? {};
  }

  constructor() {
    this.init();
  }

  public set(tableKey: string, columns: TableColumn[]): void {
    const tableConfig = columns
      .filter((col) => !col.isHardHidden)
      .map((col) => ({
        key: col.key,
        isVisible: col.isVisible,
      }));
    this._configs[tableKey] = tableConfig;
    this.localStorageService.setItem(
      this.tablesStorageKey,
      JSON.stringify(this._configs),
    );
  }

  public getColumns(
    tableKey: string,
    baseConfig: CrudItemOptions[],
  ): ColumnConfig[] {
    return this.configs[tableKey] ?? baseConfig ?? [];
  }

  private init() {
    const config = this.localStorageService.getItem(this.tablesStorageKey);
    if (config) {
      this._configs = JSON.parse(config);
    }
  }
}
