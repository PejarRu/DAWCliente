import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantsPageComponent } from './restaurants-page/restaurants-page.component';

@Component({
  selector: 'fs-root',
  standalone: true,
  imports: [CommonModule, RestaurantsPageComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = "FoodScore";


}
