import "../styles.css";
import { AuthService } from "./classes/auth-service";
import { MapService } from "./classes/map-service";
import { UserService } from "./classes/user-service";
import { User } from "./interfaces/user";

//If user is not logged, redirect
if (!localStorage.getItem("token")) {
    location.assign("login.html");
}
//Logout button
const logoutButton = document.querySelector("#logout");
logoutButton.addEventListener("click", function(event) {
    const authService = new AuthService;
    authService.logout();
});

const params = new URLSearchParams(window.location.search);
const id = params.get("id") as unknown as number;

const userService = new UserService();
let user: User;

async function getUser(): Promise<void> {
    if (id) {
        user = await userService.getProfile(id) as User;
        
    }else{
        user = await userService.getMyProfile() as User;

    }
    showUserProfil(user);
}

const container = <HTMLDivElement>document.getElementById("profile");

function showUserProfil(user: User): void {
    container.replaceChildren(userService.userToHTML(user));
}

getUser().then(()=>{
    showMap();
});


async function showMap(): Promise<void> {
    const coords:
        {
            latitude: number,
            longitude: number
        } = {
            latitude: user.lat,
            longitude: user.lng
        };
    const mapService = MapService.createMapService(coords, "map");
    mapService.createMarker(coords, "red");

    const mapView = mapService.getMapView();
}