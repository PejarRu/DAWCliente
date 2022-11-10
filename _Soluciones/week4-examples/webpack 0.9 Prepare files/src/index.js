import { SERVER } from "./constants.js";
import { ProductService } from "./product-service.class.js";

const tbody = document.querySelector("#table tbody");
/* THIS GOES TO NEW-PRODUCT.js
const form = document.getElementById("form");
const imgPreview = document.getElementById("imgPreview");
*/
const productService = new ProductService();

function appendProduct(product) {
  const tr = document.createElement("tr");
  const tdImg  = document.createElement("td");
  const tdName = document.createElement("td");
  const tdDesc = document.createElement("td");
  const tdDelete = document.createElement("td");

  const img = document.createElement("img");
  img.src = SERVER + "/" + product.photo;
  tdImg.append(img);

  tdName.append(product.name);
  tdDesc.append(product.description);
  
  let btnDel = document.createElement("button");
  btnDel.append("Delete");
  tdDelete.append(btnDel);

  btnDel.addEventListener("click", async e => {
    await productService.delete(product.id);
    tr.remove();
  });

  tr.append(tdImg, tdName, tdDesc, tdDelete);

  tbody.append(tr);
}

async function getProducts() {
  try {
    const products = await productService.getProducts();
    products.forEach(p => appendProduct(p));
  } catch (error) {
    console.error("Error loading products: ", error);
  }
}

getProducts();


/* THIS GOES TO NEW-PRODUCT.js

form.image.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  if (file) reader.readAsDataURL(file);
  reader.addEventListener("load", (e) => {
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
    const productResp = await productService.add(product);
    appendProduct(productResp);
    form.reset();
    imgPreview.src = "";
  } catch (error) {
    console.error("Error creating the product: ", error);
  }
});
*/

