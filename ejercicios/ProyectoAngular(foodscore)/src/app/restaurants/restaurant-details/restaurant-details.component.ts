import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Restaurant } from '../interfaces/restaurant';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantsService } from '../services/restaurant-service';
import { Comment } from 'src/app/interfaces/comment';
import { CommentCardComponent } from '../comments/comment-card/comment-card.component';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { CommentFormComponent } from '../comments/comment/comment-form.component';
import { userResolver } from 'src/app/users/resolvers/user.resolver';
import { AuthService } from 'src/app/auth/auth-service';
import { User } from 'src/app/interfaces/user';
import { Observable } from 'rxjs';
import { ArcgisMapComponent } from 'src/app/maps/arcgis-map/arcgis-map.component';
import { ArcgisMarkerDirective } from 'src/app/maps/arcgis-marker/arcgis-marker.directive';
import { ArcgisSearchDirective } from 'src/app/maps/arcgis-search/arcgis-search.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'fs-restaurant-details',
  standalone: true,
  imports: [
    CommonModule,
    CommentCardComponent,
    RestaurantCardComponent,
    CommentFormComponent,
    ArcgisMapComponent,
    ArcgisMarkerDirective,
    ArcgisSearchDirective,
  ],
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.css'],
})
export class RestaurantDetailsComponent implements OnInit {
  restaurant!: Restaurant;
  comments: Comment[] = [];
  mine = false;
  comented = true;
  address: string;
  latitude: number;
  longitude: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restaurantsService: RestaurantsService,
    private authService: AuthService,
  ) {

    this.address = '';
    this.latitude = 0
    this.longitude = 0;

  }

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.route.data.subscribe((data) => (this.restaurant = data['restaurant']));

    this.loadRestaurantData(id);
    this.checkIfMine(id);
    this.loadComments(id);
  }

  private loadRestaurantData(id: number): void {
    this.restaurantsService.getById(id).subscribe({
      next: (rest) => {
        this.restaurant = rest;
        this.address = rest.address;
        this.latitude = rest.lat;
        this.longitude = rest.lng;
      },
      error: (error) => console.error(error),
      complete: () => {
        console.log(`Restaurant ${id} loaded:`)
        console.log(this.restaurant)
    },
    });
  }

  private checkIfMine(id: number): void {
    if (this.restaurant.mine) {
      this.mine = true;
    } else {
      this.authService.getMyProfile().subscribe(user => {
        if (user.id === this.restaurant.creator) {
          this.mine = true;
        }
      });
    }
  }

  private loadComments(id: number): void {
    this.restaurantsService.getComments(id).subscribe({
      next: (comments) => (this.comments = comments),
      error: (error) => console.error(error),
      complete: () => {
        console.log(`Comments from restaurant ${id}:`);
        console.log(this.comments);
      },
    });

    this.comented = this.restaurant.commented ?? true;
  }

  deleteRestaurant(restaurantId: number) {
    let confirm = Swal.fire({
      title: 'Do you really want delete this restaurant?',
      text: 'Your restaurant will be deleted forever',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    });
    if (!confirm) {
      return
    }
    this.restaurantsService.delete(restaurantId).subscribe(
      () => { },
      (error) => console.log(error)
    );
    this.goBack();
  }

  editRestaurant(restaurantId: number) {
    this.router.navigate(['/restaurants', restaurantId, 'edit']);
  }

  addNewComment(newComment: Comment) {
    if (this.comented) {
      Swal.fire({
        title: 'You have alredy commented on this restaurant',
        text: 'Only 1 comment restaurant allowed',
        icon: 'warning',
        confirmButtonText: 'OK'
      })
      return

    }
    if (!newComment.stars || newComment.stars <= 0) {
      Swal.fire({
        title: 'No rating',
        text: 'You must set a rating',
        icon: 'warning',
        confirmButtonText: 'OK'
      })
      return

    }

    console.table(newComment);
    let id = this.restaurant.id as number;
    this.restaurantsService.addComment(id, newComment)
      .subscribe((result) => {
        console.log('posted comment on restaurant: ' + this.restaurant.id);
        this.comments.push(result);
      }, (error: Error) => {
        console.error(error);
      });
  }

  goBack() {
    this.router.navigate(['/restaurants']);
  }
}
