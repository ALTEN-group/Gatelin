import { environment } from "environments/environment";
import { MonoTypeOperatorFunction, tap } from "rxjs";

export function debug<T>(description = "debug"): MonoTypeOperatorFunction<T> {
  if (environment.production) {
    return tap();
  }
  return tap((val) => console.log(description, val));
}
