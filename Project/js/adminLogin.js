
const loginSection = document.getElementById("loginSection");
const adminMenuSection = document.getElementById("adminMenuSection");
const adminLoginForm = document.getElementById("adminLoginForm");
const errorMessageElement = document.getElementById("errorMessage");
const productsBtn = document.getElementById("productsBtn");
const ordersBtn = document.getElementById("ordersBtn");
const usersBtn = document.getElementById("usersBtn");
const reviewsBtn = document.getElementById("reviewsBtn");
const logoutBtn = document.getElementById("logoutBtn");

//--------------------------------------------------
function initAdminLogin() {
    const existingToken = sessionStorage.getItem("adminToken");
    if (existingToken && existingToken !== "undefined" && existingToken !== "null") {
        showAdminMenu();
    } else {
        sessionStorage.removeItem("adminToken");
    }
    setupEventListeners();
}

//--------------------------------------------------
function setupEventListeners() {
    adminLoginForm.addEventListener("submit", handleLoginSubmit);
    productsBtn.addEventListener("click", () => navigateTo("adminProducts.html"));
    ordersBtn.addEventListener("click", () => navigateTo("adminOrders.html"));
    if (usersBtn) {
        usersBtn.addEventListener("click", () => navigateTo("adminUsers.html"));
    }
    if (reviewsBtn) {
        reviewsBtn.addEventListener("click", () => navigateTo("adminReviews.html"));
    }
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
        console.log("Svar fra adminlogin:", data);

        const token = data.token || data.logindata?.token || data.accessToken;
        if (!token) {
            throw new Error("Fant ikke token i svaret fra serveren. Sjekk Console (F12).");
        }

        sessionStorage.setItem("adminToken", token);
        showAdminMenu();
    } catch (error) {
        errorMessageElement.textContent = error.message;
    }
}

//--------------------------------------------------
async function sendLoginRequest(username, password) {
    const authString = createBasicAuthString(username, password);
    const url = `${apiBaseUrl}/users/adminlogin?key=${groupkey}`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "authorization": authString
        }
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