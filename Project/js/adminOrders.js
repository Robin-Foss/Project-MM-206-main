import { apiBaseUrl, groupKey } from "../utils.js";

const ordersListContainer = document.getElementById("ordersListContainer");
const statusMessage = document.getElementById("statusMessage");
const backToMenuBtn = document.getElementById("backToMenuBtn");

//--------------------------------------------------
function initAdminOrders() {
    if (!sessionStorage.getItem("adminToken")) {
        window.location.href = "adminLogin.html";
        return;
    }
    backToMenuBtn.addEventListener("click", () => {
        window.location.href = "adminLogin.html";
    });
    loadOrders();
}

//--------------------------------------------------
async function loadOrders() {
    try {
        const response = await fetch(`${apiBaseUrl}/orders`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error("Could not fetch orders.");
        }
        const orders = await response.json();
        renderOrders(orders);
    } catch (error) {
        statusMessage.textContent = error.message;
    }
}

//--------------------------------------------------
function renderOrders(orders) {
    ordersListContainer.innerHTML = "";
    orders.forEach((order) => {
        const orderCard = createOrderElement(order);
        ordersListContainer.appendChild(orderCard);
    });
}

//--------------------------------------------------
function createOrderElement(order) {
    const container = document.createElement("div");
    const info = document.createElement("p");
    info.textContent = `Order #${order.id} - Customer: ${order.customerName} - Total: ${order.totalPrice} kr`;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete Order";
    deleteBtn.addEventListener("click", () => deleteOrder(order.id));

    container.append(info, deleteBtn);
    return container;
}

//--------------------------------------------------
async function deleteOrder(orderId) {
    try {
        const response = await fetch(`${apiBaseUrl}/orders/${orderId}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error("Could not delete order.");
        }
        loadOrders();
    } catch (error) {
        statusMessage.textContent = error.message;
    }
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
initAdminOrders();