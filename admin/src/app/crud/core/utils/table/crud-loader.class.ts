import { computed, inject, signal } from "@angular/core";
import { CrudItemBase } from "@crud/core/models/crud-item-base.class";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { Calls, Repository } from "@crud/core/utils/crud-service/crud.model";
import { Rows, RowsAndCount } from "@crud/core/utils/crud-service/dto.model";
import { NO_ROWS_AND_COUNT } from "@crud/core/utils/crud-service/no-rows";
import { TableLoadingService } from "@crud/core/utils/loading/table-loading.service";
import { hasCacheable } from "@crud/core/utils/offline/cacheable.utils";
import { TableStateService } from "@crud/core/utils/table/table-state.service";
import { FileInfo } from "@form/ui/renderers/file-upload-input/file-info.class";
import { TableLazyLoadEvent } from "primeng/table";
import { catchError, delay, map, Observable, of, tap, throwError } from "rxjs";

type LocalUpdatePayload =
  | { value: CrudItemBase; feature: "update" }
  | { value: CrudItemBase; feature: "create" }
  | { value: number[]; feature: "archive" }
  | { value: number[]; feature: "restore" };

export class CrudFeatures {
  create = false;
  update = false;
  archive = false;
  history = false;
  updateFiles = false;
  restore = false;
}

// TODO: rename to CrudTableLoader // rename file accordingly
export class CrudLoader<TData extends CrudItemBase> {
  private readonly loadingService = inject(TableLoadingService);
  private readonly state = inject(TableStateService);

  private readonly _features = signal<CrudFeatures>(new CrudFeatures());
  public readonly features = this._features.asReadonly();

  private readonly params = computed(() => this.state.state().currentParams);

  private httpCalls!: Calls<TData>;

  private readonly _forceCloseEdition = signal<number | null>(null);
  public readonly forceCloseEdition = this._forceCloseEdition.asReadonly();

  private readonly _config = signal<CrudItemOptions[]>([]);

  get getCall() {
    return this.httpCalls.get ?? (() => of(NO_ROWS_AND_COUNT));
  }

  public set(httpCalls: Calls<TData>) {
    this.httpCalls = httpCalls;
  }

  public storeConfig(config: CrudItemOptions[]) {
    this._config.set(config);
  }

  public enableFeatures() {
    const features = new CrudFeatures();
    for (const feature in this.httpCalls) {
      features[feature as keyof CrudFeatures] =
        !!this.httpCalls[feature as keyof Repository<TData>];
    }
    this._features.set(features);
  }

  public load(
    event:
      | { params?: TableLazyLoadEvent; partial: "false" }
      | { partial: "true"; params: Partial<TableLazyLoadEvent> } = {
      partial: "false",
    },
  ) {
    let params: TableLazyLoadEvent | undefined;
    if (event.partial === "false") {
      params = event.params ?? this.params();
    } else {
      params = { ...this.params(), ...event.params };
    }
    this.state.setParams(params);
    this.get().subscribe();
  }

  public create(args: TData): Observable<Rows<TData> | null> {
    if (!this.httpCalls.create) {
      return of(null);
    }
    this.loadingService.start();
    return this.httpCalls.create(args).pipe(
      tap(() => this.loadingService.stop()),
      this.handleLocalData({
        value: { ...args, id: Date.now() },
        feature: "create",
      }),
      catchError((err) => {
        this.loadingService.stop();
        return throwError(() => err);
      }),
    );
  }

  public update(args: TData): Observable<Rows<TData> | null> {
    if (!this.httpCalls.update) {
      return of(null);
    }
    this.loadingService.start();
    return this.httpCalls.update(args).pipe(
      tap(() => this.loadingService.stop()),
      this.handleLocalData({ value: args, feature: "update" }),
      catchError((err) => {
        this.loadingService.stop();
        return throwError(() => err);
      }),
    );
  }

