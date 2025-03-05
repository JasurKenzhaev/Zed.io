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
            <img src="${product.images[0]}" alt="${product.name}" onclick="openModal(${products.indexOf(product)})">
            <h2>${product.name}</h2>
            <p class="price">${product.price}₽</p>
            <button class="btn" onclick="orderNow('${product.name}', '${product.images[0]}')">Заказать 🛍️</button>
            <button class="btn" onclick="addToCart('${product.name}', ${product.price}, '${product.images[0]}')">В корзину 🛒</button>
        `;
        productDiv.addEventListener('click', () => openModal(products.indexOf(product)));
        productsDiv.appendChild(productDiv);
    });
}

// Функция для отображения рекомендуемых товаров
function displayRecommendedProducts() {
    const recommendedDiv = document.getElementById("recommended-products");
    recommendedDiv.innerHTML = '';
    const recommendedProducts = products.filter(product => product.isRecommended);
    recommendedProducts.forEach((product, index) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product-card";
        productDiv.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}" onclick="openModal(${index})">
            <h2>${product.name}</h2>
            <p class="price">${product.price}₽</p>
            <button class="btn" onclick="orderNow('${product.name}', '${product.images[0]}')">Заказать</button>
            <button class="btn" onclick="addToCart('${product.name}', ${product.price}, '${product.images[0]}')">В корзину 🛒</button>
        `;
        productDiv.addEventListener('click', () => openModal(index));
        recommendedDiv.appendChild(productDiv);
    });
}

// Функция для отображения новых товаров
function displayNewProducts() {
    const newProductsDiv = document.getElementById("new-products");
    newProductsDiv.innerHTML = '';
    const newProducts = products.filter(product => product.isNew);
    newProducts.forEach((product, index) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product-card";
        productDiv.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}" onclick="openModal(${index})">
            <h2>${product.name}</h2>
            <p class="price">${product.price}₽</p>
            <button class="btn" onclick="orderNow('${product.name}', '${product.images[0]}')">Заказать</button>
            <button class="btn" onclick="addToCart('${product.name}', ${product.price}, '${product.images[0]}')">В корзину 🛒</button>
        `;
        productDiv.addEventListener('click', () => openModal(index));
        newProductsDiv.appendChild(productDiv);
    });
}

// Функция для отображения товаров со скидкой
function displaySaleProducts() {
    const saleProductsDiv = document.getElementById("sale-products");
    saleProductsDiv.innerHTML = '';
    const saleProducts = products.filter(product => product.isOnSale);
    saleProducts.forEach((product, index) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product-card";
        productDiv.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}" onclick="openModal(${index})">
            <h2>${product.name}</h2>
            <p class="price">${product.price}₽</p>
            <button class="btn" onclick="orderNow('${product.name}', '${product.images[0]}')">Заказать</button>
            <button class="btn" onclick="addToCart('${product.name}', ${product.price}, '${product.images[0]}')">В корзину 🛒</button>
        `;
        productDiv.addEventListener('click', () => openModal(index));
        saleProductsDiv.appendChild(productDiv);
    });
}

// Функция для отображения популярных товаров
function displayPopularProducts() {
    const popularProductsDiv = document.getElementById("popular-products");
    popularProductsDiv.innerHTML = '';
    const popularProducts = products.filter(product => product.isPopular);
    popularProducts.forEach((product, index) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product-card";
        productDiv.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}" onclick="openModal(${index})">
            <h2>${product.name}</h2>
            <p class="price">${product.price}₽</p>
            <button class="btn" onclick="orderNow('${product.name}', '${product.images[0]}')">Заказать</button>
            <button class="btn" onclick="addToCart('${product.name}', ${product.price}, '${product.images[0]}')">В корзину 🛒</button>
        `;
        productDiv.addEventListener('click', () => openModal(index));
        popularProductsDiv.appendChild(productDiv);
    });
}

function displayCart() {
    const cartItemsDiv = document.getElementById("cart-items");
    cartItemsDiv.innerHTML = '';
    cart.forEach((item, index) => {
        const cartItemDiv = document.createElement("div");
        cartItemDiv.className = "cart-item";
        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onclick="openModalFromCart(${index})">
            <p>${item.name} - ${item.price}₽ x ${item.quantity}</p>
            <button class="btn" onclick="removeFromCart(${index})">Удалить</button>
        `;
        cartItemsDiv.appendChild(cartItemDiv);
    });
}

