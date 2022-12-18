import { Http } from "./http.class";
import { User } from "../interfaces/user";
import { UserResponse, UsersResponse } from "../interfaces/responses";
const userTemplate: (u: User) => string = require("../../handlebars/profile.hbs");

import { SERVER } from "../constants";

export class UserService {
    
    
    constructor(private dbConnection: Http = new Http()) { }
    
    async getAllProfile(id?: number):Promise<User[]> {
        console.log("user-service: getProfile " + id);
        const resp = this.dbConnection.get<UsersResponse>(SERVER + "/users");
        return (await resp).users;
    }
    
    async getProfile(id?: number): Promise<User> {
        console.log("user-service: getProfile " + id);
        const resp = this.dbConnection.get<UserResponse>(SERVER + "/users" + "/" + id);
        return (await resp).user;
    }
    async getMyProfile(): Promise<User> {
        console.log("user-service: getMyProfile");
        
        const resp = this.dbConnection.get<UserResponse>(SERVER + "/users/me");

        return (await resp).user;
    }

    async saveProfile(name: string, email: string):Promise<void> {
        console.log("user-service: saveProfile:");
        this.dbConnection.put<UserResponse>(SERVER + "/users/me", {"email":email, "name": name});
    }

    async saveAvatar(avatar64: string):Promise<string> {
        console.log("user-service: saveAvatar:");
        const resp = this.dbConnection.put<Promise<string>>(SERVER + "/users/me/avatar", {"avatar":avatar64});
        return (await resp);
    }

    async savePassword(password: string):Promise<void> {
        console.log("user-service: savePassword:");
        this.dbConnection.put<UserResponse>(SERVER + "/users/me/password", {"password":password});
    }

    userToHTML(user: User): string | Node {
        //console.log(user);
        const col: HTMLDivElement = document.createElement("div");
        const restHTML = userTemplate({ ...user });
        col.innerHTML = restHTML;
        return col.firstChild;
    }
}
