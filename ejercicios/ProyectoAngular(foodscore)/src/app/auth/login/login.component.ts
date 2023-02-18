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
import { Position } from 'src/app/shared/intefaces/coordinates';
@Component({
  selector: 'fs-login',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FbLoginDirective, RouterLink, FormsModule, GoogleLoginDirective],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginPageComponent {
  icons = { faGoogle, faFacebook }
  errorMessage = '';
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
          this.authService.setToken(result.accessToken)
          console.log('LoginOK. Redirecting...');
          this.router.navigate(['/restaurants']);
        },
        error => {
          console.log(error);

          // Login failed
          this.errorMessage = error.message.split(',').map((line: string) => line.charAt(0).toUpperCase() + line.slice(1)).join('<br>');
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
    console.log('loggin via gogle');

    // Send this token to your server for register / login
    console.log(user.getAuthResponse().id_token);
    console.log(user.getBasicProfile().getName());
    console.log(user.getBasicProfile().getEmail());
    console.log(user.getBasicProfile().getImageUrl());

    this.userInfo.token = user.getAuthResponse().id_token;
    this.userInfo.name = user.getBasicProfile().getName();
    this.userInfo.email = user.getBasicProfile().getEmail();
    this.userInfo.image = user.getBasicProfile().getImageUrl();

    console.table(user.getBasicProfile())
    console.table(user.getAuthResponse())

    this.authService.setToken(user.getAuthResponse().access_token)

    /*ç
    //First we try register user. Then if user is registered, we Log In
    this.authService.register({
      name: this.userInfo.name,
      email: this.userInfo.email,
      password: this.userInfo.token,
      avatar: this.userInfo.image,
      lat: this.location.lat,
      lng: this.location.lng,
    }
    )
      .subscribe(
        result => {
          // Login successful
          console.log('login correct');
          this.router.navigate(['/restaurants']);

        },
        error => {
          // Register failed
          this.errorMessage = error;
          //TODO: Implement login function
        }
      );
      */
  }

  fbUserInfo = {
    token: '',
    userId: '',
  };

  loggedFacebook(resp: fb.StatusResponse) {
    this.fbUserInfo.token = resp.authResponse.accessToken;
    this.fbUserInfo.userId = resp.authResponse.userID;
    // Send this to your server
    console.log(resp.authResponse.accessToken);
    this.authService.setToken(resp.authResponse.accessToken)
  }
  showError(error: any) {
    console.error(error);
    Swal.fire({
      title: 'An error have ocurred!',
      text: error.errorMessage,
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
      console.error('Geolocation is not supported by this browser.');
    }
  }
}
  /*
//If user is logged, redirect
if (localStorage.getItem("token")) {
location.assign("index.html");
}

let latitude = 0;
let longitude = 0;

loginForm.addEventListener("submit", async event => {
event.preventDefault();
//Check if every field is not empty/null and is correct
//const validations = [utils.validateName(loginForm), utils.validatePassword(loginForm)];
const validations = [true];

try {
    const coords = await GeolocationService.getLocation();
    latitude = coords.latitude;
    longitude = coords.longitude;
    localStorage.setItem("GeoCoords", coords as unknown as string + "esta linea esta en: login.ts(29)");

    // eslint-disable-next-line no-empty
} catch (error) {
    //Ignore
}

const userLogin: UserLogin = {
    email: (loginForm.email as unknown as HTMLInputElement).value,
    password: loginForm.password.value,
    lat: latitude,
    lng: longitude
};

if (validations.every(v => v)) { // Check all validations

    try {
        const token: TokenResponse = await authService.login(userLogin) as unknown as TokenResponse;
        localStorage.setItem("token", token.accessToken);
        location.assign("index.html");
    } catch (loginError) {
        Swal.fire({
            title: "Error",
            text: loginError,
            icon: "error"
        });
        const errorDisplay = document.getElementById("errorInfo") as HTMLParagraphElement;
        errorDisplay.innerHTML = loginError.error;
    }
}
});
*/
