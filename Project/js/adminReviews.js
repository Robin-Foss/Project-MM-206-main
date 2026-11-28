const reviewsListContainer = document.getElementById("reviewsListContainer");
const statusMessage = document.getElementById("statusMessage");
const backToMenuBtn = document.getElementById("backToMenuBtn");

//--------------------------------------------------
function initAdminReviews() {
    if (!sessionStorage.getItem("adminToken")) {
        window.location.href = "adminLogin.html";
        return;
    }
    backToMenuBtn.addEventListener("click", () => {
        window.location.href = "adminLogin.html";
    });
    loadReviews();
}

//--------------------------------------------------
async function loadReviews() {
    try {
        const response = await fetch(`${apiBaseUrl}/webshop/comments?key=${groupkey}`, {
            headers: { "authorization": sessionStorage.getItem("adminToken") }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || "Could not load reviews.");
        }
        renderReviews(data);
    } catch (error) {
        statusMessage.textContent = error.message;
    }
}

//--------------------------------------------------
function renderReviews(reviews) {
    reviewsListContainer.innerHTML = "";
    if (reviews.length === 0) {
        statusMessage.textContent = "No reviews found.";
        return;
    }
    reviews.forEach((review) => {
        const row = createReviewRow(review);
        reviewsListContainer.appendChild(row);
    });
}

//--------------------------------------------------
function createReviewRow(review) {
    const row = document.createElement("div");
    const info = document.createElement("span");
    info.textContent = `Product #${review.product_id} (${review.rating}/5): "${review.comment_text}" `;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete Review";
    deleteBtn.addEventListener("click", () => deleteReview(review.id));

    row.append(info, deleteBtn);
    return row;
}

//--------------------------------------------------
async function deleteReview(commentId) {
    try {
        const response = await fetch(`${apiBaseUrl}/webshop/comments?key=${groupkey}&comment_id=${commentId}`, {
            method: "DELETE",
            headers: { "authorization": sessionStorage.getItem("adminToken") }
        });
        if (!response.ok) {
            throw new Error("Could not delete review.");
        }
        loadReviews();
    } catch (error) {
        statusMessage.textContent = error.message;
    }
}

//--------------------------------------------------
initAdminReviews();