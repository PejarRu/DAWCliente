export interface User {
    id?: number;
    name: string;
    email: string;
    password?: string;
    avatar: string;
    lat: number;
    lng: number;
    me?: boolean;
}

export interface UserLogin {
    email: string;
    password: string;
    lat?: number;
    lng?: number;
}
export interface LoginFormElements extends HTMLFormElement {
    email: HTMLInputElement;
    password: HTMLInputElement;
}

export interface RegisterFormElements extends HTMLFormElement {
    nameUser: HTMLInputElement;
    email: HTMLInputElement;
    password?: HTMLInputElement;
    avatar: HTMLInputElement;
    lat: number;
    lng: number;
}

