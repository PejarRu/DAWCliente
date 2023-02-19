import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from "@angular/common/http";

import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/routes';
import { provideGoogleId } from './app/google-login/google-login.config';
import { provideFacebookId } from './app/facebook-login/facebook-login.config';
import { baseUrlInterceptor } from './app/interceptors/base-url.interceptor';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { provideArcgisToken } from './app/maps/arcgis-maps.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideGoogleId('128023507324-eb7ettrnedtqa9etjs5snhnoj8hlrknr.apps.googleusercontent.com'),
    provideFacebookId('1347489916050299', 'v16.0'),
    provideHttpClient(withInterceptors([
      baseUrlInterceptor,
      authInterceptor,
    ])),
    provideArcgisToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjU4LCJpYXQiOjE2NzA4NTkzNTcsImV4cCI6MTcwMjM5NTM1N30.yreHppO19oiwkyyK3N7fGtqTXUCqt1pUXNPGJWGM6yQ'),
    provideRouter(APP_ROUTES),
  ],
}).catch((e) => console.log(e));
