import { Comment } from "./comment";
import { Restaurant } from "./restaurant";
import { User } from "./user";

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
