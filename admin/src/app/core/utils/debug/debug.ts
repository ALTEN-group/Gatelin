import { MonoTypeOperatorFunction, tap } from "rxjs";
import { environment } from "../../../../environments/environment";

export function debug<T>(description = "debug"): MonoTypeOperatorFunction<T> {
  if (environment.production) {
    return tap();
  }
  return tap((val) => console.log(description, val));
}
