const usersListContainer = document.getElementById("usersListContainer");
const statusMessage = document.getElementById("statusMessage");
const backToMenuBtn = document.getElementById("backToMenuBtn");

//--------------------------------------------------
function initAdminUsers() {
    if (!sessionStorage.getItem("adminToken")) {
        window.location.href = "adminLogin.html";
        return;
    }
    backToMenuBtn.addEventListener("click", () => {
        window.location.href = "adminLogin.html";
    });
    loadUsers();
}

//--------------------------------------------------
async function loadUsers() {
    try {
        const response = await fetch(`${apiBaseUrl}/users?key=${groupkey}`, {
            headers: { "authorization": sessionStorage.getItem("adminToken") }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || "Could not load users.");
        }
        renderUsers(data);
    } catch (error) {
        statusMessage.textContent = error.message;
    }
}

//--------------------------------------------------
function renderUsers(users) {
    usersListContainer.innerHTML = "";
    if (users.length === 0) {
        statusMessage.textContent = "No users found.";
        return;
    }
    users.forEach((user) => {
        const row = createUserRow(user);
        usersListContainer.appendChild(row);
    });
}

//--------------------------------------------------
function createUserRow(user) {
    const row = document.createElement("div");
    const info = document.createElement("span");
    info.textContent = `${user.fullname} (${user.username}) `;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete User";
    deleteBtn.addEventListener("click", () => deleteUser(user.id));

    row.append(info, deleteBtn);
    return row;
}

//--------------------------------------------------
async function deleteUser(userId) {
    try {
        const response = await fetch(`${apiBaseUrl}/users?key=${groupkey}&Id=${userId}`, {
            method: "DELETE",
            headers: { "authorization": sessionStorage.getItem("adminToken") }
        });
        if (!response.ok) {
            throw new Error("Could not delete user.");
        }
        loadUsers();
    } catch (error) {
        statusMessage.textContent = error.message;
    }
}

//--------------------------------------------------
initAdminUsers();