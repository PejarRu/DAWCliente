import { Injectable } from '@angular/core';
import { Observable, throwError, from, BehaviorSubject, map, ReplaySubject, catchError, of, tap } from 'rxjs';
import { SERVER } from '../shared/constants';
import { User } from '../interfaces/user';
import { UserResponse, TokenResponse, AvatarResponse } from '../shared/intefaces/responses';
import { HttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '';
  private tokenKey = 'access_token';
  private logged: boolean = false
  loginChange$ = new ReplaySubject<boolean>(1)

  constructor(private readonly http: HttpClient, private router: Router) { }

  login(email: string, password: string, lat?: number, lng?: number): Observable<void> {
    const data = { email, password, ...(lat && { lat }), ...(lng && { lng }) };
    return this.http.post<TokenResponse>(`/auth/login`, data)
      .pipe(
        map(response => {
          this.setToken(response.accessToken);
          this.logged = true;
          this.loginChange$.next(true);
        }),
        catchError((error: any) => throwError(error))
      );
  }

  register(user: User | { name: string, email: string, password: string, avatar: string, lat: number, lng: number }): Observable<any> {
    let data: any = {};
    if (typeof user === 'object') {
      data = user;
    } else {
      const { name, email, password, avatar, lat, lng } = user;
      data = { name, email, password, avatar, lat, lng };
    }

    return from(this.http.post(`/auth/register`, data)) as Observable<any>;
  }


  getMyProfile(): Observable<User> {
    console.log("auth-service: getMyProfile;");
    return from(this.http
      .get<UserResponse>(`/users/me`))
      .pipe(
        map((response: { user: User; }) => response.user)
      );
  }

  getProfile(id?: number): Observable<User> {
    let response: Observable<User>;
    console.log("getProfile; Id->" + id ?? 'No_ID');
    if (id) {
      response = from(this.http
        .get<UserResponse>(`/users/${id}`))
        .pipe(
          map((response: { user: User; }) => response.user)
        );
    } else {
      response = from(this.http
        .get<UserResponse>(`/users/me`))
        .pipe(
          map((response: { user: User; }) => response.user)
        );
    }
    return response;

  }

  updateProfile(email: string, name: string): Observable<boolean> {
    const data = { email, name };
    return this.http.put<boolean>(`/users/me`, data)
      .pipe(
        map(response => {
          return response ? true : false;
        }),
        catchError((error: any) => throwError(error))
      );
  }

  updateAvatar(newAvatar: string): Observable<AvatarResponse> {
    const data = { avatar: newAvatar };
    return this.http.put<AvatarResponse>(`/users/me/avatar`, data)
      .pipe(
        map(response => {
          return response
        }),
        catchError((error: any) => throwError(error))
      );
  }

  updatePassword(newPassword: string): Observable<boolean> {
    const data = { password: newPassword };
    return this.http.put<boolean>(`/users/me/password`, data)
      .pipe(
        map(response => {
          return response ? true : false;
        }),
        catchError((error: any) => throwError(error))
      );
  }


  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.logged = false;
    this.loginChange$.next(false);
    this.router.navigate(['/restaurants']);

  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLogged(): Observable<boolean> {
    if (this.logged && this.getToken()) {
      console.log('logged');

      //Both are OK!
      return of(true);
    }
    if (!this.logged && !this.getToken()) {
      console.log('NOT logged');

      //Both are not OK!
      return of(false);
    }

    if (!this.logged && this.getToken()) {
      //Logged = false, but token exist
    }
    return this.validateToken().pipe(
      tap(valid => {
        if (valid) {
          console.log('logged VIA TOKEN');

          this.logged = true;
          this.loginChange$.next(true);
        }
      }),
      catchError(error => {
        console.log('NOT logged 2');
        this.removeToken();


        return of(false);
      })
    );

  }

  private validateToken(): Observable<boolean> {
    return this.http.get<UserResponse>(`/auth/validate`)
      .pipe(
        map(response => true),
        catchError(error => of(false))
      );
  }

}
