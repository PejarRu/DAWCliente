import { Injectable } from '@angular/core';
import { Observable, throwError, from, BehaviorSubject, map } from 'rxjs';
import { HttpService } from '../shared/services/http.class';
import { SERVER } from '../shared/constants';
import { User } from '../interfaces/user';
import { UserResponse } from '../shared/intefaces/responses';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = SERVER;

  constructor(private readonly http: HttpService = new HttpService()) { }

  getProfile(id?: number): Observable<User> {
    if (id) {
      console.log("user-service: getProfile: " + id);
      return from(this.http
        .get<UserResponse>(`/users/${id}`))
        .pipe(map((response: { user: User }) => response.user));
    } else {
      console.log("user-service: getMyProfile");
      return from(this.http
        .get<UserResponse>(`/users/me`))
        .pipe(map((response: { user: User }) => response.user));
    }
  }

  saveProfile(name: string, email: string): Observable<void> {
    console.log("user-service: saveProfile: " + email + ", " + name + ";");
    return from(this.http.put<UserResponse>(`/users/me`, {
      email: email,
      name: name
    })).pipe(map(() => { }));
  }

  saveAvatar(avatar64: string): Observable<string> {
    console.log("user-service: saveAvatar: <image64>;");
    return from(this.http.put<string>(`/users/me/avatar`, {
      avatar: avatar64
    }));
  }

  savePassword(password: string): Observable<void> {
    console.log("user-service: savePassword: <password>;");
    return from(this.http.put<UserResponse>(`/users/me/password`, {
      password: password
    })).pipe(map(() => { }));
  }
}
