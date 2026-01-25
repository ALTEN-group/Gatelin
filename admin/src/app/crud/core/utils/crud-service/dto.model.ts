/**
 * Represents a collection of rows from a query
 */
export interface Rows<T> {
  rows: T[];
  errorCode?: number;
}

/**
 * Represents a collection of rows with total count for pagination
 */
export interface RowsAndCount<T> extends Rows<T> {
  total: number;
}
