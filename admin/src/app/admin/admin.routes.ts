import { Routes } from "@angular/router";
import { ApisComponent } from "app/admin/features/apis/apis.component";
import { ConsumersComponent } from "app/admin/features/consumers/consumers.component";
import { RoutesComponent } from "app/admin/features/routes/routes.component";
import { ServicesComponent } from "app/admin/features/services/services.component";

export const ADMIN_ROUTES: Routes = [
	{
		path: "routes",
		component: RoutesComponent,
		data: {
			breadcrumb: $localize`:@@Routes_routesNav:Routes`,
		},
	},
	{
		path: "consumers",
		component: ConsumersComponent,
		data: {
			breadcrumb: $localize`:@@Consumers_consumersNav:Consumers`,
		},
	},
	{
		path: "services",
		component: ServicesComponent,
		data: {
			breadcrumb: $localize`:@@Services_servicesNav:Services`,
		},
	},
	{
		path: "apis",
		component: ApisComponent,
		data: {
			breadcrumb: $localize`:@@Apis_apisNav:APIs`,
		},
	},
	{
		path: "**",
		redirectTo: "routes",
		data: {},
	},
];
