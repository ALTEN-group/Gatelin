import { HttpRequest } from "@angular/common/http";

const CACHEABLE_KEY = "Is-Cacheable";
export const CACHEABLE_PROP = { [CACHEABLE_KEY]: "1" };

export const isCacheable = (req: HttpRequest<unknown>) =>
  req.headers.get(CACHEABLE_KEY) === CACHEABLE_PROP[CACHEABLE_KEY];

export const hasCacheable = (obj: Record<string, unknown>) =>
  Object.hasOwn(obj, CACHEABLE_KEY);

export const CACHEABLE_HEADER = {
  headers: CACHEABLE_PROP,
};
