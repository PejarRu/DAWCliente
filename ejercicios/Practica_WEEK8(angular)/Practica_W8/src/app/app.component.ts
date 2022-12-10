import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ProductListComponent } from './product-list/product-list.component';

@Component({
  selector: 'root',
  standalone: true,
  imports: [CommonModule, ProductListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})


export class AppComponent {
  title = 'Angular Products ';
}
