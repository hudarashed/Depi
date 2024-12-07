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
let cartItems = [];

// fetch cart items
function fetchCartItems() {
    cartItems = JSON.parse(localStorage.getItem('cart')) || []; 
    displayCartItems();
    setupPagination();
}

//pagination
function setupPagination() {
    let totalPages = Math.ceil(cartItems.length / itemsPerPage);
    let paginationHTML = '';

    if (totalPages === 0) {
        document.getElementById('paginationContainer').innerHTML = '';
        return;
    }

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<button class="main-btn , me-2 mt-3" onclick="goToPage(${i})">${i}</button>`;
    }

    document.getElementById('paginationContainer').innerHTML = paginationHTML;
}

function goToPage(page) {
    currentPage = page;
    displayCartItems();
}

function updateQuantity(index, action) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (action === 'increase') {
        cartItems[index].quantity += 1;
    } else if (action === 'decrease') {
        if (cartItems[index].quantity > 1) {
            cartItems[index].quantity -= 1;
        } else {
            alert("Minimum quantity is 1.");
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

document.addEventListener('DOMContentLoaded', fetchCartItems);

function calculateTotalPrice(price, quantity) {
    if (!price || !quantity || isNaN(price) || isNaN(quantity)) {
        return 'NaN';
    }
    return price * quantity;
}
function displayCartItems() {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];


    if (cartItems.length === 0) {
        document.getElementById('cartContainer').innerHTML = `
            <p class="empty-cart-message">Your cart is empty. Please add some products to see them here.</p>
        `;
        document.getElementById('totalPriceContainer').style.display = 'none';
        document.getElementById('order-summary').style.display = 'none';
        updateCartIcon(0);
        document.getElementById('paginationContainer').innerHTML = '';
        return;
    }

    let totalPages = Math.ceil(cartItems.length / itemsPerPage);
    let start = (currentPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;
    let paginatedItems = cartItems.slice(start, end);

    let cartHTML = '';
    let totalPrice = 0;

    paginatedItems.forEach((item) => {
        let itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        let shortTitle = item.name.split(" ").slice(0, 3).join(" ");

        cartHTML += `
        <div class="cart-item d-flex align-items-center justify-content-between w-100" data-id="${item.id}">
            <div class="cart-item-details d-flex align-items-center w-100">
                <div>
                    <img src="${item.image}" alt="${shortTitle}" class="cart-item-image" style="width: 100px; height: 100px;">
                </div>
    
                <div class="sub ms-3">
                    <h5 class="fw-bold mb-2 fs-6">${shortTitle}</h5>
                    <div class="quantity-controls mb-1 d-flex align-items-center">
                        <button class="btn border-0 text-secondary fs-5 fw-bold mb-2"
                            onclick="updateQuantity('${item.id}', 'decrease')">-</button>
                        <span class="quantity fw-bold bg-transparent text-main mb-0 px-2 ms-1">${item.quantity}</span>
                        <button class="btn border-0 text-secondary fs-5 fw-bold mb-2"
                            onclick="updateQuantity('${item.id}', 'increase')">+</button>
                    </div>
    
                    <button class="my-btn ms-0 p-0" onclick="removeFromCart('${item.id}')">
                        <i class="fa-regular fa-trash-can me-2"></i>
                        Remove
                    </button>
                </div>
            </div>
    
            <div class="cart-price">
                <p class="fw-bold text-muted">Price: ${itemTotal} EGP</p>
            </div>
        </div>
        <hr class="w-100 my-3">
    `;
    
    });

    document.getElementById('cartContainer').innerHTML = cartHTML;



    document.getElementById('totalPriceContainer').style.display = 'block';
    updateCartIcon(cartItems.length);
    setupPagination();
    displayCartSummary(cartItems);


    const paginationButtons = document.querySelectorAll('#paginationContainer button');
    paginationButtons.forEach(button => {
        const pageNumber = parseInt(button.textContent);
        if (pageNumber > totalPages) {
            button.remove();
        }
    });

    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
        displayCartItems();
    }
}

function updateQuantity(productId, action) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex !== -1) {
        if (action === 'increase') {
            cart[itemIndex].quantity += 1;
        } else if (action === 'decrease') {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            } else {
                showMessage("Minimum quantity is 1." , false);
            }
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();

}
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId); 

    localStorage.setItem('cart', JSON.stringify(cart));
    setupPagination();
    updateCartIcon(cart.length);
    displayCartItems();


}


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

//cart summary
function displayCartSummary(cartItems) {
    let totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    let totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    document.getElementById('total-items').textContent = totalQuantity;
    document.getElementById('total-price').textContent = `${totalPrice} EGP`;
    
    document.getElementById('totalPriceContainer').style.display = totalQuantity > 0 ? 'block' : 'none';
}






