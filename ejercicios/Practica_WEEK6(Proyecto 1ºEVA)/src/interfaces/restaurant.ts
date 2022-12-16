import { User } from "./user";

export interface Restaurant {
    id?: number;
    name: string;
    description: string;
    cuisine: string;
    daysOpen: string[];
    image: string;
    phone: string;
    creator?: User;
    mine?: boolean;
    distance?: number;
    commented?: boolean;
    stars?: number;
    address: string;
    lat: number;
    lng: number;
}
export interface RestaurantHbs extends Restaurant {
    open: boolean;
    days: string;
    distanceStr: string;
    fullStars: number[],
    emptyStars: number[],
    /*
    daysOpenStr(daysOpen: string[]):string;
    */
}