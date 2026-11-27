import { apiBaseUrl, groupKey } from "../utils.js";

const productForm = document.getElementById("productForm");
const productListContainer = document.getElementById("productListContainer");
const statusMessage = document.getElementById("statusMessage");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const backToMenuBtn = document.getElementById("backToMenuBtn");

//--------------------------------------------------
function initAdminProducts() {
    if (!sessionStorage.getItem("adminToken")) {
        window.location.href = "adminLogin.html";
        return;
    }
    setupEventListeners();
    loadProducts();
}

//--------------------------------------------------
function setupEventListeners() {
    productForm.addEventListener("submit", handleProductSubmit);
    cancelEditBtn.addEventListener("click", resetForm);
    backToMenuBtn.addEventListener("click", () => {
        window.location.href = "adminLogin.html";
    });
}

//--------------------------------------------------
async function loadProducts() {
    try {
        const response = await fetch(`${apiBaseUrl}/products`, {
            headers: { "x-api-key": groupKey }
        });
        const products = await response.json();
        renderProductList(products);
    } catch (error) {
        statusMessage.textContent = "Could not load products.";
    }
}

//--------------------------------------------------
function renderProductList(products) {
    productListContainer.innerHTML = "";
    products.forEach((product) => {
        const card = createProductRow(product);
        productListContainer.appendChild(card);
    });
}

//--------------------------------------------------
function createProductRow(product) {
    const row = document.createElement("div");
    const title = document.createElement("span");
    title.textContent = `${product.name} - ${product.price} kr `;

    const editBtn = createActionButton("Edit", () => populateFormForEdit(product));
    const deleteBtn = createActionButton("Delete", () => deleteProduct(product.id));

    row.append(title, editBtn, deleteBtn);
    return row;
}

//--------------------------------------------------
function createActionButton(label, onClickHandler) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", onClickHandler);
    return button;
}

//--------------------------------------------------
function populateFormForEdit(product) {
    document.getElementById("productIdInput").value = product.id;
    document.getElementById("nameInput").value = product.name;
    document.getElementById("categoryInput").value = product.category;
    document.getElementById("priceInput").value = product.price;
    document.getElementById("stockInput").value = product.stock;
    document.getElementById("headingInput").value = product.heading || "";
    document.getElementById("descriptionInput").value = product.description || "";
    cancelEditBtn.hidden = false;
}

//--------------------------------------------------
async function handleProductSubmit(event) {
    event.preventDefault();
    const productId = document.getElementById("productIdInput").value;
    const productData = getFormProductData();
    const method = productId ? "PUT" : "POST";
    const url = productId ? `${apiBaseUrl}/products/${productId}` : `${apiBaseUrl}/products`;

    await sendProductRequest(url, method, productData);
}

//--------------------------------------------------
function getFormProductData() {
    return {
        name: document.getElementById("nameInput").value.trim(),
        category: document.getElementById("categoryInput").value.trim(),
        price: Number(document.getElementById("priceInput").value),
        stock: Number(document.getElementById("stockInput").value),
        heading: document.getElementById("headingInput").value.trim(),
        description: document.getElementById("descriptionInput").value.trim(),
        image: document.getElementById("imageInput").value.trim()
    };
}

//--------------------------------------------------
async function sendProductRequest(url, method, productData) {
    try {
        const response = await fetch(url, {
            method: method,
            headers: getAuthHeaders(),
            body: JSON.stringify(productData)
        });
        if (!response.ok) {
            throw new Error("Action failed. Check if you own this product.");
        }
        resetForm();
        loadProducts();
    } catch (error) {
        statusMessage.textContent = error.message;
    }
}

//--------------------------------------------------
async function deleteProduct(productId) {
    try {
        const response = await fetch(`${apiBaseUrl}/products/${productId}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error("Could not delete product.");
        }
        loadProducts();
    } catch (error) {
        statusMessage.textContent = error.message;
    }
}

//--------------------------------------------------
function resetForm() {
    productForm.reset();
    document.getElementById("productIdInput").value = "";
    cancelEditBtn.hidden = true;
}

//--------------------------------------------------
function getAuthHeaders() {
    return {
        "Content-Type": "application/json",
        "x-api-key": groupKey,
        "Authorization": `Bearer ${sessionStorage.getItem("adminToken")}`
    };
}

//--------------------------------------------------
initAdminProducts();