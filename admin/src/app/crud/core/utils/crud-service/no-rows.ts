import { Rows, RowsAndCount } from "@crud/core/utils/crud-service/dto.model";

export const NO_ROWS_AND_COUNT: RowsAndCount<any> = {
  rows: [],
  total: 0,
};

export const NO_ROWS: Rows<any> = {
  rows: [],
};
