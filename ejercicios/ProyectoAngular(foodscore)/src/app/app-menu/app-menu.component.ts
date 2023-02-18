import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth-service';


@Component({
  selector: 'fs-app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterLinkActive,
  ],
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.css']
})
export class AppMenuComponent {

  isLoggedIn = false;
  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {

  }
  onClickLogout(): void {
    this.authService.logout()
    this.isLoggedIn = false;
  }

}


