// CSS & BOOTSTRAP
import "../styles.css";
"use strict";
// HTTP(Ajax)
import { RestaurantService } from "./classes/restaurant-service";
// Constants & Interface $ Handlebars
import { Restaurant } from "./interfaces/restaurant";
import { MapService } from "./classes/map-service";
import { AuthService } from "./classes/auth-service";
import { Comment } from "./interfaces/comment";
import Swal  from "sweetalert2";
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

const restaurantService = new RestaurantService();
let restaurant: Restaurant;
let comments: Comment[];
const params = new URLSearchParams(window.location.search);
const id = params.get("id") as unknown as number;

async function getRestaurant(): Promise<void> {
    try {
        restaurant = await restaurantService.get(id);
        comments = await restaurantService.getComments(id);
    } catch (error) {
        location.assign("index.html");
    }
    showRestaurants(restaurant);

}

//RESTAURANTS
async function showRestaurants(restaurant: Restaurant): Promise<void> {
    const container = <HTMLDivElement>document.getElementById("cardContainer");
    container.replaceChildren(restaurantService.restaurant2HTML(restaurant));

}

//COMMENTS
const commentContainer = <HTMLDivElement>document.getElementById("comments");
//Show comments
async function showComments(comments: Comment[]): Promise<void> {
    commentContainer.replaceChildren(...comments.map(e =>
        restaurantService.comment2HTML(e))
    );
}
getRestaurant().then(() => {
    showMap();
    showOwner();
    showComments(comments);
    if (restaurant.commented) {
        commentForm.classList.add("d-none");
    }
});
//Add comment
const commentForm = <HTMLFormElement>document.getElementById("commentForm");
commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newComment: Comment = {
        text: commentForm.comment.value,
        stars: Number(puntuacion),
    };

    try {
        await restaurantService.addComment(id, newComment);
        location.reload();
    } catch (error) {
        console.log("Error: " + error);
        Swal.fire({ 
            title: "Error ocurred",
            text: "Something went wrong"
        });
    }

});
//  Stars and value selection
const divStars = <HTMLFormElement>document.getElementById("stars");
let puntuacion: number = 0;
const stars = divStars.getElementsByTagName("span");

divStars.childNodes.forEach((span: HTMLSpanElement) => {
    if (span.tagName === "SPAN") {
        span.addEventListener("click", () => {
            puntuacion = span.dataset.score as unknown as number;
            //Change the icon of each span if it value is less than the selected
            for (let j = 0; j < stars.length; j++) {
                if (puntuacion <= (stars[j].dataset.score as unknown as number) - 1) {
                    stars[j].textContent = "☆";
                } else {
                    stars[j].textContent = "★";
                }
            }
        });
    }
});

async function showMap(): Promise<void> {
    const pAddress = document.getElementById("address") as HTMLInputElement;
    pAddress.textContent = restaurant.address;


    const coords:
        {
            latitude: number,
            longitude: number
        } =
    {
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
    divImg.src = restaurant.creator.avatar;
    divImg.src = restaurant.creator.avatar;

}



