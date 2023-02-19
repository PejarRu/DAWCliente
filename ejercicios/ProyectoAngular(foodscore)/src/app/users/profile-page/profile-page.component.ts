import { Component, OnInit, Query } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/auth/auth-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { ArcgisMapComponent } from '../../maps/arcgis-map/arcgis-map.component';
import { ArcgisMarkerDirective } from '../../maps/arcgis-marker/arcgis-marker.directive';
import { ArcgisSearchDirective } from 'src/app/maps/arcgis-search/arcgis-search.directive';

@Component({
  selector: 'fs-profile-page',
  standalone: true,
  imports: [
    NgIf,
    CommonModule,
    ArcgisMapComponent,
    ArcgisMarkerDirective,
    ArcgisSearchDirective,
    RouterLink
  ],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  user!: User;
  me = false;
  latitude: number;
  longitude: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    this.latitude = 0
    this.longitude = 0;
  }
  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    this.route.data.subscribe((data) => (this.user = data['user']));

    //Load the restaurant data
    this.authService.getProfile(id).subscribe({
      next: (user) => {
        this.user = user
        console.log(user);
        this.latitude = user.lat;
        this.longitude = user.lng;
        this.me = user.me ?? false;
      },
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
      complete: () => console.log('User ' + id ?? '' + 'loaded'),
    });
    console.log(this.user);
    console.log('me: ?');
  }
}

