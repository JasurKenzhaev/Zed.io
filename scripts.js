let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProduct = null;
let currentQuantity = 1;
let currentImageIndex = 0;
let chatMessages = [];
let startX = 0;
let isSwiping = false;
let searchIndex = -1;

// Функция для загрузки товаров из products.json
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error('Ошибка при загрузке товаров');
        }
        products = await response.json();
        displayProducts();
        displayRecommendedProducts();
        displayNewProducts();
        displaySaleProducts();
        displayPopularProducts();
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
            <img src="${product.images[0]}" alt="${product.name}" class="product-image" onclick="openModal(${index})">
            <h2>${product.name}</h2>
            <p class="price">${product.price}₽</p>
            <button class="btn" onclick="orderNow('${product.name}', '${product.images[0]}')">Заказать 🛍️</button>
            <button class="btn" onclick="addToCart('${product.name}', ${product.price}, '${product.images[0]}')">В корзину 🛒</button>
        `;
        productsDiv.appendChild(productDiv);
    });
}

// Функции для отображения рекомендуемых, новых, со скидкой и популярных товаров
function displayRecommendedProducts() {
    const recommendedDiv = document.getElementById("recommended-products");
    recommendedDiv.innerHTML = '';
    const recommendedProducts = products.filter(product => product.isRecommended);
    recommendedProducts.forEach((product, index) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product-card";
        productDiv.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}" onclick="openModal(${products.indexOf(product)})">
            <h2>${product.name}</h2>
            <p class="price">${product.price}₽</p>
            <button class="btn" onclick="orderNow('${product.name}', '${product.images[0]}')">Заказать</button>
            <button class="btn" onclick="addToCart('${product.name}', ${product.price}, '${product.images[0]}')">В корзину 🛒</button>
        `;
        recommendedDiv.appendChild(productDiv);
    });
}

function displayNewProducts() {
    const newProductsDiv = document.getElementById("new-products");
    newProductsDiv.innerHTML = '';
    const newProducts = products.filter(product => product.isNew);
    newProducts.forEach((product, index) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product-card";
        productDiv.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}" onclick="openModal(${products.indexOf(product)})">
            <h2>${product.name}</h2>
            <p class="price">${product.price}₽</p>
            <button class="btn" onclick="orderNow('${product.name}', '${product.images[0]}')">Заказать</button>
            <button class="btn" onclick="addToCart('${product.name}', ${product.price}, '${product.images[0]}')">В корзину 🛒</button>
        `;
        newProductsDiv.appendChild(productDiv);
    });
}

function displaySaleProducts() {
    const saleProductsDiv = document.getElementById("sale-products");
    saleProductsDiv.innerHTML = '';
    const saleProducts = products.filter(product => product.isOnSale);
    saleProducts.forEach((product, index) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product-card";
        productDiv.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}" onclick="openModal(${products.indexOf(product)})">
            <h2>${product.name}</h2>
            <p class="price">${product.price}₽</p>
                       <button class="btn" onclick="orderNow('${product.name}', '${product.images[0]}')">Заказать</button>
            <button class="btn" onclick="addToCart('${product.name}', ${product.price}, '${product.images[0]}')">В корзину 🛒</button>
        `;
        saleProductsDiv.appendChild(productDiv);
    });
}

function displayPopularProducts() {
    const popularProductsDiv = document.getElementById("popular-products");
    popularProductsDiv.innerHTML = '';
    const popularProducts = products.filter(product => product.isPopular);
    popularProducts.forEach((product, index) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product-card";
        productDiv.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}" onclick="openModal(${products.indexOf(product)})">
            <h2>${product.name}</h2>
            <p class="price">${product.price}₽</p>
            <button class="btn" onclick="orderNow('${product.name}', '${product.images[0]}')">Заказать</button>
            <button class="btn" onclick="addToCart('${product.name}', ${product.price}, '${product.images[0]}')">В корзину 🛒</button>
        `;
        popularProductsDiv.appendChild(productDiv);
    });
}

// Функция для открытия модального окна
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
    document.getElementById("modalProductQuantity").innerText = currentQuantity;
    document.getElementById("productModal").style.display = "block";
    loadReviewsInModal(currentProduct.name);
    updateImageCount();

    // Добавьте обработчики событий для свайпов
    const slider = document.getElementById("modalProductImages");
    slider.addEventListener('touchstart', handleTouchStart);
    slider.addEventListener('touchmove', handleTouchMove);
    slider.addEventListener('touchend', handleTouchEnd);
}

// Функция для добавления товара в корзину
function addToCart(name, price, image) {
    const existingProduct = cart.find(item => item.name === name);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} добавлен в корзину!`);
}

// Функция для обновления количества изображений в модальном окне
function updateImageCount() {
    const totalImages = currentProduct.images.length;
    document.getElementById("imageCount").innerText = `${currentImageIndex + 1} из ${totalImages}`;
}

// Обработчики для свайпов
function handleTouchStart(event) {
    startX = event.touches[0].clientX;
    isSwiping = true;
}

function handleTouchMove(event) {
    if (!isSwiping) return;
    const currentX = event.touches[0].clientX;
    const diffX = startX - currentX;

    if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
            nextImage();
        } else {
            previousImage();
        }
        isSwiping = false; // Сбрасываем флаг после свайпа
    }
}

function handleTouchEnd(event) {
    isSwiping = false; // Сбрасываем флаг при завершении свайпа
}

// Функции для перехода между изображениями
function nextImage() {
    if (currentImageIndex < currentProduct.images.length - 1) {
        currentImageIndex++;
        updateImageDisplay();
    }
}

function previousImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateImageDisplay();
    }
}

function updateImageDisplay() {
    const modalProductImages = document.getElementById("modalProductImages");
    const images = modalProductImages.getElementsByTagName('img');
      for (let i = 0; i < images.length; i++) {
        images[i].style.display = (i === currentImageIndex) ? 'block' : 'none';
    }
    updateImageCount(); // Обновляем счетчик изображений
}

// Функция для закрытия модального окна
function closeModal() {
    document.getElementById("productModal").style.display = "none";
}

// Функция для загрузки отзывов в модальное окно
function loadReviewsInModal(productName) {
    // Здесь можно добавить логику для загрузки и отображения отзывов о товаре
    const reviewsDiv = document.getElementById("modalReviews");
    reviewsDiv.innerHTML = `<p>Отзывы о ${productName} будут загружены сюда.</p>`;
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    document.getElementById("closeModalButton").onclick = closeModal;
});


