import { Routes } from "@angular/router";
import { operationsResolver } from "app/admin/data-access/operations/operations.resolver";
import { resourcesResolver } from "app/admin/data-access/resources/resources.resolver";
import { serviceResolver } from "app/admin/data-access/services/service.resolver";
import { ConsumersComponent } from "app/admin/features/consumers/consumers.component";
import { CorsComponent } from "app/admin/features/cors/cors.component";
import { OperationsComponent } from "app/admin/features/operations/operations.component";
import { ResourcesComponent } from "app/admin/features/resources/resources.component";
import { RoutesComponent } from "app/admin/features/routes/routes.component";
import { ServicesComponent } from "app/admin/features/services/services.component";

export const ADMIN_ROUTES: Routes = [
	{
		path: "routes",
		component: RoutesComponent,
		data: {
			breadcrumb: $localize`:@@Routes_routesNav:Routes`,
		},
		resolve: {
			operations: operationsResolver,
			services: serviceResolver,
			resources: resourcesResolver,
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
		path: "resources",
		component: ResourcesComponent,
		data: {
			breadcrumb: $localize`:@@Apis_apisNav:APIs`,
		},
		resolve: {
			services: serviceResolver,
		},
	},
	{
		path: "cors",
		component: CorsComponent,
		data: {
			breadcrumb: $localize`:@@Cors_corsNav:CORS`,
		},
	},
	{
		path: "operations",
		component: OperationsComponent,
		data: {
			breadcrumb: $localize`:@@Operations_operationsNav:Opérations`,
		},
	},
	{
		path: "**",
		redirectTo: "routes",
		data: {},
	},
];
