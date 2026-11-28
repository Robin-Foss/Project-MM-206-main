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
        const response = await fetch(`${apiBaseUrl}/webshop/orders?key=${groupkey}`, {
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
    if (orders.length === 0) {
        statusMessage.textContent = "No orders found.";
        return;
    }
    orders.forEach((order) => {
        const orderCard = createOrderElement(order);
        ordersListContainer.appendChild(orderCard);
    });
}

//--------------------------------------------------
function createOrderElement(order) {
    const container = document.createElement("div");
    const info = document.createElement("p");
    info.textContent = `Order #${order.id} - Customer: ${order.customer_name}`;

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
        const response = await fetch(`${apiBaseUrl}/webshop/orders?key=${groupkey}&Id=${orderId}`, {
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
        "authorization": sessionStorage.getItem("adminToken")
    };
}

//--------------------------------------------------
initAdminOrders();