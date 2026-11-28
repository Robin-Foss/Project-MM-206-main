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
        const response = await fetch(`${apiBaseUrl}/webshop/chocolates?key=${groupkey}`);
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
    title.textContent = `${product.chocoName} - ${product.price} kr`;

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
    document.getElementById("nameInput").value = product.chocoName;
    document.getElementById("categoryInput").value = product.category_id || 1;
    document.getElementById("priceInput").value = product.price;
    document.getElementById("stockInput").value = product.stock;
    document.getElementById("headingInput").value = product.shortDescr || "";
    document.getElementById("descriptionInput").value = product.descr || "";
    cancelEditBtn.hidden = false;
}

//--------------------------------------------------
async function handleProductSubmit(event) {
    event.preventDefault();
    const productId = document.getElementById("productIdInput").value;
    const formData = buildProductFormData(productId);
    const method = productId ? "PUT" : "POST";
    const url = `${apiBaseUrl}/webshop/chocolates?key=${groupkey}`;

    await sendProductRequest(url, method, formData);
}

//--------------------------------------------------
function buildProductFormData(productId) {
    const formData = new FormData();
    if (productId) {
        formData.append("id", productId);
    }
    formData.append("name", document.getElementById("nameInput").value.trim());
    formData.append("catID", document.getElementById("categoryInput").value.trim());
    formData.append("price", document.getElementById("priceInput").value);
    formData.append("stock", document.getElementById("stockInput").value);
    formData.append("heading", document.getElementById("headingInput").value.trim());
    formData.append("description", document.getElementById("descriptionInput").value.trim());
    return formData;
}

//--------------------------------------------------
async function sendProductRequest(url, method, formData) {
    try {
        const response = await fetch(url, {
            method: method,
            headers: { "authorization": sessionStorage.getItem("adminToken") },
            body: formData
        });
        if (!response.ok) {
            throw new Error("Action failed. You can only edit products you added yourself.");
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
        const url = `${apiBaseUrl}/webshop/chocolates?key=${groupkey}&id=${productId}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: { "authorization": sessionStorage.getItem("adminToken") }
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
initAdminProducts();