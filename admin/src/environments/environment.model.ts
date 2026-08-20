export interface Environment {
  production: boolean;
  gatelinApi: string;
  apiUsers: string;
  assets: string;
  msNotifEnabled: boolean;
  /**
   * Absolute or same-origin URL of the password-recovery workflow
   * (e.g. `/api/pwd/web/recover`). Empty/omitted → hide the login link.
   */
  passwordRecoveryUrl?: string;
}
