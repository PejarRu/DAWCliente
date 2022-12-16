import { RestaurantService } from "./restaurant-service.class.js";

import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../styles.css";

const newPlaceForm = document.getElementById("newRestaurant");
const imgPreview = document.getElementById("imgPreview");
const restaurantService = new RestaurantService();

function testInputExpr(input, expr) {
    input.classList.remove("is-valid", "is-invalid");
    let valid = expr.test(input.value);
    input.classList.add(valid ? "is-valid" : "is-invalid");
    return valid;
}

function validatePhone() {
    return testInputExpr(newPlaceForm.phone, /^[0-9]{9}$/);
}

function validateName() {
    return testInputExpr(newPlaceForm.name, /^[a-z][a-z ]*$/i);
}

function validateDescription() {
    return testInputExpr(newPlaceForm.description, /\S/);
}

function validateCuisine() {
    return testInputExpr(newPlaceForm.cuisine, /\S/);
}

function validateDays(daysArray) {
    let daysError = document.getElementById("daysError");
    if(!daysArray.length)
        daysError.classList.remove("d-none");
    else
        daysError.classList.add("d-none");
    return daysArray.length > 0;
}

function validateImage() {
    let imgInput = newPlaceForm.image;

    imgInput.classList.remove("is-valid", "is-invalid");
    if(imgInput.files.length > 0) {
        imgInput.classList.add("is-valid");
        return true;
    } else {
        imgInput.classList.add("is-invalid");
        return false;
    }
}

async function validateForm(event) {
    event.preventDefault(); 
    let newRestaurant = {
        name: newPlaceForm.name.value,
        image: imgPreview.src,
        cuisine: newPlaceForm.cuisine.value,
        description: newPlaceForm.description.value,
        phone: newPlaceForm.phone.value,
        daysOpen: Array.from(newPlaceForm.days).filter(dc => dc.checked).map(dc => +dc.value)
    };

    let validations = [validateName(), validateDescription(), validateCuisine(), validateDays(newRestaurant.daysOpen), validatePhone(), validateImage()];

    if (validations.every(v => v === true)) { // Check all validations
        try{
            await restaurantService.post(newRestaurant);
            location.assign("index.html");
        } catch (e) {
            alert("Error creating restaurant!");
            console.error(e);
        }
    }
}

function loadImage(event) {
    let file = event.target.files[0];
    let reader = new FileReader();

    if (file) reader.readAsDataURL(file);

    reader.addEventListener("load", () => {
        imgPreview.classList.remove("d-none");
        imgPreview.src = reader.result;
    });
}

// MAIN

newPlaceForm.image.addEventListener("change", loadImage);
newPlaceForm.addEventListener("submit", validateForm);

