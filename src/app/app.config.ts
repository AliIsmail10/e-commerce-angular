import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { headerInterceptor } from './Shared/interceptors/Header/header.interceptor';
import { loaderInterceptor } from './Shared/interceptors/Loader/loader.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withFetch(),withInterceptors([headerInterceptor,loaderInterceptor])),provideAnimations(),provideToastr(),provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
