/* eslint-disable linebreak-style */
export class FormValidator {

    //Validaet passed string with passed regex. Set class to valid/invalid
    public testInputExpr(input: HTMLInputElement, regexp: RegExp): boolean {
        input.classList.remove("is-valid", "is-invalid");
        const valid = regexp.test(input.value);
        input.classList.add(valid ? "is-valid" : "is-invalid");
        return valid;
    }

    public validateName(input: HTMLInputElement): boolean {
        return this.testInputExpr(input, /^[a-z][a-z ]*$/i);
    }

    public validatePhone(form: HTMLFormElement): boolean {
        return this.testInputExpr(form.phone, /^[0-9]{9}$/);
    }

    public validateDescription(form: HTMLFormElement): boolean {
        return this.testInputExpr(form.description, /\S/);
    }

    public validateCuisine(form: HTMLFormElement): boolean {
        return this.testInputExpr(form.cuisine, /\S/);
    }

    //Check if there is at least 1 checked day
    public validateDaysFromHTML(form: HTMLFormElement): boolean {
        const formDays = form.days;
        const daysError = document.getElementById("daysError");
        if (!formDays.length)
            daysError.classList.remove("d-none");
        else
            daysError.classList.add("d-none");
        return formDays.length > 0;
    }

    //Check if there is at least 1 checked day
    public validateDaysFromArray(days: Array<string>): boolean {
        const daysError = document.getElementById("daysError");
        if (!days.length)
            daysError.classList.remove("d-none");
        else
            daysError.classList.add("d-none");
        return days.length > 0;
    }

    //Check if there is a selected image
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
}
