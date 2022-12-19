/* eslint-disable linebreak-style */
import { Restaurant } from "../interfaces/restaurant";
import { WEEKDAYS } from "../constants";
export class Utils {


    /** 
     * ValidatE passed string with passed regex. Set class to valid/invalid
     * @param {HTMLInputElement} input
     * @param {RegExp} regexp
     * @return {*}  {boolean}
     * @memberof Utils
     */
    public testInputExpr(input: HTMLInputElement, regexp: RegExp): boolean {
        input.classList.remove("is-valid", "is-invalid");
        const valid = regexp.test(input.value);
        input.classList.add(valid ? "is-valid" : "is-invalid");
        return valid;
    }

    /** 
     * @param {HTMLFormElement} form
     * @return {*}  {boolean}
     * @memberof Utils
     */
    public validateName(form: HTMLFormElement): boolean {
        return this.testInputExpr((form.name as unknown as HTMLInputElement), /\S/);
    }

    /** 
     * @param {HTMLFormElement} form
     * @return {*}  {boolean}
     * @memberof Utils
     */
    public validateEmail(form: HTMLFormElement): boolean {
        return this.testInputExpr(form.email, /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/);

    }

    /** 
     * @param {HTMLFormElement} form
     * @return {*}  {boolean}
     * @memberof Utils
     */
    public validatePhone(form: HTMLFormElement): boolean {
        return this.testInputExpr(form.phone, /^[0-9]{9}$/);
    }

    /** 
     * @param {HTMLFormElement} form
     * @return {*}  {boolean}
     * @memberof Utils
     */
    public validatePassword(form: HTMLFormElement): boolean {
        return this.testInputExpr(form.password, /\S/);
    }

    /** 
     * @param {HTMLFormElement} form
     * @return {*}  {boolean}
     * @memberof Utils
     */
    public validateRePassword(form: HTMLFormElement): boolean {
        return (form.password.value == form.password2.value) || (form.password.value == form.password2.value);
    }
    /**
     * @param {HTMLFormElement} form
     * @return {*}  {boolean}
     * @memberof Utils
     */
    public validateDescription(form: HTMLFormElement): boolean {
        return this.testInputExpr(form.description, /\S/);
    }

    /**
     * 
     * @param {HTMLFormElement} form
     * @return {*}  {boolean}
     * @memberof Utils
     */
    public validateCuisine(form: HTMLFormElement): boolean {
        return this.testInputExpr(form.cuisine, /\S/);
    }

    /**
     * Check if there is at least 1 checked day
     * @param {(HTMLFormElement | Array<string>)} days
     * @return {*}  {boolean}
     * @memberof Utils
     */
    public validateDays(days: HTMLFormElement | Array<string>): boolean {
        if (days instanceof HTMLFormElement) {
            const formDays = days.days;
            const daysError = document.getElementById("daysError");
            if (!formDays.length)
                daysError.classList.remove("d-none");
            else
                daysError.classList.add("d-none");
            return formDays.length > 0;
        }

        //This will be executed if days is instanceof Array<string>           
        const daysError = document.getElementById("daysError");
        if (!days.length)
            daysError.classList.remove("d-none");
        else
            daysError.classList.add("d-none");
        return days.length > 0;
    }


    /**
     * Check if there is a selected image
     * @param {HTMLFormElement} form
     * @return {*}  {boolean}
     * @memberof Utils
     */
    public validateImage(form: HTMLFormElement): boolean {
        const imgInput = form.image;

        imgInput.classList.remove("is-valid", "is-invalid");
        if (imgInput.files.length > 0) {
            imgInput.classList.add("is-valid");
            return true;
        } else {
            imgInput.classList.add("is-invalid");
            return false;
        }
    }

    /**
     * @param restaurant 
     * @returns 
     */
    public isOpen(restaurant: Restaurant): boolean {
        //Today's number of week-day
        const todayWeekDay: string = new Date().getDay() + ""; //Eg: (string)"5"
        const isOpen: boolean = restaurant.daysOpen.includes(todayWeekDay) ? true : false;
        return isOpen;
    }

    /**
     * @param restaurant 
     * @returns 
     */
    public isMine(restaurant: Restaurant): boolean {
        return restaurant.creator.me;
    }

    /**
     * @param restaurant 
     * @param separator 
     * @returns 
     */
    public getDaysStr(restaurant: Restaurant, separator = ", "): string {
        //Exapmle of value 'restaurant.daysOpen': 
        //(string[])[ "1", "2", "4", "5"]
        const daysOpenStr: string = restaurant.daysOpen
            .map((value) => WEEKDAYS[value as unknown as number])
            .join(separator);
        return daysOpenStr;
    }

    /**
     * @param {Restaurant} object
     * @return {*}  {number[]}
     * @memberof Utils
     */
    public getFullStars<objWithStars extends { stars?: number }>(object: objWithStars): number[] {
        const stars = Math.floor(object.stars);
        return new Array(stars).fill(1);
    }

    /**
     * @param {Restaurant} object
     * @return {*}  {number[]}
     * @memberof Utils
     */
    public getEmptyStars<objWithStars extends { stars?: number }>(object: objWithStars): number[] {
        
        const stars = Math.floor(object.stars);
        return new Array(5 - stars).fill(1);
    }

    /**
     * @param {Restaurant} restaurant
     * @return {*}  {number}
     * @memberof Utils
     */
    public getDistanceFormated(restaurant: Restaurant,): number {
        return restaurant.distance.toFixed(2) as unknown as number;
    }

    /**
     * @static
     * @param {HTMLInputElement} input
     * @memberof Utils
     */
    static imagePreview(input: HTMLInputElement): void {
        
        const imgPreview = document.getElementById("imgPreview") as HTMLImageElement;

        input.addEventListener("change", async (event: Event) => {
            //console.log("<Change detected>");

            const file = (event.target as HTMLInputElement).files[0];
            const img64 = await this.imageTo64(file);

            if (img64) {
                imgPreview.src = img64;
                imgPreview.classList.remove("d-none");
            } else {
                imgPreview.classList.add("d-none");
            }
        });
    }

    /** 
     * @static
     * @param {File} file
     * @return {*}  {Promise<string>}
     * @memberof Utils
     */
    static async imageTo64(file: File): Promise<string> {
        // eslint-disable-next-line no-debugger
        //debugger;
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            if (file && (file.type === "image/png" || file.type === "image/jpg"  || file.type === "image/jpeg")) {
                reader.readAsDataURL(file);
                reader.onload = (): void => {
                    resolve(reader.result as string);
                };
                reader.onerror = (error): void => {
                    reject(error);
                };
            } else {
                resolve("");
            }
        });
    }
}
