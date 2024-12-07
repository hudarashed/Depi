
// Global code
// handle show message
function showMessage(message, isSuccess) {
    const messageContainer = document.createElement('div');
    messageContainer.textContent = message;
    messageContainer.style.position = 'fixed';
    messageContainer.style.top = '20px';
    messageContainer.style.right = '20px';
    messageContainer.style.padding = '10px 20px';
    messageContainer.style.borderRadius = '5px';
    messageContainer.style.zIndex = '1000';
    messageContainer.style.color = '#fff';
    messageContainer.style.backgroundColor = isSuccess ? 'var(--main-color)' : 'red';
    document.body.appendChild(messageContainer);

    setTimeout(() => {
        messageContainer.remove();
    }, 3000);
}
// This function scrolls to the top of the page
window.onload = function() {
    window.scrollTo(0, 0); 
};
//sign out
document.getElementById('signOutBtn').addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});

//global variables
let currentPage = 1;
let itemsPerPage = 3; 
let wishItems = [];

// fetch cart items
function fetchWishItems() {
    wishItems = JSON.parse(localStorage.getItem('wish')) || []; 
    displayWishItems();
    setupWishPagination();
}
//pagination
function setupWishPagination() {
    let totalPages = Math.ceil(wishItems.length / itemsPerPage);
    let paginationWishHTML = '';

    if (totalPages === 0) {
        document.getElementById('paginationWishContainer').innerHTML = '';
        return;
    }

    for (let i = 1; i <= totalPages; i++) {
        paginationWishHTML += `<button class="main-btn , me-2 mt-3" onclick="goToPage(${i})">${i}</button>`;
    }

    document.getElementById('paginationWishContainer').innerHTML = paginationWishHTML;
}
document.addEventListener('DOMContentLoaded', fetchWishItems);

function goToPage(page) {
    currentPage = page;
    displayWishItems();
}

function displayWishItems() {
    let wishItems = JSON.parse(localStorage.getItem('wish')) || [];


    if (wishItems.length === 0) {
        document.getElementById('wishContainer').innerHTML = `
            <p class="empty-wish-message">Your wish-list is empty. Please add some products to see them here.</p>
        `;
        updateWishIcon(0);
        document.getElementById('paginationWishContainer').innerHTML = '';
        return;
    }

    let totalPages = Math.ceil(wishItems.length / itemsPerPage);
    let start = (currentPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;
    let paginatedWishItems = wishItems.slice(start, end);

    let wishHTML = '';
    let totalPrice = 0;

    paginatedWishItems.forEach((item) => {
        let itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        let shortTitle = item.name.split(" ").slice(0, 3).join(" ");

        wishHTML += `
        <div class="wish-item d-flex align-items-center justify-content-between w-100" data-id="${item.id}">
            <div class="wish-item-details d-flex align-items-center w-100">
                <div>
                    <img src="${item.image}" alt="${shortTitle}" class="wish-item-image" style="width: 100px; height: 100px;">
                </div>
    
                <div class="sub ms-3">
                    <h5 class="fw-bold mb-5 fs-6">${shortTitle}</h5>
                  
    
                    <button class="my-btn ms-0 p-0" onclick="removeFromWish('${item.id}')">
                        <i class="fa-regular fa-trash-can me-2"></i>
                        Remove
                    </button>
                </div>
            </div>
    
            <div class="wish-price">
                <p class="fw-bold text-muted">Price: ${itemTotal} EGP</p>
            </div>
        </div>
        <hr class="w-100 my-3">
    `;
    
    });

    document.getElementById('wishContainer').innerHTML = wishHTML;



    // document.getElementById('totalPriceWishContainer').style.display = 'block';
    updateWishIcon(wishItems.length);
    setupWishPagination();


    const paginationButtons = document.querySelectorAll('#paginationWishContainer button');
    paginationButtons.forEach(button => {
        const pageNumber = parseInt(button.textContent);
        if (pageNumber > totalPages) {
            button.remove();
        }
    });

    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
        displayWishItems();
    }
}

function removeFromWish(productId) {
    let wish = JSON.parse(localStorage.getItem('wish')) || [];
    wish = wish.filter(item => item.id !== productId); 

    localStorage.setItem('wish', JSON.stringify(wish));
    setupWishPagination();
    updateWishIcon(wish.length);
    displayWishItems();


}
function updateWishIcon(wishCount) {
    const wishIconNumber = document.getElementById('wishIconNumber');
    if (wishIconNumber) {
        wishIconNumber.textContent = wishCount; 
    }
}

function updateWishOnHomeLoad() {
    let wish = JSON.parse(localStorage.getItem('wish')) || [];
    updateWishIcon(wish.length); 


}

document.addEventListener('DOMContentLoaded', updateWishOnHomeLoad);

function updateCartIcon(cartCount) {
    const cartIconNumber = document.getElementById('cartIconNumber');
    if (cartIconNumber) {
        cartIconNumber.textContent = cartCount; 
    }
}

function updateCartOnHomeLoad() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartIcon(cart.length); 


}

document.addEventListener('DOMContentLoaded', updateCartOnHomeLoad);