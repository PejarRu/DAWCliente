import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { FbLoginDirective } from 'src/app/facebook-login/fb-login.directive';
import { GoogleLoginDirective } from 'src/app/google-login/google-login.directive';
import Swal from 'sweetalert2';
import { AuthService } from '../auth-service';
import { NgModel, FormsModule } from '@angular/forms';
interface Position {
  lat: number,
  lng: number,
}
@Component({
  selector: 'fs-login',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FbLoginDirective, RouterLink, FormsModule, GoogleLoginDirective],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginPageComponent {
  icons = { faGoogle, faFacebook }
  email: string;
  password: string;
  location: Position;
  constructor(private readonly router: Router, private authService: AuthService) {
    this.email = '';
    this.password = '';
    this.location = { lat: 0, lng: 0 }
  }

  checkLogin() {

    this.authService.login(this.email, this.password, this.location.lat, this.location.lng)
      .subscribe(
        result => {
          // Login successful
          console.log('LoginOK. Redirecting...');
          this.router.navigate(['/restaurants']);
        },
        error => {
          console.log(error);
          switch (error.status) {
            case 401:
              this.showError('Incorrect username or password.')
              break;
            case 403:
              this.showError('Access denied.')
              break;
            default:
              let errorMessage = error.message.split(',').map((line: string) => line.charAt(0).toUpperCase() + line.slice(1)).join('<br>');
              this.showError('Access denied.' + errorMessage)
              break;
          }
        }
      );

  }

  userInfo = {
    token: '',
    name: '',
    email: '',
    image: '',
  };

  loggedGoogle(user: gapi.auth2.GoogleUser) {
    console.log('loggin via google');

    // Send this token to your server for register / login
    console.log(user.getAuthResponse().id_token);
    console.log(user.getBasicProfile().getName());
    console.log(user.getBasicProfile().getEmail());
    console.log(user.getBasicProfile().getImageUrl());

    this.userInfo.token = user.getAuthResponse().id_token;
    this.userInfo.name = user.getBasicProfile().getName();
    this.userInfo.email = user.getBasicProfile().getEmail();
    this.userInfo.image = user.getBasicProfile().getImageUrl();
  }

  fbUserInfo = {
    token: '',
    userId: '',
  };

  loggedFacebook(resp: fb.StatusResponse) {
    this.fbUserInfo.token = resp.authResponse.accessToken;
    this.fbUserInfo.userId = resp.authResponse.userID;
    // Send this to your server
    this.authService.setToken(resp.authResponse.accessToken)
    console.log(resp.authResponse.accessToken)
      this.authService.isLogged()
    //this.router.navigate(['/restaurants']);


  }

  showError(error: any) {
    console.error(error);
    Swal.fire({
      title: 'An error have ocurred!',
      text: error,
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      this.showError('Geolocation is not supported by this browser.');
    }
  }
}
