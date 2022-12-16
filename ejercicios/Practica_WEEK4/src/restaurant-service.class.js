import { Http } from "./http.js";
import { SERVER } from "./constants.js";

export class RestaurantService {
    #http;

    constructor() {
        this.#http = new Http();
    }

    async getAll() {
        const response = await this.#http.get(`${SERVER}/restaurants`);
        return response.restaurants;
    }

    async post(restaurant) {
        const response = await this.#http.post(`${SERVER}/restaurants`, restaurant);
        return response.restaurant;
    }

    async delete(id) {
        await this.#http.delete(`${SERVER}/restaurants/${id}`);
    }
}
