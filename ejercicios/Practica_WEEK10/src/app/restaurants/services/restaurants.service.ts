import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError, retry } from 'rxjs';


import { Restaurant } from '../interfaces/restaurant';
import { ResponseRestaurant, ResponseRestaurants } from '../../interfaces/responses';
@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {

  private restaurantURL = 'restaurants';

  constructor(private readonly http: HttpClient) {

  }

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<ResponseRestaurants>
      (this.restaurantURL)
      .pipe(
        retry(3),
        map(response => response.restaurants),
        catchError((resp: HttpErrorResponse) =>
          throwError(() =>
            `Error getting restaurants. Status: ${resp.status}. Message: ${resp.message}`
          )
        )
      );
  }

  getRestaurant(id: number): Observable<Restaurant> {
    return this.http.get<ResponseRestaurant>(`${this.restaurantURL}/${id}`)
      .pipe(
        map((response) => response.restaurant)
      );
  }

  addRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    return this.http.post<ResponseRestaurant>(`${this.restaurantURL}`, restaurant)
      .pipe(
        map((response) => response.restaurant)
      );
  }

  deleteRestaurants(id: number): Observable<Restaurant> {
    return this.http.delete<ResponseRestaurant>(`${this.restaurantURL}/${id}`)
      .pipe(
        map((response) => response.restaurant)
      );
  }

  editRestaurant(restaurant: Restaurant): Observable<void> {
    return this.http.put<void>
      (`${this.restaurantURL}/${restaurant.id}`,
        restaurant
      );
  }
  /*
  changeRating(idRestaurant: number, rating: number): Observable<void> {
    return this.http.put<void>
    (`${this.restaurantURL}/${idRestaurant}/rating`,
      {rating: rating}
    );
  }
  */

}
