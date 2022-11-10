import { SERVER } from "./constants.js";
import { ProductService } from "./product-service.class.js";
import css from "../styles.css";
// ADD A HANDLEBARS TEMPLATE
import ProductTemplate from "../templates/product.hbs";

const tbody = document.querySelector("#table tbody");
const productService = new ProductService();
 
function appendProduct(product) {
  const tr = document.createElement("tr");

  /* WE ARE GOING TO USE A HANDLEBARS TEMPLATE
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
  */
  
  // SYNTAX USING HANDLEBARS
  let prodHTML = ProductTemplate(
    {
        ...product // A NUMBER OF ATTRIBUTES UNDETERMINED
        , img: `${SERVER}/${product.photo}` // IMG DIRECTLY GOTTEN FROM SERVER
    }
  );

  /* TO APPEND USING TEMPLATE
  tr.append(tdImg, tdName, tdDesc, tdDelete);
  */
  tr.innerHTML = prodHTML;

  //btnDel.addEventListener("click", async e => {  // SLIGHTLY CHANGED TO USE OUR TR ELEMENT
  tr.querySelector("button").addEventListener("click", async () => {
    await productService.delete(product.id);
    tr.remove();
  });

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