import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Restaurant } from '../interfaces/restaurant';
import { RestaurantsResponse, RestaurantResponse, CommentsResponse, CommentResponse } from '../../shared/intefaces/responses';
import { Comment } from 'src/app/interfaces/comment';
@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Restaurant[]> {
    return this.http
      .get<RestaurantsResponse>('restaurants')
      .pipe(map((r) => r.restaurants));
  }

  getById(id: number): Observable<Restaurant> {
    return this.http
      .get<RestaurantResponse>(`restaurants/${id}`)
      .pipe(map((r) => r.restaurant));
  }
  getByUser(userId: number): Observable<Restaurant[]> {
    return this.http
      .get<RestaurantsResponse>(`restaurants/users/${userId}`)
      .pipe(map((r) => r.restaurants));
  }

  create(restaurant: Restaurant): Observable<Restaurant> {
    return this.http
      .post<RestaurantResponse>('restaurants', restaurant)
      .pipe(map((r) => r.restaurant));
  }

  getComments(restId: number): Observable<Comment[]> {
    return this.http
      .get<CommentsResponse>(`restaurants/${restId}/comments`)
      .pipe(map((r) => r.comments));
  }

  addComment(restId: number,comment: Comment): Observable<Comment> {
    return this.http
      .post<CommentResponse>(`restaurants/${restId}/comments`, comment)
      .pipe(map((r) => r.comment));
  }
  /*
  deleteComment(restId: number, restaurant: Restaurant): Observable<Restaurant> {
    return this.http
      .post<RestaurantResponse>('restaurants', restaurant)
      .pipe(map((r) => r.restaurant));
  }
  */
  edit(restaurant: Restaurant): Observable<Restaurant> {
    return this.http
      .put<RestaurantResponse>('restaurants', restaurant)
      .pipe(map((r) => r.restaurant));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`restaurants/${id}`);
  }
}
