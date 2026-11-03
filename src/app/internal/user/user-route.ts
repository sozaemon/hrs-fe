import { authGuard } from "@app/core/auth/auth.guard";
import { HrsRoutes } from "@app/routes/app.routes";

const routes: HrsRoutes = [
  {
    path: "",
    redirectTo: "user-management",
    pathMatch: "full"
  },
  {
    title: "User Management",
    path: "user-management",
    loadComponent: () => import("@app/internal/user/user-management/user.page")
      .then((module) => module.UserPage)
  }
];

export const UserRoutes: HrsRoutes = [
  {
    icon: "team",
    title: "User",
    path: "user",
    canActivate: [authGuard],
    loadComponent: () => import("@app/internal/user/user.main").then((module) => module.UserMain),
    children: routes
  }
];
