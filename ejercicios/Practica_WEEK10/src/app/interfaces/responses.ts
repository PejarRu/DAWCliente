import { Restaurant } from "../restaurants/interfaces/restaurant";
export interface ResponseRestaurants {
  restaurants: Restaurant[];
}

export interface ResponseRestaurant {
  restaurant: Restaurant;
}