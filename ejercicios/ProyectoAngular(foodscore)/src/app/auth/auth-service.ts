import { Injectable } from '@angular/core';
import { Observable, throwError, from, BehaviorSubject } from 'rxjs';
import { HttpService } from '../shared/services/http.class';
import { SERVER } from '../shared/constants';
import { User } from '../../../../Practica_WEEK6(Proyecto 1ºEVA)/src/interfaces/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = SERVER;
  private tokenKey = 'access_token';
  public logged: boolean = false
  constructor(private readonly http: HttpService = new HttpService()) { }


  register(user: User | { name: string, email: string, password: string, avatar: string, lat: number, lng: number }): Observable<any> {
    const url = `${this.apiUrl}/auth/register`;

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
    const url = `${this.apiUrl}/auth/login`;
    const data = { email, password, ...(lat && { lat }), ...(lng && { lng }) };
    return from(this.http.post(url, data)) as Observable<any>;
  }


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
