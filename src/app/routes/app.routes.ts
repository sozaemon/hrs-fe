import { Route } from '@angular/router';
import { AccessRoutes } from '@app/internal/access/access-route';
import { HomeRoutes } from '@app/internal/home/home-route';

export interface HrsRoute extends Route {
	icon?: string;
	children?: HrsRoutes;
}

export type HrsRoutes = HrsRoute[];

export const AppRoutes: HrsRoutes = [
	...HomeRoutes,
	...AccessRoutes,
]

export const routes: HrsRoutes = [
	{
		path: "",
		redirectTo: "app",
		pathMatch: "full",
	},
	{
		path: "app",
		loadComponent: () => import("@app/internal/main").then((m) => m.Main),
		children: [
			{
				path: "",
				redirectTo: "home",
				pathMatch: "full",
			},
			...AppRoutes,
		]
	},
	{
		path: 'login',
		loadComponent: () => import('@app/internal/login/login').then((module) => module.Login),
	},
	{
		path: '**',
		loadComponent: () => import("@app/internal/page-not-found/page-not-found").then((module) => module.Page404),
	},
];

