import { LoginComponent } from "app/login/features/login/login.component";
import { ResetPwdComponent } from "app/login/features/reset-pwd/reset-pwd.component";
import { SendPwdEmailComponent } from "app/login/features/send-pwd-email/send-pwd-email.component";
export const AUTH_ROUTES = [
    { path: "", component: LoginComponent },
    { path: "sendpwdemail", component: SendPwdEmailComponent },
    { path: "resetpassword/:userId", component: ResetPwdComponent },
];
//# sourceMappingURL=login.routes.js.map