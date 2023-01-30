import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Restaurant } from '../interfaces/restaurant';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantsService } from 'src/app/restaurants/services/restaurants.service';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';

@Component({
  selector: 'fs-restaurant-details',
  standalone: true,
  imports: [CommonModule, RestaurantCardComponent],
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.css'],
})
export class RestaurantDetailsComponent implements OnInit {
  restaurant!: Restaurant;

  constructor(
    private route: ActivatedRoute,
    private restaurantsService: RestaurantsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];

    this.restaurantsService.getRestaurant(id).subscribe({
      next: (rest) => (this.restaurant = rest),
      error: (error) => console.error(error),
      complete: () => console.log(`Restaurant ${id} loaded`),
    });
  }

  deleteRestaurant(restaurant: Restaurant) {
    const id = Number(restaurant.id);

    this.restaurantsService.deleteRestaurants(id).subscribe(
      () => {},
      (error) => console.log(error)
    );
    this.router.navigate(['/restaurants']);
  }

  goBack() {
    this.router.navigate(['/restaurants']);
  }
  /*
  // WE IMPLEMENT THE EDIT METHOD TO ROUTE TO EDIT FORM
  edit() {
    this.router.navigate(['/restaurants', this.restaurant.id, 'edit']); 
      // NOTICE ARRAY NOW HAS 3 ELEM, SO URL WOULD BE /restaurants/id/edit
  }
  */
}
