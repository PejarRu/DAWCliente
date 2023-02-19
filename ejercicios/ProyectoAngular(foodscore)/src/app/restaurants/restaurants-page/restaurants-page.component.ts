import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Restaurant } from '../interfaces/restaurant';
import { RestaurantFilterPipe } from '../pipes/restaurant-filter.pipe';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { RestaurantFormComponent } from '../restaurant-form/restaurant-form.component';
import { RestaurantsService } from '../services/restaurant-service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'fs-restaurants-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RestaurantCardComponent,
    RestaurantFormComponent,
    RestaurantFilterPipe,
  ],
  templateUrl: './restaurants-page.component.html',
  styleUrls: ['./restaurants-page.component.css'],
})
export class RestaurantsPageComponent implements OnInit {
  restaurants: Restaurant[] = [];
  onlyOpen = false;
  search = '';
  creatorId = '';
  creatorName: string = '';
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  // Initialize the component
  ngOnInit() {
    // Get the creator id from the query parameters
    this.route.queryParamMap.subscribe((params) => {
      this.creatorId = params.get('creator') ?? '';
      // Load restaurants for the creator, if the creator id is provided
      if (this.creatorId && this.creatorId != '') {
        this.loadRestaurantsByUser(
          this.creatorId as unknown as number);
      }
      // Otherwise, load all restaurants
      else {
        this.loadAllRestaurants();
      }
    });
  }

  // Load all restaurants
  loadAllRestaurants() {
    this.restaurantsService.getAll().subscribe({
      next: (rests) => {
        this.restaurants = rests;
      },
      error: (error) => console.error(error),
      complete: () => console.log('Restaurants loaded'),
    });
  }

  // Load restaurants for a specific creator
  loadRestaurantsByUser(creatorId: number) {
    // Get the user's name using the auth service
    this.authService.getProfile(creatorId).subscribe({
      next: (user) => {
        this.creatorName = user.name;
      },
      error: (error) => console.error(error),
      complete: () => console.log('User profile loaded'),
    });

    // Get the user's restaurants using the restaurant service
    this.restaurantsService.getByUser(creatorId).subscribe({
      next: (rests) => {
        this.restaurants = rests;
      },
      error: (error) => console.error(error),
      complete: () => console.log('Restaurants from user (' + creatorId + ') loaded'),
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
