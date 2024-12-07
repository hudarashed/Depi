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
// sign out
document.getElementById('signOutBtn').addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star rating-color"></i>';
    }

    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt rating-color"></i>';
    }

    for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

function displayProductImages() {
    const productImages = JSON.parse(localStorage.getItem('productImages'));
    const productImageCover = localStorage.getItem('productImageCover');

    if (!productImages || !productImageCover) {
        console.error("Product images not found in localStorage.");
        return;
    }

    let imagesContainer = `
        <div class="large-image">
            <img src="${productImageCover}" alt="Product Cover" id="largeImage" class="img-fluid">
        </div>
        <div class="small-images">
    `;

    productImages.slice(0, 3).forEach((image, index) => {
        imagesContainer += `
            <img src="${image}" alt="Product Image ${index + 1}" class="small-image" onclick="changeImage('${image}', event)">
        `;
    });

    imagesContainer += `</div>`;
    
    document.getElementById("imageContainer").innerHTML = imagesContainer;
}

function changeImage(imageSrc, event) {
    document.getElementById("largeImage").src = imageSrc;

    const smallImages = document.querySelectorAll('.small-image');
    smallImages.forEach(img => img.classList.remove('active'));
    event.target.classList.add('active');
}

function displayProductDetails() {
    const productCategory = localStorage.getItem('productCategory');
    const productTitle = localStorage.getItem('productTitle');
    const productCurrentPrice = parseFloat(localStorage.getItem('productAfterDiscount'));
    const productOriginalPrice = parseFloat(localStorage.getItem('productOriginalPrice'));
    const productRating = localStorage.getItem('productRating');
    const productReviews = localStorage.getItem('productReviews');    
    const productBrand = localStorage.getItem('productBrand');
    const productDescription = localStorage.getItem('productDescription');

    if (!productCategory || !productTitle || isNaN(productCurrentPrice) || isNaN(productOriginalPrice) || !productRating || !productReviews || !productBrand || !productDescription) {
        console.error("Product details not found in localStorage.");
        return;
    }

    const discountPercentage = ((productOriginalPrice - productCurrentPrice) / productOriginalPrice) * 100;

    document.getElementById("productCategory").innerHTML = productCategory.replace(/"/g, '');
    document.getElementById("productTitle").innerHTML = productTitle.replace(/"/g, '').split(" ", 3).join(" ");
    document.getElementById("productAfterDiscount").innerHTML = productCurrentPrice.toLocaleString('en-US', { style: 'currency', currency: 'EGP' });
    document.getElementById("productOriginalPrice").innerHTML = productOriginalPrice.toLocaleString('en-US', { style: 'currency', currency: 'EGP' });
    if (discountPercentage > 0) {
        document.getElementById("productDiscountPercentage").innerHTML = `${discountPercentage.toFixed(2)}% Off`;
    } else {
        document.getElementById("productDiscountPercentage").innerHTML = "No Discount";
    }
    document.getElementById("productRating").innerHTML = renderStars(parseFloat(productRating));
    document.getElementById("productReviews").innerHTML =`(${productReviews} reviews)`;
    document.getElementById("productBrand").innerHTML = productBrand;
    document.getElementById("productDescription").innerHTML = productDescription.split("\n", 3).join(" ");
}

document.addEventListener('DOMContentLoaded', function() {

            displayProductImages();
            displayProductDetails();

});


function addToCart() {
    let productId = localStorage.getItem('productId');
    let token = localStorage.getItem('token');

    if (!productId || !token) {
        console.error("Product ID or Token is missing.");
        return;
    }

    let quantity = parseInt(document.getElementById('quantityInput').value);

    fetch(`https://ecommerce.routemisr.com/api/v1/products/${productId}`)
    .then(response => response.json())
    .then(data => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (!Array.isArray(cart)) {
                cart = []; 
            }

        let existingProduct = cart.find(item => item.id === data.data._id);

        if (existingProduct) {
            existingProduct.quantity += quantity;
            showMessage("Product quantity increased in the cart." , true);
        } else {
            cart.push({
                id: data.data._id,
                name: data.data.title,
                price: data.data.priceAfterDiscount || data.data.price,
                image: data.data.imageCover,
                quantity: quantity
            });
            showMessage("Product added to the cart." , true);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartIcon(cart.length);
    })
    .catch(error => console.error('Error adding to cart:', error));
}

function increaseQuantity() {
    let quantityInput = document.getElementById('quantityInput');
    let quantity = parseInt(quantityInput.value);
    quantityInput.value = quantity + 1;
}

function decreaseQuantity() {
    let quantityInput = document.getElementById('quantityInput');
    let quantity = parseInt(quantityInput.value);
    if (quantity > 1) {
        quantityInput.value = quantity - 1;
    }
}




function calculateTotalPrice(price, quantity) {
    if (!price || !quantity || isNaN(price) || isNaN(quantity)) {
        return 'NaN';
    }
    return price * quantity;
}

function increaseQuantity() {
    let quantityInput = document.getElementById('quantityInput');
    let currentQuantity = parseInt(quantityInput.value);
    let newQuantity = currentQuantity + 1;

    quantityInput.value = newQuantity;

    let productPrice = parseFloat(document.getElementById('productPrice').innerText);
    let totalPrice = calculateTotalPrice(productPrice, newQuantity);

    document.getElementById('totalPrice').innerText = totalPrice;

    updateCartQuantity(newQuantity);
}

function decreaseQuantity() {
    let quantityInput = document.getElementById('quantityInput');
    let currentQuantity = parseInt(quantityInput.value);
    
    if (currentQuantity > 1) {
        let newQuantity = currentQuantity - 1;
        quantityInput.value = newQuantity;

        let productPrice = parseFloat(document.getElementById('productPrice').innerText);
        let totalPrice = calculateTotalPrice(productPrice, newQuantity);

        document.getElementById('totalPrice').innerText = totalPrice;

        updateCartQuantity(newQuantity);
    }
}

function updateCartQuantity(newQuantity) {
    let productId = localStorage.getItem('productId');

    if (productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || {};
        cart[productId] = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
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