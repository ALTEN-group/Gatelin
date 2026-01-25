export interface Adapter<T> {
  adapt(item: any): T;
  adaptMany(items: any[]): T[];
  convert(item: T): any;
  convertMany(items: T[]): any[];
}