  public archive(args: number[]): Observable<null> {
    if (!this.httpCalls.archive) {
      return of(null);
    }

    this.loadingService.start();
    return this.httpCalls.archive(args).pipe(
      tap(() => this.loadingService.stop()),
      this.handleLocalData({ value: args, feature: "archive" }),
      catchError((err) => {
        this.loadingService.stop();
        return throwError(() => err);
      }),
    );
  }

  public restore(args: number[]): Observable<null> {
    if (!this.httpCalls.restore) {
      return of();
    }
    this.loadingService.start();
    return this.httpCalls.restore(args).pipe(
      tap(() => this.loadingService.stop()),
      this.handleLocalData({ value: args, feature: "restore" }),
      catchError((err) => {
        this.loadingService.stop();
        return throwError(() => err);
      }),
    );
  }

  public get(): Observable<RowsAndCount<TData>> {
    let params = this.params();
    if (!params) {
      params = {};
    }
    this.loadingService.start();
    if (!this.getCall) {
      this.loadingService.stop();
      return of(NO_ROWS_AND_COUNT);
    }
    return this.getCall(params).pipe(
      delay(0),
      map((res) => {
        // Special treatment when an item has 'filesResolver' property
        const itemsWithFileResolver = this._config().filter(
          (c) => c.filesPathResolver && c.controlType === "files",
        );
        if (itemsWithFileResolver.length) {
          return this.assignFilePaths(res, itemsWithFileResolver);
        }
        // Otherwise return as is
        return res;
      }),
      tap((res) => {
        this.state.setData(res);
        this.loadingService.stop();
      }),
      catchError(() => {
        this.loadingService.stop();
        return of(NO_ROWS_AND_COUNT);
      }),
    );
  }

  private assignFilePaths(
    initialRes: RowsAndCount<TData>,
    itemsWithFileResolver: CrudItemOptions[],
  ): RowsAndCount<TData> {
    return {
      total: initialRes.total,
      rows: initialRes.rows.map((row) => {
        const newRow = { ...row };
        for (const item of itemsWithFileResolver) {
          const filesInfo = item.filesPathResolver?.(row);
          // Must not override existing value if already provided by backend
          const hasProperty = Object.hasOwn(newRow, item.key);
          const hasValue = hasProperty && !!newRow[item.key as keyof TData];
          if (filesInfo && !hasValue) {
            (newRow[item.key as keyof TData] as FileInfo[]) = filesInfo;
          }
        }
        return newRow;
      }),
    };
  }

  public updateFiles(files: File[], id: number | null) {
    const updateFiles = this.httpCalls.updateFiles;
    const canUpdateFiles =
      id && this.features().updateFiles && updateFiles && files?.length;
    if (canUpdateFiles) {
      return updateFiles(files, id);
    }
    return of(true);
  }

  public updateLocalRows(payload: LocalUpdatePayload): void {
    let rows = this.state.state().data;
    let total = this.state.state().total;
    const { value, feature } = payload;
    switch (feature) {
      case "update": {
        rows = rows.map((r) => {
          if (r.id === value.id) {
            return value;
          }
          return r;
        });
        break;
      }
      case "create": {
        rows = [value, ...rows];
        total = total + 1;
        break;
      }
      case "archive": {
        rows = rows.filter((r) => {
          const isFound = value.some((val) => val === r.id);
          if (isFound) {
            total = total - 1;
          }
          return !isFound;
        });
        break;
      }
      case "restore": {
        rows = rows.map((r) => {
          const isFound = value.some((val) => val === r.id);
          if (isFound) {
            total = total + 1;
            return { ...r, archived: false };
          }
          return r;
        });
        break;
      }
    }
    this.state.setData({ rows, total });
  }

  private handleLocalData<T>(payload: LocalUpdatePayload) {
    return (source: Observable<T>): Observable<T | null> => {
      return source.pipe(
        tap(() => {
          this.updateLocalRows(payload);
        }),
        catchError((err) => {
          const isOfflineError = err.status === 0;
          const isCacheable = hasCacheable(err);
          if (isOfflineError && isCacheable) {
            this.updateLocalRows(payload);
            this._forceCloseEdition.set(Date.now());
          }
          return throwError(() => err);
        }),
      );
    };
  }
}
