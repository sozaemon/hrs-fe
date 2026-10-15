import { authGuard } from "@app/core/auth/auth.guard";
import { HrsRoutes } from "@app/routes/app.routes";

const routes: HrsRoutes = [
  {
    path: "",
    redirectTo: "shift",
    pathMatch: "full"
  },
  {
    title: "Shift",
    path: "shift",
    loadComponent: () => import("@app/internal/shift/shift/shift.page")
      .then((module) => module.ShiftPage)
  },
  {
    title: "Shift Type",
    path: "shift-type",
    loadComponent: () => import("@app/internal/shift/shift-type/shift-type.page")
      .then((module) => module.ShiftTypePage)
  },
  {
    title: "Shift Tolerance",
    path: "shift-tolerance",
    loadComponent: () => import("@app/internal/shift/shift-tolerance/shift-tolerance.page")
      .then((module) => module.ShiftTolerancePage)
  }

]

export const ShiftRoutes: HrsRoutes = [
  {
    icon: "field-time",
    title: "Shift",
    path: "shift",
    canActivate: [authGuard],
    loadComponent: () => import("@app/internal/shift/shift.main").then((module) => module.ShiftMain),
    children: routes
  }

]