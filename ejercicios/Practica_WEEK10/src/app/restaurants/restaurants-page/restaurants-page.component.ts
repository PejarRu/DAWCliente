import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Restaurant } from '../interfaces/restaurant';
import { RestaurantFilterPipe } from '../pipes/restaurant-filter.pipe';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { RestaurantFormComponent } from '../restaurant-form/restaurant-form.component';
import { RestaurantsService } from 'src/app/restaurants/services/restaurants.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'fs-restaurants-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RestaurantCardComponent,
    RestaurantFormComponent,
    RestaurantFilterPipe
  ],
  templateUrl: './restaurants-page.component.html',
  styleUrls: ['./restaurants-page.component.css'],
})
export class RestaurantsPageComponent implements OnInit {
  restaurants: Restaurant[] = [];
  onlyOpen = false;
  search = '';
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.restaurantsService.getRestaurants().subscribe({
      next: (rests) => (this.restaurants = rests),
      error: (error) => console.error(error),
      complete: () => console.log('Restaurants loaded'),
    });
  }
  addRestaurant(restaurant: Restaurant) {
    this.restaurantsService.addRestaurant(restaurant).subscribe(
      (response) => {
        this.restaurants = [...this.restaurants, response];
      },
      (error) => console.log(error)
    );
  }

  deleteRestaurant(restaurant: Restaurant) {
    const id = Number(restaurant.id);
    console.log(id);

    this.restaurantsService.deleteRestaurants(id).subscribe(
      (response) => {
        this.restaurants = this.restaurants.filter((r) => r !== restaurant);
      },
      (error) => console.log(error)
    );
    this.restaurants = this.restaurants.filter((r) => r !== restaurant);
  }
}
