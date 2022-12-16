import "../styles.css";
import { AuthService } from "./classes/auth-service";
import { UserLogin } from "./interfaces/user";
import { GeolocationService } from "./classes/geolocation-service";
import { TokenResponse } from "./interfaces/responses";
const loginForm = document.getElementById("form-login") as HTMLFormElement;
const authService = new AuthService();

//If user is logged, redirect
if ( localStorage.getItem("token")) {
    location.assign("index.html");
}

let latitude = 0;
let longitude = 0;

loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    const validations = [validateName(), validatePassword()];
    try {
        const coords = await GeolocationService.getLocation();
        latitude = coords.latitude;
        longitude = coords.longitude;
    // eslint-disable-next-line no-empty
    } catch (error) {
        //Ignore
    }
    const userLogin: UserLogin = {
        email: (loginForm.email as unknown as HTMLInputElement).value,
        password: loginForm.password.value,
        lat: latitude,
        lng: longitude
    };

    if (validations.every(v => v)) { // Check all validations

        try {
            const token : TokenResponse = await authService.login(userLogin) as unknown as TokenResponse;
            localStorage.setItem("token", token.accessToken);           
            location.assign("index.html");
        } catch (loginError) {
            //alert("Error entering account! \n");
            const errorDisplay = document.getElementById("errorInfo") as HTMLParagraphElement;        
            errorDisplay.innerHTML = loginError.error;
        }
    }
});

function validateName(): boolean {
    let empty = (loginForm.email as unknown as HTMLInputElement).value === "";
    let notNull = (loginForm.email as unknown as HTMLInputElement).value === null;
    return !empty && !notNull;
}

function validatePassword(): boolean {
    let empty = loginForm.password.value === "";
    let notNull = loginForm.password.value === null;
    return !empty && !notNull;
}

