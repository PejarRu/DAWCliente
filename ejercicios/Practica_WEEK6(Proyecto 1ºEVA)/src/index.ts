// CSS & BOOTSTRAP
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../styles.css";
"use strict";
// HTTP(Ajax)
import { RestaurantService } from "./classes/restaurant-service";
// Constants & Interface $ Handlebars
import { Restaurant, RestaurantHbs } from "./interfaces/restaurant";
import { RestaurantsResponse } from "./interfaces/responses";
import { WEEKDAYS } from "./constants";
const restaurantTemplate: (r: RestaurantHbs) => string = require("./../handlebars/restaurant.hbs");

//If user is not logged, redirect
if (!localStorage.getItem("token")) {
    location.assign("login.html");
}

const restaurantService = new RestaurantService();
const container = <HTMLDivElement>document.getElementById("placesContainer");
const searchInput = <HTMLInputElement>document.getElementById("search");

let restaurants: Restaurant[];

async function getRestaurants() {
    restaurants = await restaurantService.getAll() as Restaurant[];
    showRestaurants(restaurants);
}

function showRestaurants(restaurants: Restaurant[]) {
    container.replaceChildren(...restaurants.map(e => restaurant2HTML(e)));
}

function restaurant2HTML(restaurant: Restaurant): string | Node {
    console.log(restaurant);
    
    const col: HTMLDivElement = document.createElement("div");
    col.classList.add("col");

    const restHTML = restaurantTemplate({
        ...restaurant,
        open: isOpen(restaurant),
        days: getDaysStr(restaurant),
        distanceStr: "12km",
        fullStars: [1],
        emptyStars: [1]
    });

    col.innerHTML = restHTML;

    if (restaurant.mine) {

        col.querySelector("button").addEventListener("click", async e => {
            console.log("B1");

            if (confirm("¿Are you sure you want to delete this restaurant?")) {
                try {
                    await restaurantService.delete(restaurant.id);
                    restaurants = restaurants.filter(r => r.id !== restaurant.id);
                    col.remove();

                } catch (e) {
                    alert("Error deleting restaurant!");
                    console.error(e);
                }
            }
        });
    }

    return col;
}

// Main program
getRestaurants();
// ######### OPTIONAL: Search cards #########
searchInput.addEventListener("keyup", () => {
    const filtered = restaurants.filter((rest: Restaurant) =>
        rest.name.toLocaleLowerCase().includes(searchInput.value.toLocaleLowerCase()) ||
        rest.description.toLocaleLowerCase().includes(searchInput.value.toLocaleLowerCase()));
    showRestaurants(filtered);
});
// ######### OPTIONAL: Search cards #########


function isOpen(restaurant: Restaurant): boolean {
    //Exapmle of value 'restaurant.daysOpen': 
    //(string[])[ "1", "2", "4", "5"]

    //Today's number of week-day
    const todayWeekDay: number = new Date().getDay(); //Eg: (int)6

    const isOpen: boolean = restaurant.daysOpen.includes(todayWeekDay as unknown as string) ? true : false;

    return isOpen;
}

function isMine(restaurant: Restaurant): boolean {
    return restaurant.creator.me;
}

function getDaysStr(restaurant: Restaurant, separator = ", "): string {
    //Exapmle of value 'restaurant.daysOpen': 
    //(string[])[ "1", "2", "4", "5"]
    const daysOpenStr: string = restaurant.daysOpen
        .map((value) => WEEKDAYS[value as unknown as number])
        .join(separator);
    return daysOpenStr;
}

function getDistanceStr(restaurant: Restaurant,): string {

    return "daysOpenStr";
}