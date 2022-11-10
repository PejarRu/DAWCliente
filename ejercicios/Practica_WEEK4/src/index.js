'use strict'
//HTTP(Ajax) 
import { RestaurantService } from './restaurant-service.class.js'
//Constants
import { SERVER, WEEKDAYS } from './constants.js'

//HANDLEBARS 
import restaurantTemplate from '../templates/restaurants.hbs';
//CSS & BOOTSTRAP
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import css from '../styles.css'

const restaurantService = new RestaurantService()
showRestaurants()

// ######### OPTIONAL: Search cards #########
const searchInput = document.querySelector('input.form-control')
searchInput.addEventListener('input', searchCards)

async function searchCards (e) {
  e.preventDefault()
  const input = e.target.value
  const regex = /\S/g
  // If search input is not empty
  if (regex.test(input)) {
    const restaurantsArray = await loadData()
    const newData = restaurantsArray.filter((rest) => {
      return rest.name.toLowerCase().includes(input.toLowerCase()) ||
            rest.description.toLowerCase().includes(input.toLowerCase())
    })
    showRestaurants(newData)
  } else {
    showRestaurants()
  }
}
// ######### OPTIONAL: Search cards #########

// Devuelve objeto con un array de objetos restaurante
async function loadData () {
  try {
    const data = await restaurantService.getAll()
    return data
  } catch (error) {
    console.error("Error on loadData(): ", error);
  }
}

// Delete card by id
async function deleteCard (event) {
  const id = event.target.parentElement.parentElement.parentElement.id
  const name = event.target.nextElementSibling.textContent
  if (confirm(`Do you want to delete ${name}?`)) {
    restaurantService.delete(id)
    await loadData()
    showRestaurants()
  }
}

// Shows all restaurants from array
async function showRestaurants (restaurants) {
  if (restaurants === undefined) {
    restaurants = await loadData()
  }
  
  // Deleting all previuous HTML
  const container = document.getElementById('placesContainer')
  container.innerHTML = ''

  // Creating DOM elements for each RESTAURANT - START
  restaurants.forEach(arrayElem => {
    //If validation OK, Creating DOM elements for each RESTAURANT - START
    if (isRestaurantObj(arrayElem)) {
      //Create main div.col
      const divCol = document.createElement('div')
      divCol.classList.add('col')
      divCol.setAttribute('id', arrayElem.id)
      container.append(divCol)

      console.log(arrayElem.image);

      // SYNTAX USING HANDLEBARS
      let restHTML = restaurantTemplate({
        ...restaurant,
        image:  `${arrayElem.image}`,
        name: arrayElem.name,
        description: arrayElem.description,
        phone: arrayElem.phone,
        cuisineStyle: arrayElem.cuisine,
        daysStr: arrayElem.daysOpen.map(d => WEEKDAYS[d]).join(', '),
        openBool: arrayElem.daysOpen.toString().includes(new Date().getDay()),
      });

      divCol.innerHTML = restHTML
      
      container.append(divCol)
      
      divCol.querySelector("button").addEventListener("click", deleteCard);
      // Creating DOM elements for each RESTAURANT - END
    }
  })
}

function isRestaurantObj(object){
  const requiredKeys = ['id', 'name', 'description', 'daysOpen', 'phone', 'image', 'cuisine']
    // VALIDATION: Checking if passed array contains a restaurant object propeties
    for (const key in object) {
      if (requiredKeys.includes(key)) {
        requiredKeys[requiredKeys.indexOf(key)] = true
      }
    }
    return requiredKeys.every(k => k === true)
}