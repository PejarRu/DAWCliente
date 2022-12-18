import "../styles.css";
import { AuthService } from "./classes/auth-service";
import { User } from "./interfaces/user";
import { GeolocationService } from "./classes/geolocation-service";
import { Utils } from "./classes/utils-service";

const registerForm = document.getElementById("form-register") as HTMLFormElement;
const authService = new AuthService();
const formValidator = new Utils();
//If user is logged, redirect
if (localStorage.getItem("token")) {
    location.assign("index.html");
}

let coords: GeolocationCoordinates;
const latitude = 0;
const longitude = 0;
async function loadGeolocation(): Promise<void> {

    coords = await GeolocationService.getLocation();

    const latInput = registerForm.lat as HTMLInputElement;
    const lngInput = registerForm.lng as HTMLInputElement;

    const latitude = coords.latitude;
    const longitude = coords.longitude;

    latInput.value = latitude + "";
    lngInput.value = longitude + "";

}

loadGeolocation();

registerForm.addEventListener("submit", async event => {
    event.preventDefault();
    //Check if every field is not empty/null and is correct
    const validations = [formValidator.validateName(registerForm), formValidator.validateEmail(registerForm), formValidator.validatePassword(registerForm)];
    console.log("validate");

    if (validations.every(v => v)) { // Check all validations
        console.log("validate. ok");

        //Check if every both email are equal
        if (((registerForm.email2 as unknown as HTMLInputElement).value == (registerForm.email as unknown as HTMLInputElement).value)) {

            const newUser: User = {
                name: (registerForm.name as unknown as HTMLInputElement).value,
                email: (registerForm.email as unknown as HTMLInputElement).value,
                password: (registerForm.password as unknown as HTMLInputElement).value,
                avatar: imgPreview.src,
                lat: latitude,
                lng: longitude,
            };
            console.log(newUser);

            try {
                await authService.register(newUser);
                alert("You have been registered! :)");
                location.assign("login.html");
            } catch (regError) {
                //alert("Error while trying register!");
                const errorDisplay = document.getElementById("errorInfo") as HTMLParagraphElement;
                //Formating array of errors in to a <li>list</li> string and displaying in HTML 
                errorDisplay.innerHTML = regError.message.map(((error: string) => "<li>" + error.charAt(0).toUpperCase() + error.slice(1) + "</li>")).join("");
            }
        } else {
            alert("Emails don't match!");
        }
    }

});

//IMAGE PREVIEW
const imgPreview = document.getElementById("imgPreview") as HTMLImageElement;
Utils.imagePreview(registerForm.avatar);

