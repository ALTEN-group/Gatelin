import { HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { isArray } from "@dwtechs/checkard";
import { Rows, TableConfig } from "@dwtechs/ngx-crud-builder";
import { map } from "rxjs";

export const preferencesInterceptor: HttpInterceptorFn = (req, next) => {
  const isPreferenceRequest =
    req.method === "GET" && /\/preferences\//.test(req.url);

  return next(req).pipe(
    map((event) => {
      if (!isPreferenceRequest || !(event instanceof HttpResponse)) {
        return event;
      }

      const body: Rows<TableConfig> = event.body as Rows<TableConfig>;
      const rows = body?.rows;
      if (!isArray(rows)) {
        return event;
      }

      if (rows.some((row) => row.isActive === true)) {
        return event;
      }

      const defaultPreference = rows.find((row) => row.name === "Default");
      if (defaultPreference) {
        defaultPreference.isActive = true;
      }

      return event.clone({ body: { rows } });
    }),
  );
};
