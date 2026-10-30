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
  },
  {
    title: "Role",
    path: "role",
    loadComponent: () => import("@app/internal/access/role/role.page").then((m) => m.RolePage)
  },
  {
    title: "Upload Role Access",
    path: "upload-role-access",
    loadComponent: () => import("@app/internal/access/upload-role-access/upload-role-access.page").then((m) => m.UploadRoleAccessPage)
  },
  {
    title: "Upload Access Detail",
    path: "upload-access-detail",
    isHidden: true,
    loadComponent: () => import("@app/internal/access/upload-access-detail/upload-access-detail.page").then((m) => m.UploadAccessDetailPage)
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