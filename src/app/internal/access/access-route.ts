import { authGuard } from "@app/core/auth/auth.guard";
import type { HrsRoutes } from "@app/routes/app.routes";
const routes: HrsRoutes = [
  {
    path: "",
    redirectTo: "access",
    pathMatch: "full",
  },
  {
    title: "Access",
    path: "access",
    loadComponent: () => import("@app/internal/access/access/access.page").then((m) => m.AccessPage)
  },
  {
    title: "Role Access",
    path: "role-access",
    loadComponent: () => import("@app/internal/access/role-access/role-access.page").then((m) => m.RoleAccessPage)
  }

]

export const AccessRoutes: HrsRoutes = [
  {
    icon: "lock",
    title: "Access",
    path: "access",
    canActivate: [authGuard],
    loadComponent: () => import("@app/internal/access/access.main").then((m) => m.AccessMain),
    children: routes
  }
]