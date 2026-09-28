
import { authGuard } from '@app/core/auth/auth.guard';
import type { HrsRoutes } from '@app/routes/app.routes';

export const HomeRoutes: HrsRoutes = [
  {
    icon: "home",
    title: "Home",
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import("@app/internal/home/dashboard/dashboard").then((m) => m.Dashboard),
  }
]