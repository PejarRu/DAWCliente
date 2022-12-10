import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RestaurantsPageComponent } from './restaurants-page/restaurants-page.component';

@NgModule({

  imports: [
    AppComponent,BrowserModule,RestaurantsPageComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule {
  title = 'FoodScore'
}
