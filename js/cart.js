// ===============================
// My Computer - Shopping Cart
// ===============================

const CART_KEY = "myComputerCart";

// دریافت سبد خرید
function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (error) {
        return [];
    }
}

// ذخیره سبد خرید
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

// فرمت قیمت
function formatPrice(price) {
    return Number(price).toLocaleString("fa-IR") + " تومان";
}

// تعداد کل محصولات
function getCartCount() {
    const cart = getCart();

    return cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);
}

// بروزرسانی عدد روی سبد خرید
function updateCartCount() {
    const count = getCartCount();

    const badges = document.querySelectorAll(".cart-count");

    badges.forEach(badge => {
        badge.textContent = count;
    });
}

// اضافه کردن محصول
function addToCart(product) {

    const cart = getCart();

    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            icon: product.icon || "📦",
            quantity: 1
        });

    }

    saveCart(cart);

    showCartMessage(product.name);
}

// حذف محصول
function removeFromCart(productId) {

    let cart = getCart();

    cart = cart.filter(item => item.id !== productId);

    saveCart(cart);

    renderCart();
}

// افزایش تعداد
function increaseQuantity(productId) {

    const cart = getCart();

    const product = cart.find(item => item.id === productId);

    if (product) {
        product.quantity += 1;
    }

    saveCart(cart);

    renderCart();
}

// کاهش تعداد
function decreaseQuantity(productId) {

    const cart = getCart();

    const product = cart.find(item => item.id === productId);

    if (!product) {
        return;
    }

    if (product.quantity > 1) {

        product.quantity -= 1;

    } else {

        const newCart = cart.filter(item => item.id !== productId);

        saveCart(newCart);

        renderCart();

        return;
    }

    saveCart(cart);

    renderCart();
}

// خالی کردن سبد
function clearCart() {

    if (!confirm("آیا مطمئن هستید که می‌خواهید سبد خرید خالی شود؟")) {
        return;
    }

    localStorage.removeItem(CART_KEY);

    updateCartCount();

    renderCart();
}

// محاسبه مبلغ کل
function getCartTotal() {

    const cart = getCart();

    return cart.reduce((total, item) => {

        return total + (item.price * item.quantity);

    }, 0);
}

// نمایش پیام اضافه شدن
function showCartMessage(productName) {

    let message = document.getElementById("cart-message");

    if (!message) {

        message = document.createElement("div");

        message.id = "cart-message";

        message.style.position = "fixed";
        message.style.bottom = "25px";
        message.style.right = "25px";
        message.style.background = "#111827";
        message.style.color = "#ffffff";
        message.style.padding = "14px 20px";
        message.style.borderRadius = "10px";
        message.style.zIndex = "99999";
        message.style.boxShadow = "0 5px 20px rgba(0,0,0,.2)";

        document.body.appendChild(message);
    }

    message.textContent = `✅ ${productName} به سبد خرید اضافه شد`;

    message.style.display = "block";

    clearTimeout(window.cartMessageTimer);

    window.cartMessageTimer = setTimeout(() => {

        message.style.display = "none";

    }, 2000);
}

// نمایش سبد خرید
function renderCart() {

    const container = document.getElementById("cart-items");

    if (!container) {
        return;
    }

    const cart = getCart();

    const totalElement = document.getElementById("cart-total");

    const emptyElement = document.getElementById("empty-cart");

    const cartContent = document.getElementById("cart-content");

    if (cart.length === 0) {

        if (emptyElement) {
            emptyElement.style.display = "block";
        }

        if (cartContent) {
            cartContent.style.display = "none";
        }

        if (totalElement) {
            totalElement.textContent = "۰ تومان";
        }

        return;
    }

    if (emptyElement) {
        emptyElement.style.display = "none";
    }

    if (cartContent) {
        cartContent.style.display = "block";
    }

    container.innerHTML = "";

    cart.forEach(item => {

        const itemElement = document.createElement("div");

        itemElement.className = "cart-item";

        itemElement.innerHTML = `

            <div class="cart-product">

                <div class="cart-product-icon">
                    ${item.icon}
                </div>

                <div>
                    <h3>${item.name}</h3>

                    <div class="cart-price">
                        ${formatPrice(item.price)}
                    </div>
                </div>

            </div>

            <div class="cart-controls">

                <button
                    onclick="decreaseQuantity('${item.id}')"
                    class="quantity-btn">
                    −
                </button>

                <span class="quantity">
                    ${item.quantity}
                </span>

                <button
                    onclick="increaseQuantity('${item.id}')"
                    class="quantity-btn">
                    +
                </button>

            </div>

            <div class="cart-item-total">
                ${formatPrice(item.price * item.quantity)}
            </div>

            <button
                onclick="removeFromCart('${item.id}')"
                class="remove-btn">
                حذف
            </button>

        `;

        container.appendChild(itemElement);

    });

    if (totalElement) {

        totalElement.textContent = formatPrice(getCartTotal());

    }

}

// فعال کردن دکمه‌های افزودن به سبد
function initializeAddToCartButtons() {

    const buttons = document.querySelectorAll(".add-cart");

    buttons.forEach(button => {

        button.addEventListener("click", function () {

            const product = {

                id: this.dataset.id,

                name: this.dataset.name,

                price: Number(this.dataset.price),

                icon: this.dataset.icon || "📦"

            };

            addToCart(product);

        });

    });

}

// اجرای اولیه
document.addEventListener("DOMContentLoaded", function () {

    updateCartCount();

    initializeAddToCartButtons();

    renderCart();

});
