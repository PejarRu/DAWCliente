import { SERVER } from "./constants.js";
import { ProductService } from "./product-service.class.js";
// ADD CSS LOADER
import css from "../styles.css" // .. since index.js is in /src, but styles is in root folder

const tbody = document.querySelector("#table tbody");
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