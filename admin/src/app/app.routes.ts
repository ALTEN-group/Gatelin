import { Routes } from "@angular/router";
import { aclGuard } from "@core/acl/acl.guard";
import { loginGuard } from "@core/auth/login.guard";
import { NotFoundComponent } from "@core/pages/not-found/not-found.component";
import { rolesResolver } from "@core/roles/roles.resolver";
import { gatewayApplicationsResolver } from "app/admin/data-access/applications/applications.resolver";
import { methodsResolver } from "app/admin/data-access/methods/methods.resolver";
import { operationsResolver } from "app/admin/data-access/operations/operations.resolver";
import { resourcesResolver } from "app/admin/data-access/resources/resources.resolver";
import { gatewayRolesResolver } from "app/admin/data-access/roles/roles.resolver";
import { routesResolver } from "app/admin/data-access/routes/routes.resolver";
import { serviceResolver } from "app/admin/data-access/services/service.resolver";

/**
 * Application Paths
 */
export const AppPaths = {
  LOGIN: "login",
  ROUTES: "routes",
  CONSUMERS: "consumers",
  SERVICES: "services",
  RESOURCES: "resources",
  CORS: "cors",
  OPERATIONS: "operations",
  METHODS: "methods",
  FIELDS: "fields",
  SCOPES: "scopes",
  ROLES: "roles",
  PERMISSIONS: "permissions",
  PERMISSIONS_TREE: "permissions-tree",
  APPLICATIONS: "applications",
  NOT_FOUND: "not-found",
  UNAUTHORIZED: "unauthorized",
} as const;

export const ROUTES: Routes = [
  {
    path: AppPaths.LOGIN,
    loadChildren: () =>
      import("./login/login.routes").then((m) => m.AUTH_ROUTES),
    title: "Connexion",
    canActivate: [loginGuard()],
  },
  {
    path: AppPaths.ROUTES,
    loadComponent: () =>
      import("./admin/features/routes/routes.component").then(
        (m) => m.RoutesComponent,
      ),
    title: "Routes",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_RoutesNav:Routes`,
      functionality: "routes",
    },
    resolve: {
      operations: operationsResolver,
      services: serviceResolver,
      resources: resourcesResolver,
      methods: methodsResolver,
    },
  },
  {
    path: AppPaths.CONSUMERS,
    loadComponent: () =>
      import("./admin/features/consumers/consumers.component").then(
        (m) => m.ConsumersComponent,
      ),
    title: "Consumers",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_ConsumersNav:Consumers`,
      functionality: "consumers",
    },
    resolve: {
      roles: rolesResolver,
    },
  },
  {
    path: AppPaths.SERVICES,
    loadComponent: () =>
      import("./admin/features/services/services.component").then(
        (m) => m.ServicesComponent,
      ),
    title: "Services",
    canActivate: [aclGuard()],
    resolve: {
      applications: gatewayApplicationsResolver,
    },
    data: {
      breadcrumb: $localize`:@@Admin_ServicesNav:Services`,
      functionality: "services",
    },
  },
  {
    path: AppPaths.RESOURCES,
    loadComponent: () =>
      import("./admin/features/resources/resources.component").then(
        (m) => m.ResourcesComponent,
      ),
    title: "Resources",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_ResourcesNav:Resources`,
      functionality: "resources",
    },
    resolve: {
      services: serviceResolver,
    },
  },
  {
    path: AppPaths.CORS,
    loadComponent: () =>
      import("./admin/features/cors/cors.component").then(
        (m) => m.CorsComponent,
      ),
    title: "CORS",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_CorsNav:CORS`,
      functionality: "cors",
    },
  },
  {
    path: AppPaths.OPERATIONS,
    loadComponent: () =>
      import("./admin/features/operations/operations.component").then(
        (m) => m.OperationsComponent,
      ),
    title: "Operations",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_OperationsNav:Operations`,
      functionality: "operations",
    },
  },
  {
    path: AppPaths.METHODS,
    loadComponent: () =>
      import("./admin/features/methods/methods.component").then(
        (m) => m.MethodsComponent,
      ),
    title: "Methods",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_MethodsNav:Methods`,
      functionality: "methods",
    },
    resolve: {
      methods: methodsResolver,
    },
  },
  {
    path: AppPaths.FIELDS,
    loadComponent: () =>
      import("./admin/features/fields/fields.component").then(
        (m) => m.FieldsComponent,
      ),
    title: "Fields",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_FieldsNav:Fields`,
      functionality: "fields",
    },
    resolve: {
      resources: resourcesResolver,
      services: serviceResolver,
      applications: gatewayApplicationsResolver,
    },
  },
  {
    path: AppPaths.SCOPES,
    loadComponent: () =>
      import("./admin/features/scopes/scopes.component").then(
        (m) => m.ScopesComponent,
      ),
    title: "Scopes",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_ScopesNav:Scopes`,
      functionality: "scopes",
    },
    resolve: {
      routes: routesResolver,
      resources: resourcesResolver,
      services: serviceResolver,
      applications: gatewayApplicationsResolver,
    },
  },
  {
    path: AppPaths.ROLES,
    loadComponent: () =>
      import("./admin/features/roles/roles.component").then(
        (m) => m.RolesComponent,
      ),
    title: "Roles",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_RolesNav:Roles`,
      functionality: "roles",
    },
    resolve: {
      applications: gatewayApplicationsResolver,
    },
  },
  {
    path: AppPaths.APPLICATIONS,
    loadComponent: () =>
      import("./admin/features/applications/applications.component").then(
        (m) => m.ApplicationsComponent,
      ),
    title: "Applications",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_ApplicationsNav:Applications`,
      functionality: "applications",
    },
  },
  {
    path: AppPaths.PERMISSIONS,
    loadComponent: () =>
      import("./admin/features/permissions/permissions.component").then(
        (m) => m.PermissionsComponent,
      ),
    title: "Permissions",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_PermissionsNav:Permissions`,
      functionality: "permissions",
    },
    resolve: {
      roles: gatewayRolesResolver,
      routes: routesResolver,
      operations: operationsResolver,
      resources: resourcesResolver,
      services: serviceResolver,
    },
  },
  {
    path: AppPaths.PERMISSIONS_TREE,
    loadComponent: () =>
      import(
        "./admin/features/permissions/permissions-tree/permissions-tree.component"
      ).then((m) => m.PermissionsTreeComponent),
    title: "Permissions Tree",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_PermissionsTreeNav:Permissions Tree`,
      functionality: "permissions",
    },
    resolve: {
      roles: gatewayRolesResolver,
      routes: routesResolver,
    },
  },
  {
    path: AppPaths.UNAUTHORIZED,
    loadComponent: () =>
      import("./core/pages/unauthorized/unauthorized.component").then(
        (m) => m.UnauthorizedComponent,
      ),
    title: "Unauthorized",
    data: {
      breadcrumb: $localize`:@@Unauthorized_unauthorizedNav:Unauthorized`,
    },
  },
  {
    path: AppPaths.NOT_FOUND,
    component: NotFoundComponent,
    title: "Non trouvé",
    data: {
      breadcrumb: $localize`:@@NotFound_notFoundNav:Non trouvé`,
    },
  },
  {
    path: "",
    redirectTo: `/${AppPaths.CONSUMERS}`,
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: `/${AppPaths.NOT_FOUND}`,
    pathMatch: "full",
  },
];
