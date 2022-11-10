"use strict";
//CSS & BOOTSTRAP
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import css from "../styles.css";

import { RestaurantService } from "./restaurant-service.class.js";

const formRestaurant = document.getElementById("newRestaurant");
const imgPreview = document.getElementById("imgPreview");

const restaurantService = new RestaurantService();

formRestaurant.image.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  if (file) reader.readAsDataURL(file);

  reader.addEventListener("load", (e) => {
    imgPreview.classList.remove("d-none");
    imgPreview.src = reader.result;
  });
});

formRestaurant.addEventListener("submit", async (event) => {
  event.preventDefault();
  const daysOpen = Array.from(formRestaurant.days)
    .filter((dc) => dc.checked)
    .map((dc) => +dc.value);

  const validations = [
    validateName(),
    validateDescription(),
    validateCuisine(),
    validateDays(daysOpen),
    validatePhone(),
    validateImage(),
  ];

  if (validations.every((v) => v === true)) {
    // Check all validations
    // Create object to pass to SERVER
    const newRestaurant = {
      name: formRestaurant.name.value,
      description: formRestaurant.description.value,
      daysOpen: daysOpen,
      cuisine: formRestaurant.cuisine.value,
      phone: formRestaurant.phone.value,
      image: imgPreview.src,
    };

    try {
      // Will call http://SERVER/restaurants using ‘POST’, and send the received restaurant.
      await restaurantService.post(newRestaurant);
    } catch (error) {
      console.error("Error while POST new rest", error)
    }
    location.assign("./index.html");
  }
});

function testInputExpr(input, regExpr) {
  input.classList.remove("is-valid", "is-invalid");
  const valid = regExpr.test(input.value);
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
  const daysError = document.getElementById("daysError");
  if (!daysArray.length) {
    daysError.classList.remove("d-none");
  } else {
    daysError.classList.add("d-none");
  }
  return daysArray.length > 0;
}

function validateImage() {
  const imgInput = document.getElementById("image");

  imgInput.classList.remove("is-valid", "is-invalid");
  if (imgInput.files.length > 0) {
    imgInput.classList.add("is-valid");
    return true;
  } else {
    imgInput.classList.add("is-invalid");
    return false;
  }
}
