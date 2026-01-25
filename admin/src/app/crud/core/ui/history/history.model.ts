export type HistorizedData<T> = {
  who: string;
  tstamp: number;
  old_val: T;
};

export interface FullHistoryRow<T> extends HistorizedData<T> {
  id: number;
  changes: {
    oldValue: unknown;
    newValue: unknown;
    propKey: keyof T;
    label: string;
    hasChanged: boolean;
  }[];
}
