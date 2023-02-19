import { Restaurant } from "src/app/restaurants/interfaces/restaurant";
import { Comment } from "../../interfaces/comment";
import { User } from "../../interfaces/user";


export interface RestaurantsResponse {
    restaurants: Restaurant[];
}

export interface RestaurantResponse {
    restaurant: Restaurant;
}

export interface TokenResponse {
    accessToken: string;
}

export interface UserResponse {
    user: User;
}

export interface UsersResponse {
    users: User[];
}

export interface AvatarResponse {
    avatar: string;
}

export interface CommentsResponse {
    comments: Comment[];
}

export interface CommentResponse {
    comment: Comment;
}
