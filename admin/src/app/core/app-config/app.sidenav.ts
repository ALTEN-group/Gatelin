import { AppPaths } from "app/app.routes";
import { MenuItem } from "primeng/api";

export const SIDENAV: MenuItem[] = [
  {
    id: "routes",
    label: $localize`:@@Admin_RoutesNav:Routes`,
    routerLink: `/${AppPaths.ROUTES}`,
    icon: "pi pi-arrow-right-arrow-left",
    data: {
      functionality: "routes",
    },
  },
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
<<<<<<< HEAD
    icon: "pi pi-sitemap",
=======
    icon: "pi pi-box",
>>>>>>> a2cda0e2af91281439d982e779eb9262b094d519
    data: {
      functionality: "resources",
    },
  },
  {
    id: "cors",
    label: $localize`:@@Admin_CorsNav:Cors`,
    routerLink: `/${AppPaths.CORS}`,
<<<<<<< HEAD
    icon: "pi pi-globe",
=======
    icon: "pi pi-shield",
>>>>>>> a2cda0e2af91281439d982e779eb9262b094d519
    data: {
      functionality: "cors",
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
    id: "fields",
    label: $localize`:@@Admin_FieldsNav:Fields`,
    routerLink: `/${AppPaths.FIELDS}`,
    icon: "pi pi-table",
    data: {
      functionality: "fields",
    },
  },
  {
    id: "scopes",
    label: $localize`:@@Admin_ScopesNav:Scopes`,
    routerLink: `/${AppPaths.SCOPES}`,
    icon: "pi pi-lock",
    data: {
      functionality: "scopes",
    },
  },
];
