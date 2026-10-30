import { Route } from '@angular/router';
import { authGuard } from '@app/core/auth/auth.guard';
import { AccessRoutes } from '@app/internal/access/access-route';
import { HomeRoutes } from '@app/internal/home/home-route';
import { ShiftRoutes } from '@app/internal/shift/shift-route';

export interface HrsRoute extends Route {
	icon?: string;
	isHidden?: boolean;
	children?: HrsRoutes;
}

export type HrsRoutes = HrsRoute[];

export const AppRoutes: HrsRoutes = [
	...HomeRoutes,
	...AccessRoutes,
	...ShiftRoutes,
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
		canActivate: [authGuard],
		path: "change-password",
		loadComponent: () => import("app/internal/change-password/change-password").then((module) => module.ChangePassword),
	},
	{
		path: '**',
		loadComponent: () => import("@app/internal/page-not-found/page-not-found").then((module) => module.Page404),
	},
];

