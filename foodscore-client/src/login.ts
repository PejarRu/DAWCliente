import "../styles.css";
import { SERVER } from "./constants";

let userLogin : string = "http://${SERVER}/auth/login";
let userInfo : string = "http://${SERVER}/auth/login";

constructor(userLogin: UserLogin): Promise<void> {}, userInfo: User): Promise<void> {}) {
    this.userLogin = userLogin
    this.userInfo = userInfo
}    