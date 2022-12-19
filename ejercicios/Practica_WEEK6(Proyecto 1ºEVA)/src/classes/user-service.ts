import { Http } from "./http.class";
import { User } from "../interfaces/user";
import { UserResponse, UsersResponse } from "../interfaces/responses";
const userTemplate: (u: User) => string = require("../../handlebars/profile.hbs");

import { SERVER } from "../constants";

export class UserService {


    constructor(private dbConnection: Http = new Http()) { }

    /** Will call http://SERVER/"/users" using ‘GET’, and return USERS[] response if OK
     * @return {*}  {Promise<User[]>}
     * @memberof UserService
     */
    async getAllProfiles(): Promise<User[]> {
        console.log("user-service: getAllProfiles ");
        const resp = this.dbConnection.get<UsersResponse>(SERVER + "/users");
        return (await resp).users;
    }

    /** 
     * Retrieves a user profile by ID. 
     * @param {number} id - The ID of the user to retrieve.
     * @return {Promise<User>} A promise that resolves to the user object if successful, or rejects with an error if not.
     * @memberof UserService
     */
    async getProfile(id?: number): Promise<User> {
        console.log("user-service: getProfile: " + id);
        const resp = this.dbConnection.get<UserResponse>(SERVER + "/users" + "/" + id);
        return (await resp).user;
    }

    /**
     * Retrieves the current user's profile.
     * @return {Promise<User>} A promise that resolves to the user object if successful, or rejects with an error if not.
     * @memberof UserService
     */
    async getMyProfile(): Promise<User> {
        console.log("user-service: getMyProfile;");
        const resp = this.dbConnection.get<UserResponse>(SERVER + "/users/me");

        return (await resp).user;
    }

    /**
     * Saves the current user's profile.
     * @param {string} name - The name to save.
     * @param {string} email - The email to save.
     * @return {Promise<void>} A promise that resolves if the save was successful, or rejects with an error if not.
     * @memberof UserService
     */
    async saveProfile(name: string, email: string): Promise<void> {
        console.log("user-service: saveProfile: " + email + ", " + name + ";");
        this.dbConnection.put<UserResponse>(SERVER + "/users/me", { "email": email, "name": name });
    }

    /**
    * Saves the current user's avatar image.
    * @param {string} avatar64 - The avatar image as a base64-encoded string.
    * @return {Promise<string>} A promise that resolves to the URL of the saved avatar image if successful, or rejects with an error if not.
    * @memberof UserService
    */
    async saveAvatar(avatar64: string): Promise<string> {
        console.log("user-service: saveAvatar: <image64>;");
        const resp = this.dbConnection.put<Promise<string>>(SERVER + "/users/me/avatar", { "avatar": avatar64 });
        return (await resp);
    }


    /**
     * Saves the current user's password.
     * @param {string} password - The password to save.
     * @return {Promise<void>} A promise that resolves if the save was successful, or rejects with an error if not.
     * @memberof UserService
     */
    async savePassword(password: string): Promise<void> {
        console.log("user-service: savePassword: <password>;");
        this.dbConnection.put<UserResponse>(SERVER + "/users/me/password", { "password": password });
    }
    /**
    * Converts a user object to an HTML string or node.
    * @param {User} user - The user object to convert.
    * @return {string|Node} An HTML string or node representing the user.
    * @memberof UserService
    */
    userToHTML(user: User): string | Node {
        //console.log(user);
        const col: HTMLDivElement = document.createElement("div");
        const restHTML = userTemplate({ ...user });
        col.innerHTML = restHTML;
        return col.firstChild;
    }
}
