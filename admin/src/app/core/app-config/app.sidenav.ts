import { AppPaths } from "app/app.routes";
import { MenuItem } from "primeng/api";

export const SIDENAV: MenuItem[] = [
	{
		id: AppPaths.HOME,
		label: $localize`:@@Home_homeNav:Accueil`,
		routerLink: `/${AppPaths.HOME}`,
		icon: "pi pi-home",
	},
	{
		id: "routes",
		label: $localize`:@@Admin_RoutesNav:Routes`,
		routerLink: `/${AppPaths.ADMIN}/routes`,
		icon: "pi pi-directions",
	},
	{
		id: "consumers",
		label: $localize`:@@Admin_ConsumersNav:Consumers`,
		routerLink: `/${AppPaths.ADMIN}/consumers`,
		icon: "pi pi-users",
	},
	{
		id: "services",
		label: $localize`:@@Admin_ServicesNav:Services`,
		routerLink: `/${AppPaths.ADMIN}/services`,
		icon: "pi pi-directions",
	},
	{
		id: "apis",
		label: $localize`:@@Admin_ApisNav:resources`,
		routerLink: `/${AppPaths.ADMIN}/resources`,
		icon: "pi pi-directions",
	},
	{
		id: "cors",
		label: $localize`:@@Admin_CorsNav:Cors`,
		routerLink: `/${AppPaths.ADMIN}/cors`,
		icon: "pi pi-directions",
	},
	{
		id: "operations",
		label: $localize`:@@Admin_OperationsNav:Operations`,
		routerLink: `/${AppPaths.ADMIN}/operations`,
		icon: "pi pi-directions",
	},
];
