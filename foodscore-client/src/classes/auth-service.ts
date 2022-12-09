// Dir: '/src/classes/auth-service.ts'
import { SERVER } from "../constants";
export class AuthService {
    private url : string = "http://${SERVER}/auth/login";


    /*
    This page login.html, will have a login form. In this form a user will enter email
    and password. Also, geolocate the user, and send the latitude and longitude of the
    user so it will be updated in the server.
    */
    async login(userLogin: UserLogin): Promise<void> {


        
    }
    async register(userInfo: User): Promise<void> {}
    async checkToken(): Promise<void> {}
    logout(): void {}
}