function openModalFromCart(index) {
    const cartItem = cart[index];
    const product = products.find(p => p.name === cartItem.name);
    if (product) {
        openModal(products.indexOf(product));
    }
}

function orderNow(name, image) {
    const message = `Я хочу заказать ${name} %0AИзображение: ${image}`;
    window.open(`https://wa.me/+79964684744?text=${encodeURIComponent(message)}`, '_blank');
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

function addToCartFromModal() {
    if (currentProduct) {
        addToCart(currentProduct.name, currentProduct.price, currentProduct.images[0], currentQuantity);
        closeModal();
    }
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
        if (image === currentProduct.images[currentImageIndex]) {
            img.classList.add('active');
        }
        modalProductImages.appendChild(img);
    });
    document.getElementById("modalProductPrice").innerText = `Цена: ${currentProduct.price}₽`;
    document.getElementById("modalProductQuantity").innerText = currentQuantity;
    document.getElementById("productModal").style.display = "block";
    loadReviewsInModal(currentProduct.name);
    updateImageCount();

    // Add swipe functionality
    const slider = document.getElementById("modalProductImages");
    slider.addEventListener('touchstart', handleTouchStart);
    slider.addEventListener('touchmove', handleTouchMove);
    slider.addEventListener('touchend', handleTouchEnd);

    // Add click event to open fullscreen
    modalProductImages.querySelectorAll('img').forEach(img => {
        img.addEventListener('click', () => openFullscreen(currentProduct.images, currentImageIndex));
    });
}

function closeModal() {
    document.getElementById("productModal").style.display = "none";
    currentProduct = null;
    currentQuantity = 1;
    currentImageIndex = 0;
    searchIndex = -1;
}

function increaseQuantity() {
    currentQuantity++;
    document.getElementById("modalProductQuantity").innerText = currentQuantity;
}

function decreaseQuantity() {
    if (currentQuantity > 1) {
        currentQuantity--;
        document.getElementById("modalProductQuantity").innerText = currentQuantity;
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function checkout() {
    if (cart.length > 0) {
        const cartItems = cart.map(item => `${item.name} - ${item.price}₽ x ${item.quantity} %0AИзображение: ${item.image}`).join('%0A');
        const message = `Я хочу заказать:%0A${cartItems}`;
        window.open(`https://wa.me/+79964684744?text=${encodeURIComponent(message)}`, '_blank');
    } else {
        alert('Ваша корзина пуста');
    }
}

function filterProducts() {
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchQuery));
    displayProducts(filteredProducts);
    searchIndex = filteredProducts.length > 0 ? 0 : -1;
}

// Инициализация отображения продуктов
loadProducts();
displayCart();

// Функции для админ-панели
function toggleMenu() {
    const menuPanel = document.getElementById("menu-panel");
    menuPanel.style.display = menuPanel.style.display === "block" ? "none" : "block";
}

function showMain() {
    document.getElementById("product-gallery").style.display = "grid";
    document.getElementById("recommended-gallery").style.display = "none";
    document.getElementById("new-products-gallery").style.display = "none";
    document.getElementById("sale-products-gallery").style.display = "none";
    document.getElementById("popular-products-gallery").style.display = "none";
    document.getElementById("cart-section").style.display = "none";
    toggleMenu();
}

function showRecommended() {
    document.getElementById("product-gallery").style.display = "none";
    document.getElementById("recommended-gallery").style.display = "block";
    document.getElementById("new-products-gallery").style.display = "none";
    document.getElementById("sale-products-gallery").style.display = "none";
    document.getElementById("popular-products-gallery").style.display = "none";
    document.getElementById("cart-section").style.display = "none";
    toggleMenu();
}

function showNewProducts() {
    document.getElementById("product-gallery").style.display = "none";
    document.getElementById("recommended-gallery").style.display = "none";
    document.getElementById("new-products-gallery").style.display = "block";
    document.getElementById("sale-products-gallery").style.display = "none";
    document.getElementById("popular-products-gallery").style.display = "none";
    document.getElementById("cart-section").style.display = "none";
    toggleMenu();
}

function showSaleProducts() {
    document.getElementById("product-gallery").style.display = "none";
    document.getElementById("recommended-gallery").style.display = "none";
    document.getElementById("new-products-gallery").style.display = "none";
    document.getElementById("sale-products-gallery").style.display = "block";
    document.getElementById("popular-products-gallery").style.display = "none";
    document.getElementById("cart-section").style.display = "none";
    toggleMenu();
}

