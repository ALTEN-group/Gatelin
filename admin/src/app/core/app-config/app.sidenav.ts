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
		id: AppPaths.ADMIN,
		label: $localize`:@@Admin_AdminNav:Administration`,
		routerLink: `/${AppPaths.ADMIN}/routes`,
		icon: "pi pi-cog",
		items: [
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
		],
	},
];
