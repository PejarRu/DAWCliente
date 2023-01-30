import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Restaurant } from '../interfaces/restaurant';
import { Router } from '@angular/router';

@Component({
  selector: 'fs-restaurant-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.css'],
})
export class RestaurantCardComponent {
  @Output() deleted = new EventEmitter<void>();
  @Input() restaurant!: Restaurant;

  readonly days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekDay: number = new Date().getDay();
  constructor(private readonly router: Router) { }
  
  delete() {
    this.deleted.emit();
  }

}
