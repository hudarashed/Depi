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

//sign out
document.getElementById('signOutBtn').addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});
const products = JSON.parse(localStorage.getItem('allProducts')) || [];
const productList = document.getElementById('product-list');
// scroll to top
window.history.scrollRestoration = 'manual'; 
window.onload = function() {
    window.scrollTo(0, 0); 
};

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
function displayProducts(filteredProducts) {
    productList.innerHTML = ''; 

    if (filteredProducts && filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('col-sm-6', 'col-md-4', 'col-lg-3' ,'product-item' , 'reveal');

            productItem.innerHTML = `
                <div class="card mb-4 product cursor-pointer position-relative">
                    <div class="quick-view-icon">
                        <i class="fa-regular fa-eye fs-5" onclick="viewProduct('${product._id}')"></i>
                    </div>
                    <div class="heart-icon position-absolute mt-4">
                        <i class="fa-regular fa-heart fs-5"onclick="addToWish('${product._id}')"></i>
                    </div>
                    <img src="${product.imageCover}" class="card-img-top w-100" alt="${product.title}">
                    <div class="card-body">
                        <h4 class="card-title text-secondary font-sm mt-0 mb-2">${product.category.name}</h4>
                        <h3 class="card-title card-title-multiline h6 text-main">${product.title.split(" ", 2).join(" ")}</h3>
                        <div class="product-price price-line w-100 mb-2">
                            ${product.price.toLocaleString('en-US', { style: 'currency', currency: 'EGP' })}
                        </div>
                        <div class="product-rating w-100 mb-3">
                            <span class="star-rating d-flex align-items-center">
                                ${renderStars(product.ratingsAverage)}
                            </span>
                            <span class="rating-value">${product.ratingsAverage}</span>
                        </div>
                        <button onclick="addProduct('${product._id}', event)" 
                            class="btn main-btn add-btn w-100 me-2">Add To Cart</button>
                    </div>
                </div>
            `;

            productList.appendChild(productItem);
        });
    } else {
        productList.innerHTML = '<p class="empty-search-message" >No products found.</p>';
    }
}
displayProducts(products);
reveal();

const links = document.querySelectorAll('.category-link');

links.forEach(link => {
    link.addEventListener('click', function() {
        links.forEach(item => item.classList.remove('active-category'));
        this.classList.add('active-category');

    });
});

// function searchProducts(event) {
//     const searchTerm = event.target.value.toLowerCase();
//     const filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchTerm));
//     displayProducts(filteredProducts);
//     reveal();
// }
function searchProducts(event) {
    let searchTerm = "";

    if (event && event.target) {
        searchTerm = event.target.value.toLowerCase();
    } else {
        searchTerm = document.getElementById('search-input').value.toLowerCase();
    }

    const filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchTerm));
    displayProducts(filteredProducts);
    reveal();
}

function filterByCategory(category) {
    const filteredProducts = products.filter(product => product.category.name === category);
    displayProducts(filteredProducts);
    reveal();
}
function renderStars(rating) {
    const stars = Math.round(rating); 
    let starHtml = '';
    for (let i = 1; i <= 5; i++) {
        starHtml += `<i class="fa${i <= stars ? ' fa-star' : ' fa-star-o'}"></i>`;
    }
    return starHtml;
}

