// Cart page script
let cart = [];
window.currentCurrency = 'INR';

function setupNavToggle() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        const isOpen = document.body.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = totalItems;
}

function renderCartItems() {
    const list = document.getElementById('cart-items-list');
    if (!list) return;
    list.innerHTML = '';

    if (!cart || cart.length === 0) {
        list.innerHTML = '<div class="empty-cart"><p>Your cart is empty.</p><a href="../index.php#shop" class="btn">Start Shopping</a></div>';
        return;
    }

    const symbol = '\u20B9';

    cart.forEach((item, idx) => {
        const itemPrice = item.price;
        const totalPrice = itemPrice * item.quantity;

        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="price-breakdown">
                    <span class="item-price">${symbol}${itemPrice.toFixed(2)} each</span>
                </div>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn" onclick="updateQuantity(${idx}, -1)">-</button>
                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantityDirect(${idx}, this.value)">
                <button class="qty-btn" onclick="updateQuantity(${idx}, 1)">+</button>
            </div>
            <div class="cart-item-total">
                <div class="total-price">${symbol}${totalPrice.toFixed(2)}</div>
                <button class="btn btn-outline btn-sm" onclick="removeFromCart(${idx})">Remove</button>
            </div>
        `;
        list.appendChild(row);
    });
}

function updateQuantity(idx, change) {
    if (!cart || !cart[idx]) return;
    cart[idx].quantity = Math.max(1, cart[idx].quantity + change);
    localStorage.setItem('ldCollectionCart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
    updateCartSummary();
}

function updateQuantityDirect(idx, value) {
    if (!cart || !cart[idx]) return;
    const qty = Math.max(1, parseInt(value) || 1);
    cart[idx].quantity = qty;
    localStorage.setItem('ldCollectionCart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
    updateCartSummary();
}

function removeFromCart(idx) {
    if (!cart || !cart[idx]) return;
    if (confirm('Remove this item from cart?')) {
        cart.splice(idx, 1);
        localStorage.setItem('ldCollectionCart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
        updateCartSummary();
    }
}

function updateCartSummary() {
    const symbol = '\u20B9';
    let subtotal = 0;
    if (cart && cart.length > 0) {
        subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    const displaySubtotal = subtotal;
    const tax = 0;
    const total = displaySubtotal + tax;

    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = symbol + displaySubtotal.toFixed(2);
    if (taxEl) taxEl.textContent = symbol + tax.toFixed(2);
    if (totalEl) totalEl.textContent = symbol + total.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
    setupNavToggle();

    const globalCurr = document.getElementById('global-currency');
    if (globalCurr) {
        globalCurr.addEventListener('change', function(){
            window.currentCurrency = this.value;
            renderCartItems();
            updateCartSummary();
        });
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(){
            if (!cart || cart.length === 0) {
                alert('Your cart is empty');
                return;
            }
            window.location.href = 'checkout.php';
        });
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function(){
            if (!cart || cart.length === 0) return;
            if (confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                localStorage.removeItem('ldCollectionCart');
                updateCartCount();
                renderCartItems();
                updateCartSummary();
            }
        });
    }

    const saved = localStorage.getItem('ldCollectionCart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (err) {
            cart = [];
        }
    }
    updateCartCount();
    renderCartItems();
    updateCartSummary();
});

// Expose for inline handlers
window.renderCartItems = renderCartItems;
window.updateQuantity = updateQuantity;
window.updateQuantityDirect = updateQuantityDirect;
window.removeFromCart = removeFromCart;
window.updateCartSummary = updateCartSummary;

