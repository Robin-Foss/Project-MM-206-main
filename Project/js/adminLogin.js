import { apiBaseUrl, groupKey } from "../utils.js";

const loginSection = document.getElementById("loginSection");
const adminMenuSection = document.getElementById("adminMenuSection");
const adminLoginForm = document.getElementById("adminLoginForm");
const errorMessageElement = document.getElementById("errorMessage");
const productsBtn = document.getElementById("productsBtn");
const ordersBtn = document.getElementById("ordersBtn");
const logoutBtn = document.getElementById("logoutBtn");

//--------------------------------------------------
function initAdminLogin() {
    const existingToken = sessionStorage.getItem("adminToken");
    if (existingToken) {
        showAdminMenu();
    }
    setupEventListeners();
}

//--------------------------------------------------
function setupEventListeners() {
    adminLoginForm.addEventListener("submit", handleLoginSubmit);
    productsBtn.addEventListener("click", () => navigateTo("adminProducts.html"));
    ordersBtn.addEventListener("click", () => navigateTo("adminOrders.html"));
    logoutBtn.addEventListener("click", handleLogout);
}

//--------------------------------------------------
async function handleLoginSubmit(event) {
    event.preventDefault();
    errorMessageElement.textContent = "";

    const username = document.getElementById("usernameInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();

    try {
        const data = await sendLoginRequest(username, password);
        sessionStorage.setItem("adminToken", data.token);
        showAdminMenu();
    } catch (error) {
        errorMessageElement.textContent = error.message;
    }
}

//--------------------------------------------------
async function sendLoginRequest(username, password) {
    const response = await fetch(`${apiBaseUrl}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": groupKey
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        throw new Error("Invalid username or password.");
    }
    return await response.json();
}

//--------------------------------------------------
function showAdminMenu() {
    loginSection.hidden = true;
    adminMenuSection.hidden = false;
}

//--------------------------------------------------
function handleLogout() {
    sessionStorage.removeItem("adminToken");
    adminMenuSection.hidden = true;
    loginSection.hidden = false;
}

//--------------------------------------------------
function navigateTo(pageUrl) {
    window.location.href = pageUrl;
}

//--------------------------------------------------
initAdminLogin();