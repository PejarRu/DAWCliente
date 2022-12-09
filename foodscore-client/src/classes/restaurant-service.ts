// dir: classes/restaurant-service.ts //
import "../styles.css";
import { Restaurant } from "../interfaces/restaurant";
import { RestaurantResponse, RestaurantsResponse } from "../interfaces/responses";
import { Http } from "./http.class";
import { SERVER, WEEKDAYS, TABLE } from "../constants";

export class RestaurantService {

    private dbConnection:Http;

    constructor() {
        this.dbConnection = new Http();
    }

    // Will call http://SERVER/restaurants using ‘GET’ and return all restaurants.
    async getAll(): Promise<Restaurant[]> {
        console.log("Get All");
        const resp = await this.dbConnection.get(`${SERVER}${TABLE}`);
        return resp.restaurants;
    }
    // Will call http://SERVER/restaurants using ‘GET’ and return all restaurants.
    async get(id: number): Promise<Restaurant> {
        console.log("Get "+id);
        const resp = await this.dbConnection.get(`${SERVER}${TABLE}`);
        return resp.restaurants;
    }
    // Will call http://SERVER/restaurants using ‘POST’, and send the received restaurant.
    async post(restaurant: Restaurant): Promise<Restaurant> {
        console.log(`Posting ${restaurant.name}`);
        const resp = await this.dbConnection.post(SERVER + TABLE, restaurant);
        return resp.restaurant;
    }

    // Will call http://SERVER/restaurants using ‘DELETE’, and return empty response if OK
    async delete(id: number):Promise<void> {
        console.log("Deliting: " + id);
        return this.dbConnection.delete(SERVER + TABLE + `/${id}`);
    }
    // #### Optional START #### //
    // Will call http://SERVER/restaurants using ‘DELETE’, and return empty response if OK
    async getComments(restaurantId: number):Promise<Comment[]> {
        console.log("Loading comments on restaurant " + restaurantId);
        return this.dbConnection.delete(SERVER + TABLE + `/${restaurantId}`);
    }
    // Will call http://SERVER/restaurants using ‘DELETE’, and return empty response if OK
    async addComment(restaurantId: number, comment: Comment):Promise<Comment> {
        console.log("Commenting on restaurant " + restaurantId);
        return this.dbConnection.delete(SERVER + TABLE + `/${restaurantId}`);
    }
    // #### Optional END #### //

}
