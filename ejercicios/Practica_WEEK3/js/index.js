'use strict'
import { RestaurantService } from "./restaurant-service.class.js";
import { WEEKDAYS, SERVER } from "./constants.js";

let restaurantService;
let data;
let restaurants;

restaurantService = new RestaurantService();

async function loadData(){
    data = await restaurantService.getAll();
    return data.restaurants
}
 showRestaurants()

//Delete card by id
function deleteCard(event){
    let id = event.target.parentElement.parentElement.parentElement.id
    console.log("Deleting " + id);
    restaurantService.delete(id);
    loadData()
    showRestaurants()
}

//Shows all restaurants from array
async function showRestaurants() {
    restaurants = await loadData()
    console.log(data);
    console.log(restaurants);
    //Deleting all previuous HTML
    let container = document.getElementById("placesContainer");
    container.innerHTML = "";

    //Iterrating array
    restaurants.forEach(restaurant => {
        console.log("a");
        let requiredKeys = ["id", "name", "description", "daysOpen", "phone", "image", "cuisine"];
        //VALIDATION: Checking if passed array contains a restaurant object propeties
        for (const key in restaurant) {
            if (requiredKeys.includes(key)) {
                requiredKeys[requiredKeys.indexOf(key)] = true;
            }
        }
        if (requiredKeys.every(k => k == true)) {
            //Creating DOM elements for each RESTAURANT - START
            //Restaurant variables from array
            let name = restaurant.name
            let description = restaurant.description
            let daysOpen = restaurant.daysOpen
            let phone = restaurant.phone
            let image = restaurant.image
            let cuisine = restaurant


            let col = document.createElement("div");
            col.classList.add("col");
            col.setAttribute("id", restaurant.id);
            container.append(col);

            let card = document.createElement("div");
            card.classList.add("card", "h-100", "shadow");
            col.append(card);

            let img = document.createElement("img");
            img.classList.add("card-img-top");
            img.src = image;
            card.append(img);

            let cardBody = document.createElement("div");
            cardBody.classList.add("card-body");
            card.append(cardBody);

            //Delete button will delete card
            let buttonDelete = document.createElement("button");
            buttonDelete.classList.add("btn", "btn-danger", "btn-sm", "float-end");
            buttonDelete.textContent = "Delete";
            buttonDelete.addEventListener("click", deleteCard)
            cardBody.append(buttonDelete);

            let cardTitle = document.createElement("h4");
            cardTitle.classList.add("card-title");
            cardTitle.textContent = name;
            cardBody.append(cardTitle);

            let cardText = document.createElement("p");
            cardText.classList.add("card-text");
            cardText.innerText = description;
            cardBody.append(cardText);

            let cardDays = document.createElement("div");
            cardDays.classList.add("card-text");
            cardBody.append(cardDays);

            let cardSmallDays = document.createElement("small");
            cardSmallDays.classList.add("text-muted");
            cardDays.append(cardSmallDays);

            let daysTitle = document.createElement("strong");
            daysTitle.innerText = "Opens: ";
            cardSmallDays.append(daysTitle);

            cardSmallDays.append(document.createTextNode(daysOpen.map(d => WEEKDAYS[d]).join(", ")));

            let openBadge = document.createElement("span");
            openBadge.classList.add("badge", "ms-2");
            cardDays.append(openBadge);

            if (daysOpen.includes(new Date().getDay())) {
                openBadge.innerText = "Open";
                openBadge.classList.add("bg-success");
            } else {
                openBadge.innerText = "Closed";
                openBadge.classList.add("bg-danger");
            }


            let cardPhone = document.createElement("div");
            cardPhone.classList.add("card-text");
            cardBody.append(cardPhone);

            let cardSmallPhone = document.createElement("small");
            cardSmallPhone.classList.add("text-muted");
            cardPhone.append(cardSmallPhone);

            let cardTitlePhone = document.createElement("strong");
            cardTitlePhone.innerText = "Phone: ";
            cardSmallPhone.append(cardTitlePhone);

            cardSmallPhone.append(document.createTextNode(phone));

            let cardFooter = document.createElement("div");
            cardFooter.classList.add("card-footer");
            card.append(cardFooter);

            let cardSmallCuisine = document.createElement("small");
            cardSmallCuisine.classList.add("text-muted");
            cardSmallCuisine.innerText = cuisine;
            cardFooter.append(cardSmallCuisine);

            
            //Creating DOM elements for each RESTAURANT - END

        }
    });

}

