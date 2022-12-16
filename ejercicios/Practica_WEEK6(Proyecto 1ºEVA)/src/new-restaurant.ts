import "../styles.css";
//Restaruant related
import { RestaurantService } from "./classes/restaurant-service";
import { Restaurant } from "./interfaces/restaurant";
//Form related
import { FormValidator } from "./classes/form-validators";
//Map related
import { GeolocationService } from "./classes/geolocation-service";
import { MapService } from "./classes/map-service";

//If user is not logged, redirect to login page
if (!localStorage.getItem("token")) {
    location.assign("login.html");
}

//Const & Vars
const restaurantService = new RestaurantService();
const newRestForm = document.getElementById("newRestaurant") as HTMLFormElement;
const imgPreview = document.getElementById("imgPreview") as HTMLImageElement;
const pAddress = document.getElementById("address") as HTMLInputElement;
let latitude = 0;
let longitude = 0;
let inputAddress:string;
async function showMap(): Promise<void> {
    const coords = await GeolocationService.getLocation();

    latitude = coords.latitude;
    longitude = coords.longitude;

    console.log(coords);
    console.log(latitude);
    console.log(longitude);

    const mapService = MapService.createMapService(coords, "map");
    mapService.createMarker(coords, "red");

    const mapView = mapService.getMapView();

    mapView.on("click", event => {
        mapService.createMarker(event.mapPoint, "white");
        mapView.goTo({center: [event.mapPoint.longitude, event.mapPoint.latitude]});
    });

    mapService.getSearch().on("select-result", e => {
        inputAddress = e.result.name;
        pAddress.value = inputAddress;
        console.log(pAddress.value);

        const coords = e.result.feature.geometry; 
        latitude = coords.get("latitude");
        longitude = coords.get("longitude");
        mapService.createMarker({latitude: latitude, longitude: longitude}, "green");
    });

}
showMap();

newRestForm.addEventListener("submit", async event => {
    event.preventDefault();

    const nameInput = document.getElementById("name") as HTMLInputElement;
    
    const checkedDays = Array.from(newRestForm.days)
        .filter((dc: HTMLInputElement) => dc.checked)
        .map((dc: HTMLInputElement) => +dc.value + "");

    //Check every field of form
    const formValidator = new FormValidator;
    const validations = [
        formValidator.validateName(nameInput),
        formValidator.validateDescription(newRestForm),
        formValidator.validatePhone(newRestForm),
        formValidator.validateCuisine(newRestForm),
        //formValidator.validateDaysFromHTML(newRestForm),
        formValidator.validateDaysFromArray(checkedDays),
        formValidator.validateImage(newRestForm),
    ];
    console.log(validations);

    if (validations.every(v => v)) { // Check all validations

        //Create new restaurant object from FORM value inputs
        let newRestaurant: Restaurant = {
            name: nameInput.value,
            description: newRestForm.description.value,
            cuisine: newRestForm.cuisine.value,
            daysOpen: checkedDays,
            image: imgPreview.src,
            phone: newRestForm.phone.value,
            address: inputAddress,
            lat: latitude,
            lng: longitude,
        };
        // * console.log(newRestaurant);
        //!dsa
        //?das 
        //TODO:DSA 
        try {
            newRestaurant = await restaurantService.post(newRestaurant);
            console.log( newRestaurant);
            
            location.assign("restaurant-detail.html?id=" + newRestaurant.id);
        } catch (regError) {
            alert("Error ocurred!");
            const errorDisplay = document.getElementById("errorInfo") as HTMLParagraphElement;
            //Formating array of errors in to a <li>list</li> string and displaying in HTML 
            errorDisplay.innerHTML = regError.message.map(((error: string) => "<li>" + error.charAt(0).toUpperCase() + error.slice(1) + "</li>")).join("");
        }
    } else {
        alert("Something went wrong");
    }

});

//IMAGE PREVIEW
newRestForm.image.addEventListener("change", (event: Event) => {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    if (file)
        reader.readAsDataURL(file);
    else
        imgPreview.classList.add("d-none");

    reader.addEventListener("load", () => {
        imgPreview.src = reader.result as string;
        imgPreview.classList.remove("d-none");
    });
});
