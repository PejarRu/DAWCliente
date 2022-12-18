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
        (document.querySelector("#password") as HTMLInputElement).value ="";
        (document.querySelector("#password2") as HTMLInputElement).value ="";
    } catch (error) {
        console.error(error);
    }
}
init();

//PROFILE FORM
const formProfile = document.querySelector("#form-profile") as HTMLFormElement;
formProfile.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();

    const validation = [util.validateEmail(formProfile), util.validateName(formProfile)];
    if (validation.every(v => v)) {
        await userService.saveProfile(
            (formProfile.name as unknown as HTMLInputElement).value, formProfile.email.value
        );
        init();

        alert("Email and name edited!");
    } else {
        alert("Something went wrong");

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

        alert("Password edited!");
    } else {
        alert("Something went wrong");

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
        init();

        alert("Avatar edited!");
    } catch (error) {
        alert("Something went wrong");
        console.error(error);
    }
});









