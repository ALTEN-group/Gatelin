export type HistorizedData<T> = {
  tstamp: string;
  table_name: string;
  operation: string;
  consumerId: number;
  consumerName: string;
  val: T;
};

export interface FullHistoryRow<T> extends HistorizedData<T> {
  id: string;
  changes: {
    oldValue: unknown;
    newValue: unknown;
    propKey: keyof T;
    label: string;
    hasChanged: boolean;
  }[];
}
