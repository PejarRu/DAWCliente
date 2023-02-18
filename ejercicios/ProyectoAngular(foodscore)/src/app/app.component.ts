import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  RouterModule } from '@angular/router';

import { RestaurantsPageComponent } from './restaurants/restaurants-page/restaurants-page.component';
import { AppMenuComponent } from './app-menu/app-menu.component';

@Component({
  selector: 'fs-root',
  standalone: true,
  imports: [
    CommonModule,
    RestaurantsPageComponent,
    AppMenuComponent,
    //Router module es nesario para el router-outlet
    RouterModule,
  ],

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FoodScore';
}
