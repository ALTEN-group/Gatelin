import { AppPaths } from "app/app.routes";
import { MenuItem } from "primeng/api";

export const SIDENAV: MenuItem[] = [
  {
    id: "consumers",
    label: $localize`:@@Admin_ConsumersNav:Consumers`,
    routerLink: `/${AppPaths.CONSUMERS}`,
    icon: "pi pi-users",
    data: {
      functionality: "consumers",
    },
  },
  {
    id: "routing",
    label: $localize`:@@Admin_RoutingNav:Routing`,
    routerLink: `/${AppPaths.ROUTES}`,
    icon: "pi pi-share-alt",
    items: [
      {
        id: "routes",
        label: $localize`:@@Admin_RoutesNav:Routes`,
        routerLink: `/${AppPaths.ROUTES}`,
        icon: "pi pi-directions",
        data: {
          functionality: "routes",
        },
      },
      {
        id: "services",
        label: $localize`:@@Admin_ServicesNav:Services`,
        routerLink: `/${AppPaths.SERVICES}`,
        icon: "pi pi-server",
        data: {
          functionality: "services",
        },
      },
      {
        id: "apis",
        label: $localize`:@@Admin_ApisNav:Resources`,
        routerLink: `/${AppPaths.RESOURCES}`,
        icon: "pi pi-box",
        data: {
          functionality: "resources",
        },
      },
      {
        id: "operations",
        label: $localize`:@@Admin_OperationsNav:Operations`,
        routerLink: `/${AppPaths.OPERATIONS}`,
        icon: "pi pi-bolt",
        data: {
          functionality: "operations",
        },
      },
      {
        id: "methods",
        label: $localize`:@@Admin_MethodsNav:Methods`,
        routerLink: `/${AppPaths.METHODS}`,
        icon: "pi pi-code",
        data: {
          functionality: "methods",
        },
      },
      {
        id: "scopes",
        label: $localize`:@@Admin_ScopesNav:Scopes`,
        routerLink: `/${AppPaths.SCOPES}`,
        icon: "pi pi-filter",
        data: {
          functionality: "scopes",
        },
      },
      {
        id: "fields",
        label: $localize`:@@Admin_FieldsNav:Fields`,
        routerLink: `/${AppPaths.FIELDS}`,
        icon: "pi pi-list",
        data: {
          functionality: "fields",
        },
      },
    ],
  },
  {
    id: "roles",
    label: $localize`:@@Admin_AuthorizationNav:Authorizations`,
    routerLink: `/${AppPaths.ROLES}`,
    icon: "pi pi-key",
    items: [
      {
        id: "roles",
        label: $localize`:@@Admin_RolesNav:Roles`,
        routerLink: `/${AppPaths.ROLES}`,
        icon: "pi pi-id-card",
        data: {
          functionality: "roles",
        },
      },
      {
        id: "permissions",
        label: $localize`:@@Admin_PermissionsNav:Permissions`,
        routerLink: `/${AppPaths.PERMISSIONS}`,
        icon: "pi pi-lock",
        data: {
          functionality: "permissions",
        },
      },
      {
        id: "cors",
        label: $localize`:@@Admin_CorsNav:Cors`,
        routerLink: `/${AppPaths.CORS}`,
        icon: "pi pi-shield",
        data: {
          functionality: "cors",
        },
      },
    ],
  },
];