function showPopularProducts() {
    document.getElementById("product-gallery").style.display = "none";
    document.getElementById("recommended-gallery").style.display = "none";
    document.getElementById("new-products-gallery").style.display = "none";
    document.getElementById("sale-products-gallery").style.display = "none";
    document.getElementById("popular-products-gallery").style.display = "block";
    document.getElementById("cart-section").style.display = "none";
    toggleMenu();
}

function showCartSection() {
    document.getElementById("product-gallery").style.display = "none";
    document.getElementById("recommended-gallery").style.display = "none";
    document.getElementById("new-products-gallery").style.display = "none";
    document.getElementById("sale-products-gallery").style.display = "none";
    document.getElementById("popular-products-gallery").style.display = "none";
    document.getElementById("cart-section").style.display = "block";
    toggleMenu();
}

// Функции для работы с отзывами
async function loadReviewsInModal(productName) {
    try {
        const response = await fetch('pleys.json');
        const reviews = await response.json();
        const productReviews = reviews[productName] || [];
        const reviewsDiv = document.getElementById('modalProductReviews');
        reviewsDiv.innerHTML = productReviews.map(review => `<p>${review}</p>`).join('');
    } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
    }
}

// Функции для перелистывания изображений
function nextImage() {
    const images = currentProduct.images;
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateModalImages();
    updateImageCount();
}

function prevImage() {
    const images = currentProduct.images;
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateModalImages();
    updateImageCount();
}

function updateModalImages() {
    const modalProductImages = document.getElementById("modalProductImages");
    const imgs = modalProductImages.getElementsByTagName('img');
    Array.from(imgs).forEach(img => img.classList.remove('active'));
    if (imgs[currentImageIndex]) {
        imgs[currentImageIndex].classList.add('active');
    }
}

function updateImageCount() {
    const imageCount = document.querySelectorAll('.image-count');
    imageCount.forEach(count => {
        count.innerText = `${currentImageIndex + 1} / ${currentProduct.images.length}`;
    });
}

// Функции для полноэкранного режима
function openFullscreen(images, startIndex) {
    currentImageIndex = startIndex;
    const fullscreenImages = document.getElementById("fullscreenImages");
    fullscreenImages.innerHTML = '';
    images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = currentProduct.name;
        if (index === currentImageIndex) {
            img.classList.add('active');
        }
        fullscreenImages.appendChild(img);
    });
    document.getElementById("fullscreen").style.display = "block";
    updateImageCount();

    // Add swipe functionality
    const slider = document.getElementById("fullscreenImages");
    slider.addEventListener('touchstart', handleTouchStart);
    slider.addEventListener('touchmove', handleTouchMove);
    slider.addEventListener('touchend', handleTouchEnd);
}

function closeFullscreen() {
    document.getElementById("fullscreen").style.display = "none";
}

function handleTouchStart(evt) {
    startX = evt.touches[0].clientX;
    isSwiping = true;
}

function handleTouchMove(evt) {
    if (!isSwiping) return;
    evt.preventDefault();
    const x = evt.touches[0].clientX;
    const walk = (x - startX) * 1; // Adjust the multiplier for sensitivity
    if (walk > 50) {
        prevImage();
        isSwiping = false;
    } else if (walk < -50) {
        nextImage();
        isSwiping = false;
    }
}

function handleTouchEnd() {
    isSwiping = false;
}

// Функции для работы с чатом
function openChat() {
    document.getElementById("chatContainer").style.display = "block";
    loadChatMessages();
}

function closeChat() {
    document.getElementById("chatContainer").style.display = "none";
}

function loadChatMessages() {
    const chatMessagesDiv = document.getElementById("chatMessages");
    chatMessagesDiv.innerHTML = chatMessages.map(message => `<div class="chat-message">${message}</div>`).join('');
}

function sendMessage(event) {
    if (event.key === 'Enter') {
        const message = document.getElementById('chatInput').value;
        if (message) {
            chatMessages.push(message);
            loadChatMessages();
            document.getElementById('chatInput').value = '';
        }
    }
}

// Функция для переключения темы
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

// Функция для открытия чата в Telegram
function openTelegramChat() {
    window.open('https://t.me/dtUsBXdlcvYxMmJi', '_blank');
}
