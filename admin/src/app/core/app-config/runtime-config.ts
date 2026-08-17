/**
 * Runtime admin config injected into index.html by the Docker entrypoint (dev)
 * or by src/admin-server.js (prod). Lets ops set ADMIN_PASSWORD_RECOVERY_URL
 * without rebuilding Angular.
 */
export interface GatelinAdminRuntime {
  passwordRecoveryUrl?: string;
}

declare global {
  interface Window {
    __GATELIN_ADMIN__?: GatelinAdminRuntime;
  }
}

export function readAdminRuntimeConfig(): GatelinAdminRuntime {
  if (typeof window === "undefined") return {};
  const raw = window.__GATELIN_ADMIN__;
  return raw && typeof raw === "object" ? raw : {};
}
