// CSS & BOOTSTRAP
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../styles.css";
"use strict";
// HTTP(Ajax)
import { RestaurantService } from "./classes/restaurant-service";
// Constants & Interface $ Handlebars
import { Restaurant, RestaurantHbs } from "./interfaces/restaurant";
import { WEEKDAYS } from "./constants";
import { GeolocationService } from "./classes/geolocation-service";
import { MapService } from "./classes/map-service";
import * as geometry from "@arcgis/core/geometry";
const restaurantTemplate: (r: RestaurantHbs) => string = require("./../handlebars/restaurant.hbs");

const params = new URLSearchParams(window.location.search);
const id = params.get("id") as unknown as number;
if (!id) {
    location.assign("index.html");
}
const restaurantService = new RestaurantService();
const container = <HTMLDivElement>document.getElementById("cardContainer");
let restaurant: Restaurant;

async function getRestaurant():Promise<void> {
    try {
        restaurant = await restaurantService.get(id);
    } catch (error) {
        location.assign("index.html");
    }
    showRestaurantCard(restaurant);
}

function showRestaurantCard(restaurant: Restaurant):void {

    console.log(restaurant);

    const col: HTMLDivElement = document.createElement("div");
    col.classList.add("col");

    const restHTML = restaurantTemplate({
        ...restaurant,
        open: isOpen(restaurant),
        days: getDaysStr(restaurant),
        distanceStr: "12km",
        fullStars: [3],
        emptyStars: [2]
    });

    col.innerHTML = restHTML;

    if (restaurant.mine) {
        col.querySelector("button").addEventListener("click", async e => {
            console.log("B1");

            if (confirm("¿Are you sure you want to delete this restaurant?")) {
                try {
                    await restaurantService.delete(restaurant.id);
                    location.assign("index.html");
                } catch (e) {
                    alert("Error deleting restaurant!");
                    console.error(e);
                }
            }
        });
    }
    container.replaceChildren(col);
}

// Main program
getRestaurant();


const pAddress = document.getElementById("address") as HTMLInputElement;

async function showMap(): Promise<void> {
    let longitude = restaurant.lng;
    let latitude = restaurant.lat;
    const coords = {latitude, longitude};
    const mapService = MapService.createMapService(coords, "map");
    mapService.createMarker(coords, "red");

    const mapView = mapService.getMapView();

    mapView.on("click", event => {
        mapService.createMarker(event.mapPoint, "white");
        mapView.goTo({center: [event.mapPoint.longitude, event.mapPoint.latitude]});
    });

    mapService.getSearch().on("select-result", e => {

        pAddress.value = e.result.name;
        console.log(pAddress.value);

        const coords = e.result.feature.geometry; 
        latitude = coords.get("latitude");
        longitude = coords.get("longitude");
        mapService.createMarker({latitude, longitude}, "green");
    });

}
showMap();

function isOpen(restaurant: Restaurant): boolean {
    //Exapmle of value 'restaurant.daysOpen': 
    //(string[])[ "1", "2", "4", "5"]

    //Today's number of week-day
    const todayWeekDay: number = new Date().getDay(); //Eg: (int)6

    const isOpen: boolean = restaurant.daysOpen.includes(todayWeekDay as unknown as string) ? true : false;

    return isOpen;
}

function getDaysStr(restaurant: Restaurant, separator = ", "): string {
    //Exapmle of value 'restaurant.daysOpen': 
    //(string[])[ "1", "2", "4", "5"]
    const daysOpenStr: string = restaurant.daysOpen
        .map((value) => WEEKDAYS[value as unknown as number])
        .join(separator);
    return daysOpenStr;
}
/*
function getDistanceStr(restaurant: Restaurant, user: User): string {
    //Exapmle of value 'restaurant.daysOpen': 
    //(string[])[ "1", "2", "4", "5"]
    const daysOpenStr: string = restaurant.daysOpen
        .map((value) => WEEKDAYS[value as unknown as number])
        .join(separator);
    return daysOpenStr;
}
*/
