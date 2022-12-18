// CSS & BOOTSTRAP
import "../styles.css";
"use strict";
// HTTP(Ajax)
import { RestaurantService } from "./classes/restaurant-service";
import { UserService } from "./classes/user-service";
// Constants & Interface $ Handlebars
import { Restaurant } from "./interfaces/restaurant";
import { MapService } from "./classes/map-service";
import { AuthService } from "./classes/auth-service";
import { User } from "./interfaces/user";

//If user is not logged, redirect
if (!localStorage.getItem("token")) {
    location.assign("login.html");
}
//Logout button
const logoutButton = document.querySelector("#logout");
logoutButton.addEventListener("click", () => {
    const authService = new AuthService;
    authService.logout();
});

const userService = new UserService();
const restaurantService = new RestaurantService();
let restaurant: Restaurant;
const params = new URLSearchParams(window.location.search);
const id = params.get("id") as unknown as number;

async function getRestaurant(): Promise<void> {
    try {
        restaurant = await restaurantService.get(id);
    } catch (error) {
        location.assign("index.html");
    }
    showRestaurants(restaurant);
    console.log(restaurant);

}

async function showRestaurants(restaurant: Restaurant): Promise<void> {
    const container = <HTMLDivElement>document.getElementById("cardContainer");
    container.replaceChildren(restaurantService.restaurant2HTML(restaurant));
}

getRestaurant().then(() => {
    showMap();
    showOwner();

});

async function showMap(): Promise<void> {
    const pAddress = document.getElementById("address") as HTMLInputElement;
    pAddress.textContent = restaurant.address;


    const coords:
        {
            latitude: number,
            longitude: number
        } = {
            latitude: restaurant.lat,
            longitude: restaurant.lng
        };
    const mapService = MapService.createMapService(coords, "map");
    mapService.createMarker(coords, "red");

    const mapView = mapService.getMapView();
}


async function showOwner(): Promise<void> {

    const divName = document.getElementById("creatorName") as HTMLElement;
    const divEmail = document.getElementById("creatorEmail") as HTMLElement;
    const divImg = document.getElementById("creatorImg") as HTMLImageElement;

    divName.textContent = restaurant.creator.name;
    divEmail.textContent = restaurant.creator.email;
    divImg.src = restaurant.creator.avatar;
}

