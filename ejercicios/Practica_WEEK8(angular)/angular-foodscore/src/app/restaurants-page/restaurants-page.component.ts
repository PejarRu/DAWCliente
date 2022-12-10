import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Restaurant } from '../interfaces/restaurant';

@Component({
  selector: 'fs-restaurants-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restaurants-page.component.html',
  styleUrls: ['./restaurants-page.component.css']
})
export class RestaurantsPageComponent {
  imageName = '';

  readonly days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekDay: number = new Date().getDay();
  currentWeekDay: string = this.days[this.weekDay];
  daysOpen: boolean[] = (new Array(7)).fill(true);

  newRestaurant: Restaurant;
  restaurants: Restaurant[] = [
    {
      name: 'Restaurant 1',
      description: 'Description Rest 2',
      image: 'assets/rest1.jpg',
      cuisine: 'Italian',
      phone: '123123123',
      daysOpen: ['Mon', 'Wed', 'Sat'],
    },
    {
      name: 'Restaurant 2',
      description: 'Description Rest 2',
      image: 'assets/rest2.jpg',
      cuisine: 'Chinese',
      phone: '321321321',
      daysOpen: ['Wed', 'Sun', 'Mon',],
    },



  ];
  constructor() {
    this.newRestaurant = this.resetRestaurant();
  }

  addRestaurant() {
    this.newRestaurant.daysOpen = this.daysOpen.map((open, i) => open ? this.days[i] : '').filter(day => day !== '');
    console.log(this.newRestaurant.daysOpen)

    const newRestaurantCopy: Restaurant = this.newRestaurant;
    this.restaurants.push(newRestaurantCopy);
    this.imageName = '';
    this.newRestaurant = this.resetRestaurant();
  }

  changeImage(fileInput: HTMLInputElement) {
    if (!fileInput.files || fileInput.files.length === 0) { return; }
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', e => {
      this.newRestaurant.image = reader.result as string;
    });
  }

  /* 
  setRestaurant(name: string, image: string, cuisine: string, description: string, phone: string, daysOpen: string[]): Restaurant {
     return {
       name: name,
       image: image,
       cuisine: cuisine,
       description: description,
       phone: phone,
       daysOpen: daysOpen,
     };
   }
 */
  resetRestaurant(): Restaurant {
    return {
      name: '',
      image: '',
      cuisine: '',
      description: '',
      phone: '',
      daysOpen: [],
    };
  }

}
