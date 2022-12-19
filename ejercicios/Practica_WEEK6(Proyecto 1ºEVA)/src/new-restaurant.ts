import "../styles.css";
//Restaruant related
import { RestaurantService } from "./classes/restaurant-service";
import { Restaurant } from "./interfaces/restaurant";
//Form related
import { Utils } from "./classes/utils-service";
//Map related
import { GeolocationService } from "./classes/geolocation-service";
import { MapService } from "./classes/map-service";
import Swal from "sweetalert2";

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
    //console.log("----- COORDS ------");
    //console.log("Current user address: \n" + direccion);
    //console.table(currentUserLocation);
    //console.info("----- COORDS ------");

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
        const validations: { [key: string]: boolean } = {
            "name": formValidator.validateName(newRestForm),
            "description": formValidator.validateDescription(newRestForm),
            "phone": formValidator.validatePhone(newRestForm),
            "cuisine": formValidator.validateCuisine(newRestForm),
            //"days":formValidator.validateDaysFromHTML(newRestForm),
            "days": formValidator.validateDays(checkedDays),
            "image": formValidator.validateImage(newRestForm),
        };
        // //
        if (Object.values(validations).every(value => value)) { // Check all validations

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

                Swal.fire({
                    title: "Succed",
                    text: "Restaurant posted"
                });
                location.assign("restaurant-detail.html?id=" + newRestaurant.id);
            } catch (regError) {
                console.log(regError);
                const message = regError.message.map((error: string) => error.toString().charAt(0).toUpperCase() + error.slice(1)).join(", </br>");
                Swal.fire({
                    title: "Error ocurred",
                    //Formating array of errors in to a string and displaying in HTML 
                    html: message,
                    icon: "error",
                });
            }
        } else {
            const invalidFields = Object.entries(validations)
                .filter(([key, value]) => !value) // solo valores false
                .map(([key, value]) => key.charAt(0).toUpperCase() + key.slice(1) + " is empty or incorrect format"); // solo los nombres de los campos

            const errorString = invalidFields.join(", </br>");

            Swal.fire({
                title: "Data not correct",
                //Formating array of errors in to a string and displaying in HTML 
                html: errorString,
                icon: "warning",
            });
            //text: validations.filter(v=>!v.value).map(((input) => + error.charAt(0).toUpperCase() + error.slice(1) + "\n")).join("")
        }

    });
});
