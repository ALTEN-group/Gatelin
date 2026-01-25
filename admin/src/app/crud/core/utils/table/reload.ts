import { WritableSignal } from "@angular/core";
import { MonoTypeOperatorFunction, tap } from "rxjs";

export function reload<T>(
  forceReloadTime: WritableSignal<number>,
): MonoTypeOperatorFunction<T> {
  return tap(() => forceReloadTime.set(Date.now()));
}
