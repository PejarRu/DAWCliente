"use strict";
let titleRest = "Title of the restaurant?"
let descRest = "Description of the restaurant?"
let daysRest = "Mo, Tu, Fr?"
let openedRest = false
let phoneRest = "Phone?"
let styleRest = "Cuisine style?"
let imageBase64 = ""
// Complete the exercise

const newRestForm = document.querySelector("#newRestaurant");

newRestForm.addEventListener('submit', e => {
  e.preventDefault();
  //Variables
  let error = 0;

  error += checkName();

  error += checkDescription();

  error += checkCuisine();

  error += checkOpenDays();

  error += checkPhone() 

  error += checkImage() 

  //Creating new card with validated data
  if(!error){
    let imgSet = imageBase64!=""? true:false
    console.log("checkOpenDays: " + daysRest + 
    "\nOpenedCheck: " + openedRest + 
    "\nImageIsSet: " + imgSet + 
    "\nCheckCuisine: " + styleRest + 
    "\nChekedPhone: " + phoneRest +
    "\ncheckDescription: " + descRest + 
    "\nChekedTitle: " + titleRest)
    createCard(titleRest, descRest, daysRest, openedRest, phoneRest, styleRest);
  }
});

//Preview of the image
newRestForm.image.addEventListener('change', e => {
  let imgPrw = document.querySelector("#imgPreview")
  if (document.querySelector("#image").value == '') {
    imgPrw.className = "img-thumbnail d-none mb-3"
  }
  if(e.target.files.length) { 
    // If there's a at least one file selected
    const file = e.target.files[0];
  
    if(file.type.startsWith('image')) {
      let reader = new FileReader();
      reader.readAsDataURL(file); // Read in base64
  
      reader.addEventListener('load', e => {
        imgPrw.src = reader.result
        // We preview the image inside a <img> element in the HTML
        imgPrw.className = "img-thumbnail mb-3";
      });
    }
  }
})

function checkName(){
  //Checking name - START
  let nameRest = document.querySelector('input[name="name"]');  
  //Regex: First must be lette and everithing else onlu letter of space -> Aaaa, B bb, C c c...
  let regex = /^[A-Za-z]([a-zA-Z\s])*/g
  if (regex.test(nameRest.value)) {
    nameRest.className = "form-control is-valid"
    titleRest = nameRest.value;
    return 0;
  } 
  nameRest.className = "form-control is-invalid"

  return 1;
  //Checking name - END
}
function checkDescription(){
  //Checking description - START
  let descriptionRest = document.querySelector("#description");  
  //At least one char that is not whitespace 
  let regex = /^[\S]{1,}/g
  if (regex.test(descriptionRest.value) && descriptionRest.value.length > 1) {
    descriptionRest.className = "form-control is-valid"
    descRest = descriptionRest.value;

    return 0;
  }
    descriptionRest.className = "form-control is-invalid"

  return 1;
  //Checking description - END
}
function checkCuisine(){
  //Checking cuisine - START
  let cuisineRest = document.querySelector('input[name="cuisine"]');  
  //Regex: At least one char that is not whitespace
  let regex = /^[\S]{1,}/g
  if (regex.test(cuisineRest.value) && cuisineRest.value.length > 1) {
    cuisineRest.className = "form-control is-valid"
    styleRest = cuisineRest.value;
    return 0;
  }

  cuisineRest.className = "form-control is-invalid"
  return 1;
  //Checking cousine - END
}
function checkOpenDays() {
  //Checking opened days - START
  const daysToOpen = Array.from(newRestForm.days )
      .filter(input => input.checked)
      .map(input => input.id.substring(5,7));
    
  let daysError = document.getElementById("daysError")
  //Checking if it is opened today
  const weekdays = ["Su", "Mo","Tu","We","Th","Fr","Sa"];
  const today = weekdays[new Date().getDay()];
  
  if (daysToOpen.includes(today))
    openedRest = true
  else
    openedRest = false

  if (daysToOpen.length >= 1) {
    daysError.className = "text-danger d-none"
    daysRest = daysToOpen.toString(", ");
    return 0;
  }
    daysError.className = "text-danger"
    return 1;
    //Checking opened days - END
}
function checkPhone(){
  //Checking phone - START
  let phoneNum = document.querySelector("#phone"); 
  //let regex = /(\+?[0-9]2 ?)?[0-9]{9}/g;

  if (phoneNum.value.length >= 9) {
    phoneNum.className = "form-control is-valid"
    phoneRest = phoneNum.value
    return 0;
  }
  phoneNum.className = "form-control is-invalid"
  return 1;
  //Checking phone - END
}
function checkImage(){
  let imgElem = document.querySelector("#image")
  if (imgElem.value != '') {
    imgElem.className = "form-control is-valid"
    return 0;
  }
  imgElem.className = "form-control is-invalid"
  return 1;
}


