import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { headerInterceptor } from './Shared/interceptors/Header/header.interceptor';
import { loaderInterceptor } from './Shared/interceptors/Loader/loader.interceptor';
import { errorInterceptor } from './Shared/interceptors/Error/error.interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
export const appConfig: ApplicationConfig = {
  providers: [provideCharts(withDefaultRegisterables()),provideHttpClient(withFetch(),withInterceptors([headerInterceptor,loaderInterceptor,errorInterceptor])),provideAnimations(),provideToastr(),provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter( routes,
    withViewTransitions(),withInMemoryScrolling({ scrollPositionRestoration: 'top' })) 
]
};
