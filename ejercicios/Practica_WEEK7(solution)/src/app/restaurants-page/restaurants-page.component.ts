import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Restaurant } from '../interfaces/restaurant';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'fs-restaurants-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restaurants-page.component.html',
  styleUrls: ['./restaurants-page.component.css'],
})
export class RestaurantsPageComponent {
  restaurants: Restaurant[] = [];
  newRestaurant: Restaurant;
  readonly days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  daysOpen: boolean[] = (new Array(7)).fill(true);
  weekDay: number = new Date().getDay();
  imageName = '';

  constructor() {
    this.newRestaurant = this.resetRestaurant();
  }

  resetRestaurant() {
    return {
      name: '',
      description: '',
      image: '',
      cuisine: '',
      daysOpen: [],
      phone: ''
    };
  }

  changeImage(fileInput: HTMLInputElement) {
    if (!fileInput.files || fileInput.files.length === 0) { return; }
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', e => {
      this.newRestaurant.image = reader.result as string;
    });
  }

  addRestaurant() {
    this.newRestaurant.daysOpen = this.daysOpen.map((open, i) => open ? String(i) : '').filter(day => day !== '');
    this.restaurants.push(this.newRestaurant);
    this.newRestaurant = this.resetRestaurant();
    this.daysOpen.fill(true);
    this.imageName = '';
  }
}
