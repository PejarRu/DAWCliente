"use strict"
import { Http } from "./http.js"
import { SERVER, TABLE } from "./constants.js"

export class RestaurantService {
  #dbConnection
  constructor () {
    this.#dbConnection = new Http()
  }

  // Will call http://SERVER/restaurants using ‘GET’ and return all restaurants.
  async getAll () {
    console.log("Getting")
    const resp = await this.#dbConnection.get(`${SERVER}${TABLE}`)
    return resp.restaurants
  }

  // Will call http://SERVER/restaurants using ‘POST’, and send the received restaurant.
  async post (restaurant) {
    console.log(`Posting ${restaurant.name}`)
    const resp = await this.#dbConnection.post(SERVER + TABLE, restaurant)
    return resp.restaurant
  }

  // Will call http://SERVER/restaurants using ‘DELETE’, and return empty response if OK
  delete (id) {
    console.log("Deliting: " + id)
    return this.#dbConnection.delete(SERVER + TABLE + `/${id}`)
  }
}
