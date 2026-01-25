import { inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { crudItemToColumn } from "@crud/core/utils/table/crud-item-to-column";
import { TableColumn } from "@crud/core/utils/table/table-column.model";
import { ColumnResizeEvent } from "@crud/table/utils/views/table-config.model";
import {
  ColumnConfig,
  ExtendedTableConfig,
  TableConfig,
} from "@table/data-access/table-config.model";
import { TableConfigService } from "@table/data-access/table-config.service";
import { LocalTableColumnsStorage } from "@table/utils/views/local-table-columns.storage";
import {
  combineLatest,
  filter,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from "rxjs";

@Injectable()
export class TableColumnsStorage {
  private readonly preferencesService = inject(TableConfigService);
  private readonly localTableColumnsStorage = inject(LocalTableColumnsStorage);

  /**
   * When the service is init, we need to get the views
   * Then we need to compute the full column config for each view
   * Finally we need to know which view is the active view
   * Now we can expose "columns" to the table
   */

  private readonly baseCrudItems = signal<CrudItemOptions[]>([]);
  private readonly componentId = signal<string | null>(null);
  private readonly isViewSystemEnabled = signal<boolean>(true);

  private readonly views$: Observable<TableConfig[]> = combineLatest([
    toObservable(this.componentId),
    toObservable(this.baseCrudItems),
  ]).pipe(
    map(([componentId]) => componentId),
    filter((componentId): componentId is string => !!componentId),
    switchMap((componentId) => this.getMany(componentId)),
    takeUntilDestroyed(),
  );

  private readonly viewsWithColumns$: Observable<ExtendedTableConfig[]> =
    this.views$.pipe(
      map((views) => this.getViewsWithColumns(views)),
      tap((viewsWithColumns) => {
        this.viewsWithColumns.set(viewsWithColumns);
        const activeView =
          viewsWithColumns.find((view) => view.isActive) ??
          viewsWithColumns.find((view) => view.isDefault);
        this.activeColumns.set(activeView ? activeView.columns : []);
      }),
    );

  /**
   * Exposed signals
   */

  public readonly viewsWithColumns = signal<ExtendedTableConfig[] | null>(null);
  public readonly activeColumns = signal<TableColumn[]>([]);

  /**
   * Initialize the table views service
   * @param componentId {string} Component identifier to query and post stored configurations
   * @param baseCrudItems {CrudItemOptions[]} Base columns configuration from CRUD definition
   * @param isViewSystemEnabled {boolean} Whether the view system is enabled or not
   * This method must be called by the table component in order to initialize the columns
   */
  public init(
    componentId: string,
    baseCrudItems: CrudItemOptions[],
    isViewSystemEnabled: boolean,
  ) {
    this.componentId.set(componentId);
    this.baseCrudItems.set(baseCrudItems);
    this.isViewSystemEnabled.set(isViewSystemEnabled);

    this.viewsWithColumns$.subscribe();
  }

  /*** Backend communication ***/

  public updateMany(views: ExtendedTableConfig[]) {
    const componentId = this.componentId();
    if (!componentId) return of([]);
    const defaultView = views.find((view) => view.isDefault);
    if (!this.isViewSystemEnabled() && defaultView) {
      this.localTableColumnsStorage.set(componentId, defaultView.columns);
    }
    const userViews = views.filter((view) => !view.isDefault);
    return this.preferencesService
      .updateMany(componentId, userViews)
      .pipe(switchMap(() => this.viewsWithColumns$));
  }

  /** Called when a single column is resized */
  public updateOne(updatedColumn: ColumnResizeEvent) {
    const componentViews = this.viewsWithColumns()?.map((view) => {
      if (view.isActive) {
        const updatedConf: ColumnConfig[] = view.conf.map((col) =>
          col.key === updatedColumn.colKey
            ? { ...col, defaultWidth: `${updatedColumn.newWidthPx}px` }
            : col,
        );
        return { ...view, conf: updatedConf };
      }
      return view;
    });
    if (!componentViews) {
      return of([]);
    }
    return this.updateMany(componentViews);
  }

  private getMany(componentId: string): Observable<TableConfig[]> {
    if (!this.isViewSystemEnabled()) {
      return of([]);
    }
    return this.preferencesService.getViews(componentId);
  }

  /**
   * Full columns computation
   */
  private getViewsWithColumns(views: TableConfig[]): ExtendedTableConfig[] {
    const baseCrudItems = this.baseCrudItems();
    if (!baseCrudItems) {
      return [];
    }
    const componentId = this.componentId();
    if (!componentId) {
      return [];
    }
    // Retrieve local storage config if view system is disabled
    // Otherwise, the config will come from the view preferences
    // And the default view is built from the baseCrudItems
    const localConfig = this.isViewSystemEnabled()
      ? baseCrudItems
      : this.localTableColumnsStorage.getColumns(componentId, baseCrudItems);
    const defaultColumns = this.getOrderedColumns(baseCrudItems, localConfig);
    // Build user views
    const userViews: ExtendedTableConfig[] = views
      .toSorted((a, b) => a.name.localeCompare(b.name))
      .map((view) => {
        const userConf = view.conf ?? [];
        const isObsoleteConf = userConf.length !== baseCrudItems.length;
        const columns: TableColumn[] = isObsoleteConf
          ? baseCrudItems.map((item) => crudItemToColumn(item, userConf))
          : this.getOrderedColumns(baseCrudItems, userConf);
        return {
          ...view,
          columns,
        };
      });
    // Build default view
    const defaultView: ExtendedTableConfig = {
      ...new TableConfig(componentId),
      columns: defaultColumns,
      isDefault: true,
      isActive: !userViews.length,
    };
    return [defaultView, ...userViews];
  }

  private getOrderedColumns(
    baseColumns: CrudItemOptions[],
    userConfig: ColumnConfig[],
  ): TableColumn[] {
    return userConfig
      .map((col) => {
        const fullColumn = baseColumns.find(
          // biome-ignore lint/suspicious/noDoubleEquals: key may be number or string
          (colConfig) => colConfig.key == col.key,
        );
        if (!fullColumn) {
          return null;
        }
        return crudItemToColumn(fullColumn, userConfig);
      })
      .filter((col): col is TableColumn => col !== null);
  }
}
