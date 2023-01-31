import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  RouterModule } from '@angular/router';
import { RouterLinkActive } from '@angular/router';


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

}
