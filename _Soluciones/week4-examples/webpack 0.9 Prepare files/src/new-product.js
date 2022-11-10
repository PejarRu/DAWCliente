import { ProductService } from "./product-service.class.js";

/* PREVIOUSLY IN INDEX */
const form = document.getElementById("form");
const imgPreview = document.getElementById("imgPreview");

const productService = new ProductService();

form.image.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) reader.readAsDataURL(file);
    reader.addEventListener("load", () => {
        imgPreview.src = reader.result;
    });
});

form.addEventListener("submit", async e => {
    e.preventDefault();
    const product = {
        name: form.name.value,
        description: form.description.value,
        photo: imgPreview.src
    };

    try {
        /* REPLACE OLD PROCEDURE TO RETURN TO FIRST ADD AND RETURN INDEX
            NOTICE NO NEED TO RESET SINCE YOU ARE LOADING A DIFFERENT PAGE
        const productResp = await productService.add(product);
        appendProduct(productResp); // we do not have appendProduct here
        form.reset(); // instead of reset we redirect to index (this will reset)
        imgPreview.src = "";
        */
        await productService.add(product);
        location.assign("index.html");
    } catch (error) {
        console.error("Error creating the product: ", error);
    }
});