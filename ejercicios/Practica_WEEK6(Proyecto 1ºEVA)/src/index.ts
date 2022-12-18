// CSS & BOOTSTRAP
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../styles.css";
"use strict";
// HTTP(Ajax)
import { RestaurantService } from "./classes/restaurant-service";
// Constants & Interface $ Handlebars
import { Restaurant } from "./interfaces/restaurant";
import { AuthService } from "./classes/auth-service";
//If user is not logged, redirect
if (!localStorage.getItem("token")) {
    location.assign("login.html");
}
//Logout button
const logoutButton = document.querySelector("#logout");
logoutButton.addEventListener("click", function (event) {
    const authService = new AuthService;
    authService.logout();
});

const restaurantService = new RestaurantService();
let restaurants: Restaurant[];

async function getRestaurants(): Promise<void> {
    restaurants = await restaurantService.getAll() as Restaurant[];
    
    showRestaurants(restaurants);
}

const container = <HTMLDivElement>document.getElementById("placesContainer");
function showRestaurants(restaurants: Restaurant[]): void {
    container.replaceChildren(...restaurants.map(e =>
        restaurantService.restaurant2HTML(e))
    );
}
getRestaurants();

// ######### OPTIONAL: Search cards #########
const searchInput = <HTMLInputElement>document.getElementById("search");
searchInput.addEventListener("keyup", () => {
    const filtered = restaurants.filter((rest: Restaurant) =>
        rest.name.toLocaleLowerCase().includes(searchInput.value.toLocaleLowerCase()) ||
        rest.description.toLocaleLowerCase().includes(searchInput.value.toLocaleLowerCase()));
    showRestaurants(filtered);
});
// ######### OPTIONAL: Search cards #########
