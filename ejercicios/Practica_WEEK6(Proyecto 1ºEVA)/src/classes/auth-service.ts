import { User, UserLogin } from "../interfaces/user";
import { Http } from "./http.class";
import { SERVER, TABLE } from "../constants";
import { TokenResponse, UserResponse } from "../interfaces/responses";

export class AuthService {
    constructor(private dbConnection: Http = new Http()) { }

    // Will call http://SERVER/auth/register using ‘POST’, and add the new user.
    async register(userInfo: User): Promise<void> {
        console.log("auth-service: Register new");
        return this.dbConnection.post(`${SERVER}/auth/register`, userInfo);
    }
    // Will call http://SERVER/auth/login using POST, and return a token
    async login(userLogin: UserLogin): Promise<void> {
        console.log("auth-service: Login");
        return this.dbConnection.post(`${SERVER}/auth/login`, userLogin);
    }

    // Will call http://SERVER/auth/validate using post, and check if token is valid
    async checkToken(): Promise<void> {
        console.log("auth-service: Check token");
        const token = localStorage.getItem("token");
        return this.dbConnection.post(`${SERVER}/auth/validate`, token);
    }

    // Will unset "token" from localStorage
    public logout(): void {
        console.log("auth-service: Logout");
        localStorage.removeItem("token");
        //location.reload();
    }
}
