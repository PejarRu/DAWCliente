import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from "@angular/common/http";

import { AppComponent } from './app/app.component';
import { baseUrlInterceptor } from './app/interceptors/base-url.interceptor';
import { APP_ROUTES } from './app/routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([baseUrlInterceptor])),
    provideRouter(APP_ROUTES)
],
}).catch((e) => console.log(e));
