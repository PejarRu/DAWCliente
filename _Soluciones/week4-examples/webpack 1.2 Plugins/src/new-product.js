import { ProductService } from "./product-service.class.js";

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
        await productService.add(product);
        location.assign("index.html");
    } catch (error) {
        console.error("Error creating the product: ", error);
    }
});