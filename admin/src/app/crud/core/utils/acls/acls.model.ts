import { Calls } from "@crud/core/utils/crud-service/crud.model";

type RoutesMapping = {
  [key in keyof Calls<unknown>]: number;
};

export type AclsMapping = { [key: string]: RoutesMapping };

/** mapped type to have boolean instead of number in RoutesMapping */
export type Acls = {
  [key: string]: {
    [key in keyof RoutesMapping]: boolean;
  };
};
