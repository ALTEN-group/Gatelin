import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  public getItem(key: string) {
    return localStorage.getItem(key);
  }

  public setItem(key: string, data: string) {
    localStorage.setItem(key, data);
  }

  public removeItem(key: string) {
    localStorage.removeItem(key);
  }
}
