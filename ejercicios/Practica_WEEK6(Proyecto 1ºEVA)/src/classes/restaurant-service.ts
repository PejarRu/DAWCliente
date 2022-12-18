import { Http } from "./http.class";
import { Restaurant, RestaurantHbs } from "../interfaces/restaurant";
import { RestaurantsResponse, RestaurantResponse } from "../interfaces/responses";
const restaurantTemplate: (r: RestaurantHbs) => string = require("../../handlebars/restaurant.hbs");

import { SERVER, TABLE } from "../constants";
import { Utils } from "./utils-service";

const utils = new Utils();

export class RestaurantService {
    constructor(private dbConnection: Http = new Http()) { }

    // Will call http://SERVER/restaurants using ‘GET’ and return all restaurants.
    async getAll(): Promise<Restaurant[]> {
        console.log("rest-service: Getting All");
        const resp = this.dbConnection.get<RestaurantsResponse>(SERVER + TABLE);
        return (await resp).restaurants;
    }
    // Will call http://SERVER/restaurants using ‘GET’ and return one restaurant with id.
    async get(id: number): Promise<Restaurant> {
        console.log("rest-service: Getting " + id);
        const resp = this.dbConnection.get<RestaurantResponse>(SERVER + TABLE + "/" + id);
        return (await resp).restaurant;

    }

    // Will call http://SERVER/restaurants using ‘POST’, and send the received restaurant.
    async post(restaurant: Restaurant): Promise<Restaurant> {
        console.log(`rest-service: Posting restaurant '${restaurant.name}'`);
        const resp = await this.dbConnection.post<RestaurantResponse>(SERVER + TABLE, restaurant);
        return resp.restaurant;
    }


    // Will call http://SERVER/restaurants using ‘DELETE’, and return empty response if OK
    async delete(id: number): Promise<void> {
        console.log("rest-service: Deleting: " + id);
        return this.dbConnection.delete(SERVER + TABLE + "/" + id);
    }

    //      async getComments(restaurantId: number): Promise<Comment[]> // Optional

    //      async addComment(restaurantId: number, comment: Comment): Promise<Comment>  // Optional


    public restaurant2HTML(restaurant: Restaurant): string | Node  {
        const col: HTMLDivElement = document.createElement("div");
        col.classList.add("col");
    
        const restHTML = restaurantTemplate({
            ...restaurant,
            open: utils.isOpen(restaurant),
            days: utils.getDaysStr(restaurant),
            fullStars: utils.getFullStars(restaurant),
            emptyStars: utils.getEmptyStars(restaurant),
            distance: utils.getDistanceFormated(restaurant),
        });
    
        col.innerHTML = restHTML;
    
        if (restaurant.mine) {
            col.querySelector("button").addEventListener("click", async e => {
                if (confirm("¿Are you sure you want to delete this restaurant?")) {
                    try {
                        await this.delete(restaurant.id);
                        location.assign("index.html");
                    } catch (e) {
                        alert("Error deleting restaurant!");
                        console.error(e);
                    }
                }
            });
        }
        
        return col;
    }
}
