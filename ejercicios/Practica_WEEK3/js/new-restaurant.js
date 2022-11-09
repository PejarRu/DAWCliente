'use strict'
import { RestaurantService } from "./restaurant-service.class.js";
import { SERVER, TABLE } from "./constants.js";
let restaurantService = new RestaurantService()

//The JS up from here is the solution of Week2 exercise
let formRestaurant = document.getElementById("newRestaurant");
let imgPreview = document.getElementById("imgPreview");

formRestaurant.image.addEventListener('change', loadImage);
formRestaurant.addEventListener('submit', validateForm);


function testInputExpr(input, expr) {
    input.classList.remove("is-valid", "is-invalid");
    let valid = expr.test(input.value);
    input.classList.add(valid ? "is-valid" : "is-invalid");
    return valid;
}

function validatePhone() {
    return testInputExpr(formRestaurant.phone, /^[0-9]{9}$/);
}

function validateName() {
    return testInputExpr(formRestaurant.name, /^[a-z][a-z ]*$/i);
}

function validateDescription() {
    return testInputExpr(formRestaurant.description, /\S/);
}

function validateCuisine() {
    return testInputExpr(formRestaurant.cuisine, /\S/);
}

function validateDays(daysArray) {
    let daysError = document.getElementById('daysError');
    if(!daysArray.length)
        daysError.classList.remove('d-none');
    else
        daysError.classList.add('d-none');
    return daysArray.length > 0;
}

function validateImage() {
    let imgInput = document.getElementById("image");

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
    let daysOpen =  Array.from(formRestaurant.days).filter(dc => dc.checked).map(dc => +dc.value);

    let validations = [validateName(), validateDescription(), validateCuisine(), validateDays(daysOpen), validatePhone(), validateImage()];

    if (validations.every(v => v === true)) { // Check all validations
        //Create object to pass to SERVER
        let newRestaurant = {
            "name":formRestaurant.name.value,
            "description" : formRestaurant.description.value,
            "daysOpen" : daysOpen,
            "cuisine" : formRestaurant.cuisine.value,
            "phone" : formRestaurant.phone.value,
            "image" : imgPreview.src
        }

        //Will call http://SERVER/restaurants using ‘POST’, and send the received restaurant.
        await restaurantService.post(newRestaurant);

        location.assign("./index.html")

        /* This code is obsolete as we are redirected to index.html
        formRestaurant.reset();
        imgPreview.classList.add("d-none");

        document.querySelectorAll(".form-control").forEach(
            input => input.classList.remove("is-valid", "is-invalid")
        );
        document.getElementById('daysError').classList.add('d-none');
        */

       

    }
}

function loadImage(event) {
    let file = event.target.files[0];
    let reader = new FileReader();

    if (file) reader.readAsDataURL(file);

    reader.addEventListener('load', e => {
        imgPreview.classList.remove("d-none");
        imgPreview.src = reader.result;
    });
}