function addProduct(productId) {
    if (!productId) {
         console.error("Product ID is not provided.");
         return;
     }
 
     localStorage.setItem('productId', JSON.stringify(productId));
     let _id = JSON.parse(localStorage.getItem('productId'));
     let token = localStorage.getItem('token');
 
     console.log("Product ID:", _id);
     console.log("Token:", token);
 
     if (!token) {
         console.error("User is not authenticated. Token is missing.");
         return;
     }
     if(_id) {
         fetch(`https://ecommerce.routemisr.com/api/v1/products/${productId}`)
         .then(response => {
            console.log("Full Response:", response);

            return response.json()
         })
         .then(data => {

             let cart = JSON.parse(localStorage.getItem('cart')) || [];
 
             let existingProduct = cart.find(item => item.id === data.data._id);
 
             if (existingProduct) {
                 existingProduct.quantity += 1;
                 showMessage("Product quantity increased in the cart." , true);
             } else {
                 cart.push({
                     id: data.data._id,
                     name: data.data.title,
                     price: data.data.priceAfterDiscount || data.data.price, 
                     image: data.data.imageCover,
                     quantity: 1 
                 });
                 showMessage("Product added to the cart." , true);
             }
 
             localStorage.setItem('cart', JSON.stringify(cart));
 
             updateCartIcon(cart.length);
         })
         .catch(error => console.error('Error adding to cart:', error));
     }
 
 
 }
 function addToWish(productId) {
    if (!productId) {
        console.error("Product ID is not provided.");
        return;
    }

    let token = localStorage.getItem('token');
    if (!token) {
        console.error("User is not authenticated. Token is missing.");
        return;
    }

    fetch(`https://ecommerce.routemisr.com/api/v1/products/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let wish = JSON.parse(localStorage.getItem('wish')) || [];
            if (!Array.isArray(wish)) {
                wish = []; 
            }
            let existingProduct = wish.find(item => item.id === data.data._id);

            if (existingProduct) {
                showMessage("Product quantity already added in your wishlist.", true);
            } else {
                wish.push({
                    id: data.data._id,
                    name: data.data.title,
                    price: data.data.priceAfterDiscount || data.data.price,
                    image: data.data.imageCover,
                    quantity: 1 
                });
                showMessage("Product added to your wishlist." , true);
            }

            localStorage.setItem('wish', JSON.stringify(wish));
            updateWishIcon(wish.length);
        })
        .catch(error => {
            console.error('Error adding to wish-list:', error);
            showMessage("Error adding to wish-list. Please try again." , false);
        });
}
 function viewProduct(productId) {
     localStorage.setItem('productId', productId);
     fetch(`https://ecommerce.routemisr.com/api/v1/products/${productId}`)
         .then(response => {
             if (!response.ok) {
                 throw new Error(`HTTP error! Status: ${response.status}`);
             }
             return response.json();
         })
         .then(data => {
             localStorage.setItem('productImages', JSON.stringify(data.data.images));
             localStorage.setItem('productImageCover', data.data.imageCover);
             localStorage.setItem('productCategory', data.data.category.name);
             localStorage.setItem('productTitle', data.data.title);
 
             const priceAfterDiscount = data.data.priceAfterDiscount;
             const originalPrice = data.data.price;
 
             if (priceAfterDiscount) {
                 localStorage.setItem('productAfterDiscount', priceAfterDiscount);
             } else {
                 localStorage.setItem('productAfterDiscount', originalPrice);
             }
 
             localStorage.setItem('productOriginalPrice', originalPrice);
             localStorage.setItem('productRating', data.data.ratingsAverage);
             localStorage.setItem('productReviews', data.data.ratingsQuantity);
             localStorage.setItem('productDescription', data.data.description);
             // localStorage.setItem('productCode', data.data.sold);
             // localStorage.setItem('productQuantity', data.data.quantity);
             // localStorage.setItem('productType', data.data.category.name); 
             localStorage.setItem('productBrand', data.data.brand.name);
 
             // الانتقال إلى صفحة التفاصيل
             // window.location.href = 'details.html';
 
             console.log("After Discount Price:", priceAfterDiscount ? priceAfterDiscount.toLocaleString('en-US', { style: 'currency', currency: 'EGP' }) : originalPrice.toLocaleString('en-US', { style: 'currency', currency: 'EGP' }));
             console.log("Original Price:", originalPrice.toLocaleString('en-US', { style: 'currency', currency: 'EGP' }));
 
             window.location.href = 'details.html';
         })
         .catch(error => {
             console.error("Error fetching product:", error);
         });
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
//reveal
function reveal() {
    var reveals = document.querySelectorAll('.reveal');

    for (var i = 0; i < reveals.length; i++) { 
        var windowHeight = window.innerHeight;
        var revealTop = reveals[i].getBoundingClientRect().top;
        var revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
            reveals[i].classList.add("active");
        } else {
            reveals[i].classList.remove("active");
        }
    }
}

window.addEventListener('scroll', reveal);

window.addEventListener('DOMContentLoaded', reveal);

