import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {
  ArrowRightOutline,
  BellOutline,
  CalendarOutline,
  CheckCircleFill,
  DashboardOutline,
  HomeOutline,
  LockOutline,
  LogoutOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  SettingOutline,
  TeamOutline,
  UserOutline,
} from '@ant-design/icons-angular/icons';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { routes } from '@app/routes/app.routes';
import { interceptors } from '@app/core/interceptors/interceptors.index';
import { provideNzDateFnsAdapter } from 'ng-zorro-antd/core/time';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([...interceptors])),
    provideNzIcons([
      ArrowRightOutline,
      BellOutline,
      CalendarOutline,
      CheckCircleFill,
      DashboardOutline,
      HomeOutline,
      LockOutline,
      LogoutOutline,
      MenuFoldOutline,
      MenuUnfoldOutline,
      SettingOutline,
      TeamOutline,
      UserOutline,
    ]),
    provideNzDateFnsAdapter(),
    provideRouter(routes),
    { provide: NZ_I18N, useValue: en_US }
  ],
};
