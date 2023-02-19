import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Restaurant } from '../interfaces/restaurant';
import { RestaurantFilterPipe } from '../pipes/restaurant-filter.pipe';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { RestaurantFormComponent } from '../restaurant-form/restaurant-form.component';
import { RestaurantsService } from '../services/restaurant-service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

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
  ) { }

  ngOnInit() {
    this.restaurantsService.getAll().subscribe({

      next: (rests) => (
        this.restaurants = rests),
      error: (error) => console.error(error),
      complete: () => console.log('Restaurants loaded'),
    });
  }

  addRestaurant(restaurant: Restaurant) {
    this.restaurantsService.create(restaurant).subscribe(
      (response) => {
        this.restaurants = [...this.restaurants, response];
      },
      (error) => console.log(error)
    );
  }

  deleteRestaurant(restaurant: Restaurant) {

    const id = Number(restaurant.id);
    console.log('Deleting rest with id: ' + id);

    this.restaurantsService.delete(id).subscribe(
      (response) => {
        this.restaurants = this.restaurants.filter((r) => r !== restaurant);
      },
      (error) => {
        console.log(error)
        Swal.fire({
          title: 'And error have ocurred',
          text: 'Sorry, we could not delete restarant',
          icon: 'error',
          cancelButtonText: 'Ok'
        });

      }
    );
    this.restaurants = this.restaurants.filter((r) => r !== restaurant);
  }
}
