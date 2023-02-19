import { Injectable } from '@angular/core';
import { Observable, throwError, from, BehaviorSubject, map, ReplaySubject, catchError, of, tap } from 'rxjs';
import { SERVER } from '../shared/constants';
import { User } from '../interfaces/user';
import { UserResponse, TokenResponse } from '../shared/intefaces/responses';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '';
  private tokenKey = 'access_token';
  private logged: boolean = false
  loginChange$ = new ReplaySubject<boolean>(1)

  constructor(private readonly http: HttpClient) { }
  /*
    login(email: string, password: string, lat?: number, lng?: number): Observable<any> {
      const data = { email, password, ...(lat && { lat }), ...(lng && { lng }) };
      let result = from(this.http
        .post(`/auth/login`, data)) as Observable<any>;
      console.log(result);

      return result;
    }
    */
  login(email: string, password: string, lat?: number, lng?: number): Observable<void> {
    const data = { email, password, ...(lat && { lat }), ...(lng && { lng }) };
    return this.http.post<TokenResponse>(`${this.apiUrl}/auth/login`, data)
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

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.logged = false;
    this.loginChange$.next(false);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.logged = true;
  }
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLogged(): Observable<boolean> {
    if (!this.logged && !this.getToken()) {
      //Both are not OK!
      return of(false);
    }
    if (this.logged && this.getToken()) {
      //Both are OK!
      return of(true);
    }
    if (!this.logged && this.getToken()) {
      //Logged = false, but token exist
    }
      return this.validateToken().pipe(
        tap(valid => {
          if (valid) {
            this.logged = true;
            this.loginChange$.next(true);
          }
        }),
        catchError(error => {
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