function createCard(titleRes, descRes, daysRes, openRest,phoneRes,styleRes){
  //Create all elements - START
  let divMain = document.getElementById("placesContainer");
  let divCol = document.createElement("div");
    let divCard = document.createElement("div");
      let img = document.createElement("img");
      let divCard_body = document.createElement("div");
        let h4 = document.createElement("h4");
        let p = document.createElement("p");
        let divCard_text = document.createElement("div");
          let small1 = document.createElement("small");
            let strong1 = document.createElement("strong"); 
          let span1 = document.createElement("span");
        let divCard_text2 = document.createElement("div");
          let small2 = document.createElement("small");
            let strong2 = document.createElement("strong");
      let divCard_footer = document.createElement("div");
        let small3 = document.createElement("small");
  //Create all elements - END

 //Add all attributes and texts - START
 divCol.setAttribute("class", "card h-100 shadow")
 img.className = "card-img-top";
 img.setAttribute("id", "imgPreview")
 img.src = imageBase64;
 divCard_body.className = "card-body"
   h4.className = "card-title"
   h4.textContent = titleRes;
   p.className = "card-text"
   p.textContent = descRes
   divCard_text.className= "card-text"
     small1.className = "text-muted";
     strong1.textContent = "Opens: "
     small1.textContent = daysRes
     if(openRest){
       span1.className = "badge ms-2 bg-success"
       span1.textContent = "Opened"
     }else{
       span1.className = "badge ms-2 bg-danger"
       span1.textContent = "Closed"
     }
   divCard_text2.className= "card-text"
     small2.className = "text-muted"
     strong2.textContent = "Phone: "
     small2.textContent = phoneRes

 divCard_footer.className = "card-footer"
   small3.className = "text-muted"
   small3.textContent = styleRes
//Add all attributes and texts - END

//Appending all elements - START
divMain.prepend(divCol);
  divCol.append(divCard);
  divCard.append(
    img,
    divCard_body,
    divCard_footer);

    divCard_footer.append(small3)
    divCard_body.append(
      h4,
      p,
      divCard_text,
      divCard_text2)

      divCard_text.append(small1,span1);
        small1.prepend(strong1)

      divCard_text2.append(small2)
        small2.prepend(strong2)
  //Appending all elements - END
  resetForm()
  console.log("Created Card & Reseted Form")
}

function resetForm(){
  //Hiding imgPreview
  document.querySelector("#imgPreview").removeAttribute("src")
  document.querySelector("#imgPreview").className = "img-thumbnail d-none mb-3";
  //Reseting form inputs

  //Reseting variables
   titleRest = "Title of the restaurant?"
   descRest = "Description of the restaurant?"
   daysRest = "Mo, Tu, Fr?"
   openedRest = false
   phoneRest = "Phone?"
   styleRest = "Cuisine style?"
   imageBase64 = ""

  //Deleting all invalid & valid class and reseting values
  for (let elem of document.getElementsByClassName("form-control")) {
    elem.classList.remove("is-valid", "is-invalid");
    elem.value = "";
  }
  //newRestForm.reset();
  
  
}
