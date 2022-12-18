import "../styles.css";
//Restaruant related
import { RestaurantService } from "./classes/restaurant-service";
import { Restaurant } from "./interfaces/restaurant";
//Form related
import { Utils } from "./classes/utils-service";
//Map related
import { GeolocationService } from "./classes/geolocation-service";
import { MapService } from "./classes/map-service";

//If user is not logged, redirect to login page
if (!localStorage.getItem("token")) {
    location.assign("login.html");
}
//RESTAURANT FORM
const newRestForm = document.getElementById("newRestaurant") as HTMLFormElement;

//IMAGE PREVIEW
const imgPreview = document.getElementById("imgPreview") as HTMLImageElement;
Utils.imagePreview(newRestForm.image);

//MAP
let latitude: number;
let longitude: number;
let inputAddress = " ";
async function showMap(): Promise<void> {
    //Se asigna la direcciona actual del usuario por defecto
    const currentUserLocation = await GeolocationService.getLocation();
    const mapService = MapService.createMapService(currentUserLocation, "map");
    const direccion: string = await mapService.getDireccion(currentUserLocation.longitude, currentUserLocation.latitude);
    latitude = currentUserLocation.latitude;
    longitude = currentUserLocation.longitude;
    const pAddress = document.getElementById("address") as HTMLInputElement;
    pAddress.value = direccion;

    //* Muestra datos relevantes
    console.log("----- COORDS ------");
    console.log("Current user location: \n" + direccion);
    //console.table(currentUserLocation);
    console.info("----- COORDS ------");

    mapService.createMarker(currentUserLocation, "red");

    const mapView = mapService.getMapView();

    mapView.on("click", event => {
        longitude = event.mapPoint.longitude;
        latitude = event.mapPoint.latitude;
        mapService.createMarker(event.mapPoint, "white");
        mapView.goTo({ center: [longitude, latitude] });
    });


    mapService.getSearch().on("select-result", e => {
        inputAddress = e.result.name;
        pAddress.value = inputAddress;

        const pointerCords = e.result.feature.geometry;

        latitude = pointerCords.get("latitude");
        longitude = pointerCords.get("longitude");
        mapService.getDireccion(longitude, latitude);
        mapService.createMarker({ latitude: latitude, longitude: longitude }, "green");        
    });


}

showMap().then(() => {


    //Const & Vars
    const restaurantService = new RestaurantService();
    newRestForm.addEventListener("submit", async event => {
        event.preventDefault();

        const checkedDays = Array.from(newRestForm.days)
            .filter((dc: HTMLInputElement) => dc.checked)
            .map((dc: HTMLInputElement) => +dc.value + "");

        //Check every field of form
        const formValidator = new Utils;
        const validations = [
            formValidator.validateName(newRestForm),
            formValidator.validateDescription(newRestForm),
            formValidator.validatePhone(newRestForm),
            formValidator.validateCuisine(newRestForm),
            //formValidator.validateDaysFromHTML(newRestForm),
            formValidator.validateDays(checkedDays),
            formValidator.validateImage(newRestForm),
        ];

        if (validations.every(v => v)) { // Check all validations

            //Create new restaurant object from FORM value inputs
            let newRestaurant: Restaurant = {
                name: (newRestForm.name as unknown as HTMLInputElement).value,
                description: newRestForm.description.value,
                cuisine: newRestForm.cuisine.value,
                daysOpen: checkedDays,
                image: imgPreview.src,
                phone: newRestForm.phone.value,
                address: inputAddress,
                lat: latitude,
                lng: longitude,
            };
            try {
                // eslint-disable-next-line no-debugger
                //debugger;
                newRestaurant = await restaurantService.post(newRestaurant);

                alert("Succed!");
                location.assign("restaurant-detail.html?id=" + newRestaurant.id);
            } catch (regError) {
                alert("Error ocurred!");
                //Formating array of errors in to a <li>list</li> string and displaying in HTML 
                alert(regError.message.map(((error: string) => + error.charAt(0).toUpperCase() + error.slice(1) + "\n")).join(""));
            }
        } else {
            alert("Something went wrong");
        }

    });
});
