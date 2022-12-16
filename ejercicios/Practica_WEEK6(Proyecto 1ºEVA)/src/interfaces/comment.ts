import { User } from "./user";

export interface Comment {
    id?: number;
    stars: number;
    text: string;
    date?: string;
    user?: User;
}