import { Injectable } from '@angular/core';
import { Observable, throwError, from, BehaviorSubject, map } from 'rxjs';
import { SERVER } from '../shared/constants';
import { User } from '../interfaces/user';
import { UserResponse } from '../shared/intefaces/responses';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '';
  private tokenKey = 'access_token';
  private logged: boolean = false
  /*
  private userData: User;´
  */
  constructor(private readonly http: HttpClient) { }


  register(user: User | { name: string, email: string, password: string, avatar: string, lat: number, lng: number }): Observable<any> {
    const url = `/auth/register`;

    let data: any = {};
    if (typeof user === 'object') {
      data = user;
    } else {
      const { name, email, password, avatar, lat, lng } = user;
      data = { name, email, password, avatar, lat, lng };
    }

    return from(this.http.post(url, data)) as Observable<any>;
  }

  login(email: string, password: string, lat?: number, lng?: number): Observable<any> {
    const url = `/auth/login`;
    const data = { email, password, ...(lat && { lat }), ...(lng && { lng }) };
    let result = from(this.http.post(url, data)) as Observable<any>;
    console.log(result);

    return result;
  }

  getMyProfile(): Observable<User> {
    console.log("auth-service: getMyProfile;");
    const url = `/users/me`;

    return from(this.http
      .get<UserResponse>(url))
      .pipe(
        map((response: { user: User; }) => response.user)
      );
  }

  getProfile(id?: number): Observable<User> {
    let response: Observable<User>;
    if (id) {
      console.log("auth-service: getProfile: " + id);
      const url = `/users/${id}`;

      response = from(this.http
        .get<UserResponse>(url))
        .pipe(
          map((response: { user: User; }) => response.user)
        );
    } else {
      console.log("auth-service: getMyProfile;");
      const url = `/users/me`;

      response = from(this.http
        .get<UserResponse>(url))
        .pipe(
          map((response: { user: User; }) => response.user)
        );
    }
    console.log(response);

    return response;

  }

  /*
  async loadLoguedUserData(): Promise<void> {
    if (!this.getToken()) {
      return;
    }

    const url = `/users/me`;
    this.http.get(url).then((user)=>{
    });

    this.userData = {
      email: user.email,
      name: user.name,
      avatar: user.avatar
    };
  }
*/
  logout(): void {
    localStorage.removeItem(this.tokenKey);

  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.logged = true;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLogged(): boolean {
    return (!!this.getToken() || this.logged) ?? false;
  }
  private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
}
