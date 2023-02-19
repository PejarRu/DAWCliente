import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/auth/auth-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'fs-profile-page',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  user!: User;
  me = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) { }
  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    this.route.data.subscribe((data) => (this.user = data['user']));

    //Load the restaurant data
    this.authService.getProfile().subscribe({
      next: (user) => (
        this.user = user
      ),
      error: (error) => {
        console.error(error)
        Swal.fire({
          title: 'You cant do this!',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        //this.router.navigate(['/restaurants']);

      },
      complete: () => console.log(`User ${id} loaded`),
    });
    console.log(this.user);

    if (this.user?.me) {
      this.me = true;
    }
      /*
      //Check id user id match with creator
      let me = (this.authService.getLoguedUserData())
      if (this.restaurant.creator == me) {

      }
      */
    }
  }

  /*
  async getUser(): Promise<void> {

    const params = new URLSearchParams(window.location.search);
    //const id = params.get('id') as unknown as number;
    const id = +this.route.snapshot.params['id'];

    if (id) {
      this.user = await this.authService.getProfile(id) ;
    } else {
      this.user = await this.authService.getProfile();
    }
    this.showUserProfile();
    this.showMap();
  }
*/
  /*
    private showUserProfile(): void {
      const container = document.getElementById("profile") as HTMLDivElement;
      //container.replaceChildren(this.userService.userToHTML(this.user));
    }
  */
  /*
    private async showMap(): Promise<void> {
      const coords:
        {
          latitude: number,
          longitude: number
        } = {
        latitude: this.user.lat,
        longitude: this.user.lng
      };
      //const mapService = MapService.createMapService(coords, "map");
      //mapService.createMarker(coords, "red");

      //const mapView = mapService.getMapView();
    }
    */

