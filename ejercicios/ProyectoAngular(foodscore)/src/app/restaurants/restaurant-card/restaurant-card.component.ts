import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Restaurant } from '../interfaces/restaurant';
import { Router } from '@angular/router';
import { RestaurantsService } from '../services/restaurant-service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'fs-restaurant-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.css'],
})
export class RestaurantCardComponent {
  @Output() deleted = new EventEmitter<void>();
  @Input() restaurant!: Restaurant;
  mine = false;
  readonly days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekDay: number = new Date().getDay();
  constructor(private readonly router: Router, private readonly restaurantsService: RestaurantsService) { }

  edit() {
    let mine = false
    if (!mine) {
      return
    }
    this.router.navigate(['/restaurants', this.restaurant.id, 'edit']);

  }

  delete() {
    let mine = false
    if (!mine) {
      return
    }

    let confirm = Swal.fire({
      title: 'Do you really want delete this restaurant?',
      text: 'Your restaurant will be deleted forever',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    });
    if (!confirm) {
      return
    }
    this.deleted.emit()
  }
}
