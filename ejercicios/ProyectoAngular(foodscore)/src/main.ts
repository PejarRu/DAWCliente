import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from "@angular/common/http";

import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/routes';
import { provideGoogleId } from './app/google-login/google-login.config';
import { provideFacebookId } from './app/facebook-login/facebook-login.config';
import { baseUrlInterceptor } from './app/interceptors/base-url.interceptor';
import { authInterceptor } from './app/interceptors/auth.interceptor';
bootstrapApplication(AppComponent, {
  providers: [
    provideGoogleId('128023507324-eb7ettrnedtqa9etjs5snhnoj8hlrknr.apps.googleusercontent.com'),
    provideFacebookId('1347489916050299', 'v16.0'),
    provideHttpClient(withInterceptors([authInterceptor, baseUrlInterceptor])),
    provideRouter(APP_ROUTES),
  ],
}).catch((e) => console.log(e));
