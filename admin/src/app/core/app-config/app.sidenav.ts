import { AppPaths } from "app/app.routes";
import { MenuItem } from "primeng/api";

export const SIDENAV: MenuItem[] = [
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
    icon: "pi pi-directions",
    data: {
      functionality: "services",
    },
  },
  {
    id: "apis",
    label: $localize`:@@Admin_ApisNav:Resources`,
    routerLink: `/${AppPaths.RESOURCES}`,
    icon: "pi pi-directions",
    data: {
      functionality: "resources",
    },
  },
  {
    id: "cors",
    label: $localize`:@@Admin_CorsNav:Cors`,
    routerLink: `/${AppPaths.CORS}`,
    icon: "pi pi-directions",
    data: {
      functionality: "cors",
    },
  },
  {
    id: "operations",
    label: $localize`:@@Admin_OperationsNav:Operations`,
    routerLink: `/${AppPaths.OPERATIONS}`,
    icon: "pi pi-directions",
    data: {
      functionality: "operations",
    },
  },
];
