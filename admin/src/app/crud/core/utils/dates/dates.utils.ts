import { formatDate as ngFormatDate } from "@angular/common";
import { isDate, isNumber, isString } from "@dwtechs/checkard";

export const DATE_FORMAT = "yyyy-MM-dd";
export const DATE_WITH_TIME_FORMAT = "yyyy-MM-dd HH:mm";
export const DATE_FORMAT_CALENDAR = "yy-mm-dd";

export const getMidnightTimeStamp = (
  value: Date | string | null,
): number | null => {
  let date = value;
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date ? date.setHours(0, 0, 0, 0) : null;
};

export const getDateRangeWithoutTime = (dateRange: [from: Date, to: Date]) => {
  const [from, to] = dateRange;
  const userTimezoneOffset = from.getTimezoneOffset() * 60000;
  const fromTimeStamp = getMidnightTimeStamp(from);
  let toTimeStamp = getMidnightTimeStamp(to);
  if (!fromTimeStamp) {
    return [];
  }
  // If no end is defined, set it to start date at 23:00:00
  if (!toTimeStamp) {
    const oneDay = 23 * 60 * 60 * 1000;
    toTimeStamp = fromTimeStamp + oneDay;
  }
  const start = new Date(fromTimeStamp - userTimezoneOffset);
  const end = toTimeStamp ? new Date(toTimeStamp - userTimezoneOffset) : null;
  return [start, end];
};

export const canBeDate = (d: unknown): d is Date | number | string => {
  if (isString(d) || isNumber(d)) {
    return true;
  }
  if (isDate(d)) {
    return !Number.isNaN(d.getTime());
  }
  return false;
};

export const isValidDateString = (value: unknown) => {
  if (!isString(value)) {
    return false;
  }
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return false;
  }
  return true;
};

export const formatDate = (
  value: string | number | Date,
  withTime = false,
): string => {
  const format = withTime ? DATE_WITH_TIME_FORMAT : DATE_FORMAT;
  return ngFormatDate(value, format, "fr-FR");
};

export const getDifferenceInDays = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffInTime = date2.setHours(0, 0, 0, 0) - date1.setHours(0, 0, 0, 0);
  return Math.round(diffInTime / oneDay);
};
