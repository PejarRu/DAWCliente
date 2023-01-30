import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  RouterModule } from '@angular/router';

import { RestaurantsPageComponent } from './restaurants/restaurants-page/restaurants-page.component';

@Component({
  selector: 'fs-root',
  standalone: true,
  imports: [
    CommonModule, 
    RestaurantsPageComponent, 
    RouterModule, 
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FoodScore';
}
