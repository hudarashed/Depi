// Global code

// check if user is logged in
document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = "login.html";
    } else {
        console.log('User is logged in');
    }
});

// document.addEventListener("DOMContentLoaded", () => {
//     const navLinks = document.querySelectorAll(".nav-link");
//     navLinks.forEach(link => {
//         link.addEventListener("click", (e) => {
//             e.preventDefault();
//             navLinks.forEach(link => link.classList.remove("active-link"));
//             e.target.classList.add("active-link");
//         });
//     });
// });

// sign out
document.getElementById('signOutBtn').addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});
window.history.scrollRestoration = 'manual'; 

// This function scrolls to the top of the page
window.onload = function() {
    window.scrollTo(0, 0); 
};

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
// sliderHandler
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', function () {
    let sliderImages = document.querySelectorAll('.slider-image1');
    let currentIndex1 = 0;

    function showNextImage() {
        sliderImages[currentIndex1].classList.remove('active');
        currentIndex1 = (currentIndex1 + 1) % sliderImages.length;
        sliderImages[currentIndex1].classList.add('active');
    }
    setInterval(showNextImage, 3000);
});
/**
                                                   * ! category
*/
// category slider
const slider = document.getElementById('categorySlider');
const categoriesAPI = "https://ecommerce.routemisr.com/api/v1/categories";
let displayedItemsCount = getDisplayedItemsCount();
let categoriesArray = [];

// Fetch categories
fetch(categoriesAPI)
    .then(response => response.json())
    .then(data => {
        categoriesArray = data.data;
        renderSliderItems();
    })
    .catch(error => console.error('Error fetching categories:', error));
//SliderItems count
function renderSliderItems() {
    slider.innerHTML = '';
    const itemsToDisplay = categoriesArray.slice(0, displayedItemsCount);
    itemsToDisplay.forEach(category => {
        createCategoryItem(category);
    });
}
// Create category item
function createCategoryItem(category) {
    const categoryItem = document.createElement('div');
    categoryItem.className = 'category-item';

    const categoryImage = document.createElement('img');
    categoryImage.src = category.image;
    categoryImage.alt = category.name;
    categoryImage.className = 'category-image';
    categoryItem.appendChild(categoryImage);

    const categoryName = document.createElement('p');
    categoryName.textContent = category.name;
    categoryItem.appendChild(categoryName);

    slider.appendChild(categoryItem);
}
// Update slider position
function updateSliderPosition() {
    const itemWidth = slider.children[0].offsetWidth;
    slider.style.transition = 'transform 0.5s ease';
    slider.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
}
//next buttons
document.querySelector('.prev-btn').addEventListener('click', () => {
    const lastCategory = categoriesArray.pop();
    categoriesArray.unshift(lastCategory);
    renderSliderItems();
    updateSliderPosition();
});
//prev buttons
document.querySelector('.next-btn').addEventListener('click', () => {
    const firstCategory = categoriesArray.shift();
    categoriesArray.push(firstCategory);
    renderSliderItems();
    updateSliderPosition();
});
// DisplayedItemsCount
function getDisplayedItemsCount() {
    if (window.innerWidth >= 1400) return 6;
    else if (window.innerWidth >= 1200) return 5;
    else if (window.innerWidth >= 992) return 4;
    else if (window.innerWidth >= 768) return 3;
    else if (window.innerWidth >= 576) return 2;
    else return 1;
}

//resize items
window.addEventListener('resize', () => {
    displayedItemsCount = getDisplayedItemsCount();
    renderSliderItems();
    updateSliderPosition();
});



/**
                                                   * ! Products
*/
// fetch products
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

let allProducts = [];

async function fetchProducts() {
    try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/products?limit=100');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.data) {
            allProducts = data.data;
            console.log("Fetched Products:", allProducts);
            displayProducts(allProducts);
            localStorage.setItem('allProducts', JSON.stringify(allProducts));
        } else {
            console.error("No products data found in the response.");
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}
function displayProducts(productsData) {
    let productsContainer = '';
        const rangesToDisplay = [
            { start: 35, end: 35 },
            { start: 37, end: 39 },
            { start: 25, end: 26 },
            { start: 3, end: 3 },
            { start: 8, end: 8 },
        ];

        rangesToDisplay.forEach(range => {
            for (let i = range.start; i <= range.end; i++) {
                if (i < productsData.length) {
                    productsContainer += `
                    <div class="col-sm-6 col-md-4 col-lg-3 reveal">
                        <div class="card mb-4 product cursor-pointer position-relative">
                            <div class="quick-view-icon">
                                <i class="fa-regular fa-eye fs-5" onclick="viewProduct('${productsData[i]._id}')"></i>
                            </div>
                            <div class="heart-icon position-absolute mt-4">
                                <i class="fa-regular fa-heart fs-5"onclick="addToWish('${productsData[i]._id}')"></i>
                            </div>
                            <img src="${productsData[i].imageCover}" class="card-img-top w-100" alt="${productsData[i].title}">
                            <div class="card-body">
                                <h4 class="card-title text-secondary font-sm mt-0 mb-2">${productsData[i].category.name}</h4>
                                <h3 class="card-title card-title-multiline h6 text-main">${productsData[i].title.split(" ", 2).join(" ")}</h3>
                                <div class="product-price price-line w-100 mb-2">
                                    ${productsData[i].price.toLocaleString('en-US', { style: 'currency', currency: 'EGP' })}
                                </div>
                                <div class="product-rating w-100 mb-3">
                                    <span class="star-rating d-flex align-items-center">
                                        ${renderStars(productsData[i].ratingsAverage)}
                                    </span>
                                    <span class="rating-value">${productsData[i].ratingsAverage}</span>
                                </div>
                                <button onclick="addProduct('${productsData[i]._id}', event)" 
                                    class="btn main-btn add-btn w-100 me-2">Add to cart</button>
                            </div>
                        </div>            
                    </div>
                    `;
                }
            }
        });
    


    document.getElementById("products").innerHTML = productsContainer;
}
function addProduct(productId) {
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

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (!Array.isArray(cart)) {
                cart = []; 
            }
            let existingProduct = cart.find(item => item.id === data.data._id);

            if (existingProduct) {
                existingProduct.quantity += 1;
                showMessage("Product quantity increased in the cart.", true);
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
        .catch(error => {
            console.error('Error adding to cart:', error);
            showMessage("Error adding to cart. Please try again." , false);
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
            localStorage.setItem('productBrand', data.data.brand.name);

            console.log("After Discount Price:", priceAfterDiscount ? priceAfterDiscount.toLocaleString('en-US', { style: 'currency', currency: 'EGP' }) : originalPrice.toLocaleString('en-US', { style: 'currency', currency: 'EGP' }));
            console.log("Original Price:", originalPrice.toLocaleString('en-US', { style: 'currency', currency: 'EGP' }));

            window.location.href = 'details.html';
        })
        .catch(error => {
            console.error("Error fetching product:", error);
        });
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
// render stars
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


