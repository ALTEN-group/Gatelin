import { Routes } from "@angular/router";
import { aclGuard } from "@core/acl/acl.guard";
import { ADMIN_ENTITIES, AdminEntity } from "@core/app-config/app.entities";
import { loginGuard } from "@core/auth/login.guard";
import { NotFoundComponent } from "@core/pages/not-found/not-found.component";
import { gatelinApplicationsResolver } from "app/authorizations/data-access/applications/applications.resolver";
import { conditionsResolver } from "app/authorizations/data-access/conditions/conditions.resolver";
import { fieldsResolver } from "app/authorizations/data-access/fields/fields.resolver";
import { methodsResolver } from "app/routing/data-access/methods/methods.resolver";
import { operationsResolver } from "app/routing/data-access/operations/operations.resolver";
import { resourcesResolver } from "app/routing/data-access/resources/resources.resolver";
import { gatelinRolesResolver } from "app/authorizations/data-access/roles/roles.resolver";
import { routesResolver } from "app/routing/data-access/routes/routes.resolver";
import { scopesResolver } from "app/authorizations/data-access/scopes/scopes.resolver";
import { serviceResolver } from "app/routing/data-access/services/service.resolver";

type EntityPaths = { readonly [K in AdminEntity as Uppercase<K>]: K };

const ENTITY_PATHS = Object.fromEntries(
  ADMIN_ENTITIES.map((e) => [e.toUpperCase(), e]),
) as EntityPaths;

/**
 * Application Paths
 */
export const AppPaths = {
  LOGIN: "login",
  NOT_FOUND: "not-found",
  UNAUTHORIZED: "unauthorized",
  ...ENTITY_PATHS,
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
      import("./routing/features/routes/routes.component").then(
        (m) => m.RoutesComponent,
      ),
    title: "Routes",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_RoutesNav:Routes`,
      functionality: AppPaths.ROUTES,
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
      import("./consumers/features/consumers/consumers.component").then(
        (m) => m.ConsumersComponent,
      ),
    title: "Consumers",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_ConsumersNav:Consumers`,
      functionality: AppPaths.CONSUMERS,
    },
    resolve: {
      roles: gatelinRolesResolver,
    },
  },
  {
    path: AppPaths.SERVICES,
    loadComponent: () =>
      import("./routing/features/services/services.component").then(
        (m) => m.ServicesComponent,
      ),
    title: "Services",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_ServicesNav:Services`,
      functionality: AppPaths.SERVICES,
    },
  },
  {
    path: AppPaths.RESOURCES,
    loadComponent: () =>
      import("./routing/features/resources/resources.component").then(
        (m) => m.ResourcesComponent,
      ),
    title: "Resources",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_ResourcesNav:Resources`,
      functionality: AppPaths.RESOURCES,
    },
    resolve: {
      services: serviceResolver,
    },
  },
  {
    path: AppPaths.CORS,
    loadComponent: () =>
      import("./authorizations/features/cors/cors.component").then(
        (m) => m.CorsComponent,
      ),
    title: "CORS",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_CorsNav:CORS`,
      functionality: AppPaths.CORS,
    },
  },
  {
    path: AppPaths.OPERATIONS,
    loadComponent: () =>
      import("./routing/features/operations/operations.component").then(
        (m) => m.OperationsComponent,
      ),
    title: "Operations",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_OperationsNav:Operations`,
      functionality: AppPaths.OPERATIONS,
    },
  },
  {
    path: AppPaths.METHODS,
    loadComponent: () =>
      import("./routing/features/methods/methods.component").then(
        (m) => m.MethodsComponent,
      ),
    title: "Methods",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_MethodsNav:Methods`,
      functionality: AppPaths.METHODS,
    },
    resolve: {
      methods: methodsResolver,
    },
  },
  {
    path: AppPaths.FIELDS,
    loadComponent: () =>
      import("./authorizations/features/fields/fields.component").then(
        (m) => m.FieldsComponent,
      ),
    title: "Fields",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_FieldsNav:Fields`,
      functionality: AppPaths.FIELDS,
    },
    resolve: {
      resources: resourcesResolver,
      services: serviceResolver,
    },
  },
  {
    path: AppPaths.SCOPES,
    loadComponent: () =>
      import("./authorizations/features/scopes/scopes.component").then(
        (m) => m.ScopesComponent,
      ),
    title: "Scopes",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_ScopesNav:Scopes`,
      functionality: AppPaths.SCOPES,
    },
    resolve: {
      routes: routesResolver,
      resources: resourcesResolver,
    },
  },
  {
    path: AppPaths.ROLES,
    loadComponent: () =>
      import("./authorizations/features/roles/roles.component").then(
        (m) => m.RolesComponent,
      ),
    title: "Roles",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_RolesNav:Roles`,
      functionality: AppPaths.ROLES,
    },
    resolve: {
      applications: gatelinApplicationsResolver,
    },
  },
  {
    path: AppPaths.APPLICATIONS,
    loadComponent: () =>
      import("./authorizations/features/applications/applications.component").then(
        (m) => m.ApplicationsComponent,
      ),
    title: "Applications",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_ApplicationsNav:Applications`,
      functionality: AppPaths.APPLICATIONS,
    },
  },
  {
    path: AppPaths.CONDITIONS,
    loadComponent: () =>
      import("./authorizations/features/conditions/conditions.component").then(
        (m) => m.ConditionsComponent,
      ),
    title: "Conditions",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_ConditionsNav:Conditions`,
      functionality: AppPaths.CONDITIONS,
    },
    resolve: {
      fields: fieldsResolver,
    },
  },
  {
    path: AppPaths.PERMISSIONS,
    loadComponent: () =>
      import("./authorizations/features/permissions/permissions-tree.component").then(
        (m) => m.PermissionsTreeComponent,
      ),
    title: "Permissions Tree",
    canActivate: [aclGuard()],
    data: {
      breadcrumb: $localize`:@@Admin_PermissionsTreeNav:Permissions Tree`,
      functionality: AppPaths.PERMISSIONS,
    },
    resolve: {
      roles: gatelinRolesResolver,
      routes: routesResolver,
      scopes: scopesResolver,
      conditions: conditionsResolver,
      operations: operationsResolver,
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
