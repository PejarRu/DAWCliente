import "../styles.css";
import { AuthService } from "./classes/auth-service";
import { UserLogin } from "./interfaces/user";
import { GeolocationService } from "./classes/geolocation-service";
import { TokenResponse } from "./interfaces/responses";
import Swal from "sweetalert2";
const loginForm = document.getElementById("form-login") as HTMLFormElement;
const authService = new AuthService();

//If user is logged, redirect
if (localStorage.getItem("token")) {
    location.assign("index.html");
}

let latitude = 0;
let longitude = 0;

loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    //Check if every field is not empty/null and is correct
    //const validations = [utils.validateName(loginForm), utils.validatePassword(loginForm)];
    const validations = [true];

    try {
        const coords = await GeolocationService.getLocation();
        latitude = coords.latitude;
        longitude = coords.longitude;
        localStorage.setItem("GeoCoords", coords as unknown as string + "esta linea esta en: login.ts(29)");

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
            const token: TokenResponse = await authService.login(userLogin) as unknown as TokenResponse;
            localStorage.setItem("token", token.accessToken);
            location.assign("index.html");
        } catch (loginError) {
            Swal.fire({
                title: "Error",
                text: loginError,
                icon: "error"
            });
            const errorDisplay = document.getElementById("errorInfo") as HTMLParagraphElement;
            errorDisplay.innerHTML = loginError.error;
        }
    }
});

