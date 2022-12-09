import "../styles.css";

import { RestaurantService } from "./restaurant-service.class.js";

const restTemplate:(RestaurantHbs:any) => string = require ("../templates/restaurant.hbs");


const restaurantService = new RestaurantService();
const placesContainer = document.getElementById("placesContainer");
const searchInput = document.getElementById("search");

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

async function getrestaurants() {
    restaurants = await restaurantService.getAll();
    showRestaurants(restaurants);
}

function showRestaurants(restaurants) {
    placesContainer.replaceChildren(
        ...restaurants.map((e) => restaurant2HTML(e))
    );
}

function restaurant2HTML(restaurant) {
    const col = document.createElement("div");
    col.classList.add("col");

    const restHTML = restTemplate({
        ...restaurant,
        days: restaurant.daysOpen.map((d) => WEEKDAYS[d]).join(", "),
        open: restaurant.daysOpen.includes(new Date().getDay().toString()),
    });

    col.innerHTML = restHTML;

    col.querySelector("button").addEventListener("click", async (e) => {
        const del = confirm(
            "¿Are you sure you want to delete this restaurant?"
        );
        if (del) {
            try {
                await restaurantService.delete(restaurant.id);
                restaurants = restaurants.filter((r) => r.id !== restaurant.id);
                col.remove();
            } catch (e) {
                alert("Error deleting restaurant!");
                console.error(e);
            }
        }
    });

    return col;
}

// Main program

getrestaurants();

searchInput.addEventListener("keyup", (e) => {
    const filtered = restaurants.filter(
        (r) =>
            r.name
                .toLocaleLowerCase()
                .includes(searchInput.value.toLocaleLowerCase()) ||
            r.description
                .toLocaleLowerCase()
                .includes(searchInput.value.toLocaleLowerCase())
    );
    showRestaurants(filtered);
});
