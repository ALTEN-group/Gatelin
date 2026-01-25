import { inject, Injectable } from "@angular/core";
import { APP_CONFIG } from "@core/app-config/app-config.token";
import { LocalStorageService } from "@core/utils/local-storage/local-storage.service";

@Injectable({
  providedIn: "root",
})
export class TokenService {
  private readonly localStorageService = inject(LocalStorageService);

  private readonly keys = inject(APP_CONFIG).storageKeys;
  private readonly accessTokenKey = this.keys.TOKEN;
  private readonly refreshTokenKey = this.keys.REFRESH_TOKEN;

  public saveAccessToken(accessToken: string): void {
    this.localStorageService.setItem(this.accessTokenKey, accessToken);
  }

  public getAccessToken(): string | null {
    return this.localStorageService.getItem(this.accessTokenKey);
  }

  public deleteAccessToken(): void {
    this.localStorageService.removeItem(this.accessTokenKey);
  }

  public getRefreshToken(): string | null {
    return this.localStorageService.getItem(this.refreshTokenKey);
  }

  public saveRefreshToken(refreshToken: string): void {
    this.localStorageService.setItem(this.refreshTokenKey, refreshToken);
  }

  public deleteRefreshToken(): void {
    this.localStorageService.removeItem(this.refreshTokenKey);
  }
}
