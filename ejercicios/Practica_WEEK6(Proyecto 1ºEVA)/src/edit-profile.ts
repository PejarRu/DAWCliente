import Swal from "sweetalert2";
import "../styles.css";
import { AuthService } from "./classes/auth-service";
import { UserService } from "./classes/user-service";
import { Utils } from "./classes/utils-service";
import { User } from "./interfaces/user";

//If user is not logged, redirect
if (!localStorage.getItem("token")) {
    location.assign("login.html");
}
//Logout button
const logoutButton = document.querySelector("#logout");
logoutButton.addEventListener("click", function (event) {
    const authService = new AuthService;
    authService.logout();
});
const userService = new UserService();
const util = new Utils();
let user: User;

//DATA LOAD
//! This following does not work properly. There are times when user do not updated with the real value from server
async function init(): Promise<void> {
    try {
        user = await userService.getMyProfile();
        //CLEANING ALL PREVIOUS DATA FROM IMPUTS
        //Image Preview will not be show until image is seleced
        (document.querySelector("#imgPreview") as HTMLImageElement).classList.add("d-none");
        //Set email & name input to current values
        (document.querySelector("#name") as HTMLInputElement).value = user.name;
        (document.querySelector("#email") as HTMLInputElement).value = user.email;
        //Current profile photo is showing
        (document.querySelector("#photo") as HTMLImageElement).src = user.avatar;
        //Clean password input
        (document.querySelector("#password") as HTMLInputElement).value = "";
        (document.querySelector("#password2") as HTMLInputElement).value = "";
    } catch (error) {
        console.error(error);
        Swal.fire({
            title: "An error ocurred",
            text: "We apologize. Some type of error ocurred",
            icon: "error"
        });
    }

}
init();

//PROFILE FORM
const formProfile = document.querySelector("#form-profile") as HTMLFormElement;
formProfile.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();

    const validation = [util.validateEmail(formProfile), util.validateName(formProfile)];
    if (validation.every(v => v)) {

        //! This following does not capture any error from the server responses. In order to capture the error, 
        //! the function "put" and "http" from http.class should be modified
        await userService.saveProfile(
            (formProfile.name as unknown as HTMLInputElement).value,
            formProfile.email.value,
        ).then(() => {
            console.log("succed (possibly error)");
            // ! The following code does not work. It executes every time even if an error was thrown in http.class
            //user.name = (formProfile.name as unknown as HTMLInputElement).value;
            //user.email = formProfile.email.value;
            Swal.fire({
                title: "Done",
                text: "Email have been changed",
                icon: "success"
            });
        }).catch((error) => {
            console.log(error);

            Swal.fire({
                title: "An error ocurred",
                text: error.message,
                icon: "error"
            });
        });

        init();

    } else {
        Swal.fire({
            title: "Incorrect data",
            text: "Email or name is empty or incorrect",
            icon: "warning"
        });

    }
});
//PASSWORD FORM
const formPassword = document.querySelector("#form-password") as HTMLFormElement;
formPassword.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();

    const validation = [util.validatePassword(formPassword), util.validateRePassword(formPassword)];

    if (validation.every(v => v)) {
        await userService.savePassword(formPassword.password.value);
        init();
        Swal.fire({
            title: "Password edited",
            text: "Password have been changed!",
            icon: "info"
        });
    } else {
        if (validation[0] === false) {
            Swal.fire({
                title: "Incorrect data",
                text: "Password dont have correct format",
                icon: "warning"
            });
        } else {
            Swal.fire({
                title: "Incorrect data",
                text: "Password dont match",
                icon: "warning"
            });
        }

    }
});

//AVATAR FORM
const formAvatar = document.querySelector("#form-photo") as HTMLFormElement;
// Preview funtion
Utils.imagePreview(formAvatar.image);
formAvatar.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();
    try {
        user.avatar = await userService.saveAvatar(
            await Utils.imageTo64((formAvatar.image as HTMLInputElement).files[0])
        );
        Swal.fire({
            title: "Avatar edited",
            text: "Avatar have been changed!",
            icon: "info"
        });
    } catch (error) {
        Swal.fire({
            title: "Sorry",
            text: "Something went wrong",
            icon: "error"
        });
        console.error(error);
    }
});









