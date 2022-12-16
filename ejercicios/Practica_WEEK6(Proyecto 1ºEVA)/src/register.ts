import "../styles.css";
import { AuthService } from "./classes/auth-service";
import { User } from "./interfaces/user";
import { GeolocationService } from "./classes/geolocation-service";

const registerForm = document.getElementById("form-register") as HTMLFormElement;
const imgPreview = document.getElementById("imgPreview") as HTMLImageElement;
const authService = new AuthService();

//If user is logged, redirect
if ( localStorage.getItem("token")) {
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

    //Check if every field is not empty/null
    //const validations = [validateName(), validateEmail(), validateEmail2(), validatePassword()];
    //if (validations.every(v => v)) { // Check all validations

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
            errorDisplay.innerHTML = regError.message.map(((error: string) => "<li>"+error.charAt(0).toUpperCase()+error.slice(1)+"</li>")).join("");
        }
    } else {
        alert("Emails don't match!");
    }

});

function validateName(): boolean {
    const empty = (registerForm.name as unknown as HTMLInputElement).value === "";
    const notNull = (registerForm.name as unknown as HTMLInputElement).value === null;
    return !empty && !notNull;
}

function validateEmail(): boolean {
    const empty = registerForm.email.value === "";
    const notNull = registerForm.email.value === null;
    return !empty && !notNull;
}

function validateEmail2(): boolean {
    const empty = registerForm.email.value === "";
    const notNull = registerForm.email.value === null;
    return !empty && !notNull;
}

function validatePassword(): boolean {
    const empty = registerForm.password.value === "";
    const notNull = registerForm.password.value === null;
    return !empty && !notNull;
}

registerForm.avatar.addEventListener("change", (event: Event) => {
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
