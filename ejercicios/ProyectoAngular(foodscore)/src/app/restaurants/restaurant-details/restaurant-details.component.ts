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
import { SearchResult } from 'src/app/maps/interfaces/search-result';

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

    //Load the restaurant data
    this.restaurantsService.getById(id).subscribe({
      next: (rest) =>{
        this.restaurant = rest
        this.address = rest.address;
        this.latitude = rest.lat;
        this.longitude = rest.lng;
      },
      error: (error) => console.error(error),
      complete: () => console.log(`Restaurant ${id} loaded`),
    });
    if (this.restaurant.mine) {
      this.mine = true;
    } else {
      //Check id user id match with creator
      this.authService.getMyProfile().subscribe(user => {
        if (user.id === this.restaurant.creator) {
          this.mine = true;
        }
      });
    }

    //Load the comments
    this.restaurantsService.getComments(id).subscribe({
      next: (comments) => (
        this.comments = comments
      ),
      error: (error) => console.error(error),
      complete: () => {

        console.log(`Comments from restaurant ${id} loaded`)
        console.log(this.comments);
      },
    });
  }

  deleteRestaurant(restaurantId: number) {

    this.restaurantsService.delete(restaurantId).subscribe(
      () => { },
      (error) => console.log(error)
    );
    this.goBack();
  }

  editRestaurant(restaurant: Restaurant) {
    alert('Redirect to resturants/id/edit')
    this.router.navigate(['/restaurants', this.restaurant.id, 'edit']);

    /* this.restaurantsService.editRestaurant(restaurant).subscribe(
       () => { },
       (error) => console.log(error)
     );
    */
  }
  addNewComment(newComment: Comment) {
    newComment.date = new Date().toString();
    newComment.restaurant = this.restaurant.id;
    /*
    //Find my user data
    newComment.user = this.authService.getLoguedUserData() as unknown as User;
    */
    console.table(newComment);
    window.confirm('Log console. before Continue...')
    this.restaurantsService.addComment(this.restaurant.id as number, newComment).subscribe(
      () => {
        console.log('posted comment on restaurant: ' + this.restaurant.id);
        this.comments.push(newComment);
      });
  }

  goBack() {
    this.router.navigate(['/restaurants']);
  }

  /*
 deleteComment(comment: Comment) {
   const id = Number(comment.id);

   this.restaurantsService.deleteComment(id).subscribe(
     () => {},
     (error: any) => console.log(error)
   );
   this.goBack();
 }
*/
}
