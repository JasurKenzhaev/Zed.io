let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProduct = null;
let currentQuantity = 1;
let currentImageIndex = 0;
let startX = 0;
let isSwiping = false;

// Функция для загрузки товаров из products.json
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error('Ошибка при загрузке товаров');
        }
        products = await response.json();
        displayProducts();
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
    }
}

// Функция для отображения всех товаров
function displayProducts(filteredProducts = products) {
    const productsDiv = document.getElementById("product-gallery");
    productsDiv.innerHTML = '';
    filteredProducts.forEach((product, index) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product-card";
        productDiv.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}" onclick="openModal(${index})">
            <h2>${product.name}</h2>
            <p class="price">${product.price}₽</p>
            <button class="btn" onclick="addToCart('${product.name}', ${product.price}, '${product.images[0]}')">В корзину 🛒</button>
        `;
        productsDiv.appendChild(productDiv);
    });
}

function displayCart() {
    const cartItemsDiv = document.getElementById("cart-items");
    cartItemsDiv.innerHTML = '';
    cart.forEach((item, index) => {
        const cartItemDiv = document.createElement("div");
        cartItemDiv.className = "cart-item";
        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p>${item.name} - ${item.price}₽ x ${item.quantity}</p>
            <button class="btn" onclick="removeFromCart(${index})">Удалить</button>
        `;
        cartItemsDiv.appendChild(cartItemDiv);
    });
}

function addToCart(name, price, image, quantity = 1) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name, price, quantity, image });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} добавлен в корзину 🛒!`);
    displayCart();
}

function openModal(index) {
    currentProduct = products[index];
    currentQuantity = 1;
    currentImageIndex = 0;

    document.getElementById("modalProductName").innerText = currentProduct.name;
    const modalProductImages = document.getElementById("modalProductImages");
    modalProductImages.innerHTML = '';
    currentProduct.images.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = currentProduct.name;
        modalProductImages.appendChild(img);
    });

    document.getElementById("modalProductPrice").innerText = `Цена: ${currentProduct.price}₽`;
    document.getElementById("productModal").style.display = "block";
}

function closeModal() {
    document.getElementById("productModal").style.display = "none";
    currentProduct = null;
    currentQuantity = 1;
    currentImageIndex = 0;
}

function openFullscreen(images, startIndex) {
    currentImageIndex = startIndex;
    const fullscreenContainer = document.getElementById("fullscreenContainer");
    fullscreenContainer.style.display = "block";
    const fullscreenImages = document.getElementById("fullscreenImages");
    fullscreenImages.innerHTML = '';

    images.forEach((image) => {
        const img = document.createElement('img');
        img.src = image;
        fullscreenImages.appendChild(img);
    });

    updateFullscreenImage();

    fullscreenImages.addEventListener('touchstart', handleTouchStart);
    fullscreenImages.addEventListener('touchmove', handleTouchMove);
    fullscreenImages.addEventListener('touchend', handleTouchEnd);
}

function updateFullscreenImage() {
    const fullscreenImages = document.getElementById("fullscreenImages").getElementsByTagName('img');
    Array.from(fullscreenImages).forEach(img => img.classList.remove('active'));
    fullscreenImages[currentImageIndex].classList.add('active');
}

function handleTouchStart(event) {
        startX = event.touches[0].clientX;
    isSwiping = true;
}

function handleTouchMove(event) {
    if (!isSwiping) return;
    const currentX = event.touches[0].clientX;
    if (startX - currentX > 50) {
        nextFullscreenImage();
        isSwiping = false;
    } else if (currentX - startX > 50) {
        prevFullscreenImage();
        isSwiping = false;
    }
}

function handleTouchEnd() {
    isSwiping = false;
}

function nextFullscreenImage() {
    const imagesCount = currentProduct.images.length;
    currentImageIndex = (currentImageIndex + 1) % imagesCount;
    updateFullscreenImage();
}

function prevFullscreenImage() {
    const imagesCount = currentProduct.images.length;
    currentImageIndex = (currentImageIndex - 1 + imagesCount) % imagesCount;
    updateFullscreenImage();
}

function closeFullscreen() {
    document.getElementById("fullscreenContainer").style.display = "none";
    currentImageIndex = 0; // Сброс индекса изображения при закрытии
}

// Удаление товара из корзины
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Инициализация приложения
loadProducts();
displayCart();

