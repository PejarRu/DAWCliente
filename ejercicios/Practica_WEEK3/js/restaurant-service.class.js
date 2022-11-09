'use strict'
import { Http } from "./http.js";
import { SERVER, TABLE } from "./constants.js";

export class RestaurantService {
    dbConnection
    constructor() {
        this.dbConnection = new Http();
    }
    
    //Will call http://SERVER/restaurants using ‘GET’ and return all restaurants.
    getAll() {
        console.log("Getting")
        return this.dbConnection.get(SERVER+TABLE)
    }

    //Will call http://SERVER/restaurants using ‘POST’, and send the received restaurant.
    post(restaurant) {
        console.log("Posting")
        return this.dbConnection.post(SERVER+TABLE, restaurant);
    }

    //Will call http://SERVER/restaurants using ‘DELETE’, and return empty response if OK
    delete(id) {
        console.log("Deliting: "  + id);
        return this.dbConnection.delete(SERVER+TABLE+"/"+id)
    }
}