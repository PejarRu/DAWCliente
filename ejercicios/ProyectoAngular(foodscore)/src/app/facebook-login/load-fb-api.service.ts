import { Inject, Injectable, Optional } from '@angular/core';
import { ReplaySubject, Observable, catchError, Observer } from 'rxjs';
import { FBConfig, FB_CONFIG } from './facebook-login.config';

@Injectable({
  providedIn: 'root'
})
export class LoadFbApiService {
  private initialized = false;

  private loader$ = new ReplaySubject<void>(1);

  constructor(@Optional() @Inject(FB_CONFIG) private fbConfig: FBConfig) {
    if (!fbConfig) {
      throw new Error('FacebookLogiService: You must call forRoot in your AppModule to pass the APP_ID and Version');
    }
  }

  loadApi(): Observable<void> {
    if (!this.initialized) {
      this.loadScript();
      this.initialized = true;
    }
    return this.loader$;
  }

  login(scopes: string): Observable<fb.StatusResponse> {
    return this.isLogged().pipe( // First, we'll see if it's already logged
      catchError(response => {
        return new Observable((observer: Observer<fb.StatusResponse>) => {
          FB.login((respLogin: fb.StatusResponse) => {
            if (respLogin.status === 'connected') {
              observer.next(respLogin);
            } else {
              observer.error(respLogin);
            }
            observer.complete();
          }, { scope: scopes });
        });
      })
    );
  }

  isLogged(): Observable<fb.StatusResponse> {
    return new Observable((observer: Observer<fb.StatusResponse>) => {
      FB.getLoginStatus(response => {
        if (response.status === 'connected') {
          observer.next(response);
        } else {
          observer.error(response);
        }
        observer.complete();
      });
    });
  }

  logout(): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      FB.logout(response => {
        observer.next();
        observer.complete();
      });
    });
  }

  private loadScript(): void {
    if (this.initialized) { return; }
    (window as any).fbAsyncInit = () => {
      FB.init({
        appId: this.fbConfig.app_id,
        xfbml: true,
        version: this.fbConfig.version
      });
      this.loader$.next();
      this.loader$.complete();
    };
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/es_ES/sdk.js';
    script.setAttribute('async', '');
    script.setAttribute('defer', '');
    document.body.appendChild(script);
  }
}
