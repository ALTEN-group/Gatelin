import { ExcelParams } from "@crud/core/models/excel.model";
import { HistorizedData } from "@crud/core/ui/history/history.model";
import { Rows, RowsAndCount } from "@crud/core/utils/crud-service/dto.model";
import { TableLazyLoadEvent } from "primeng/table";
import { Observable } from "rxjs";

type CrudGetParams = TableLazyLoadEvent & {
  excel?: ExcelParams;
};

export interface Repository<T> {
  get: (e: CrudGetParams) => Observable<RowsAndCount<T>>;
  getById: (id: number) => Observable<RowsAndCount<T>>;
  getAll: () => Observable<RowsAndCount<T>>;
  create: (args: T) => Observable<Rows<T>>;
  update: (args: T) => Observable<Rows<T>>;
  archive: (args: number[]) => Observable<null>;
  updateFiles: (files: File[], id: number) => Observable<Rows<T>>;
  restore: (args: number[]) => Observable<void>;
  getHistory: (id: number) => Observable<RowsAndCount<HistorizedData<T>>>;
}

export type Calls<T> = Partial<Repository<T>>;

export interface FileOperationConfig<T> {
  filePropertyKey?: string;
  apiSuffix?: string;
  serializer?: (item: T) => FormData;
}

export interface CrudRepositoryConfig<T = any> {
  endpoint: string;
  fileOperationsConfig?: FileOperationConfig<T>;
}
