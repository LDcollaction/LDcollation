// Index page script
// Handle full-screen logo overlay
const handleLogoOverlay = () => {
    const overlays = document.querySelectorAll('.fullscreen-logo-overlay');

    if (overlays && overlays.length) {
        document.body.classList.add('overlay-active');

        setTimeout(() => {
            document.body.classList.remove('overlay-active');
            overlays.forEach(o => o.remove());
        }, 4500);

        overlays.forEach(overlay => {
            overlay.addEventListener('click', () => {
                overlay.style.animation = 'fadeOut 0.5s ease-out forwards';
                document.body.classList.remove('overlay-active');
                setTimeout(() => overlay.remove(), 500);
            });
        });
    }
};

// Sample product data
const products = [
    {
        id: 1,
        name: "Personalized Mug",
        price: 1649,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Customizable mug for your special someone"
    },
    {
        id: 2,
        name: "Photo Frame",
        price: 2049,
        image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Elegant frame to cherish your memories"
    },
    {
        id: 3,
        name: "Scented Candle",
        price: 1229,
        image: "https://images.unsplash.com/photo-1580325934019-5094c44cda58?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Hand-poured scented candle for relaxing evenings"
    },
    {
        id: 4,
        name: "Custom Tote Bag",
        price: 1899,
        image: "https://images.unsplash.com/photo-1567401623024-8c3f6a2e7c3e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Stylish and eco-friendly tote bag with custom print"
    },
    {
        id: 5,
        name: "Jewelry Box",
        price: 2869,
        image: "https://images.unsplash.com/photo-1584917867776-a4d272f64848?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Elegant box to keep your precious jewelry safe"
    },
    {
        id: 6,
        name: "Custom Pillow",
        price: 2295,
        image: "https://images.unsplash.com/photo-1576566588028-414b7a6ad3f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Soft and cozy pillow with custom design"
    }
];

let cart = [];
window.currentCurrency = 'INR';
const siteChannel = (typeof BroadcastChannel !== 'undefined') ? new BroadcastChannel('ld_collection') : null;
const API_BASE = 'api';

const productGrid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');
const contactForm = document.getElementById('contact-form');

function displayProducts(list = products) {
    if (!productGrid) return;
    productGrid.innerHTML = '';

    if (!list.length) {
        productGrid.innerHTML = '<div style="color:var(--light-text); text-align:center; padding:20px 0">No products found.</div>';
        return;
    }

    list.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price-display">
                    <span class="price-inr" style="font-size:1.3rem; font-weight:600">\u20B9${product.price}</span>
                </div>
                <div style="display:flex; gap:8px">
                    <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);

    if (product) {
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        updateCartCount();
        localStorage.setItem('ldCollectionCart', JSON.stringify(cart));
        showNotification(`${product.name} added to cart!`);
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    localStorage.setItem('ldCollectionCart', JSON.stringify(cart));
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--accent-color)';
    notification.style.color = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        const messages = JSON.parse(localStorage.getItem('ldMessages') || '[]');
        messages.push({ name, email, message, date: new Date().toISOString() });
        localStorage.setItem('ldMessages', JSON.stringify(messages));

        console.log('Form submitted:', { name, email, message });
        showNotification('Thank you for your message! We\'ll get back to you soon.');
        contactForm.reset();
    });
}

function updateCountdown() {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const diff = endOfDay - now;

    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        countdownElement.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
    }

    setTimeout(updateCountdown, 1000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Make category cards clickable
document.querySelectorAll('.category-card[data-link]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        const isLink = e.target.closest('a');
        if (isLink) return;
        const link = card.getAttribute('data-link');
        if (link) window.location.href = link;
    });
});

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.product-card, .custom-option, .about p, .contact-content > div');
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

function setupSearch() {
    const input = document.getElementById('site-search');
    const clearBtn = document.getElementById('search-clear');
    const searchLink = document.querySelector('.nav-search');
    const suggestionsEl = document.getElementById('search-suggestions');
    if (!input) return;

    const runFilter = () => {
        const q = input.value.trim().toLowerCase();
        const filtered = q
            ? products.filter(p => {
                const name = (p.name || '').toLowerCase();
                const desc = (p.description || '').toLowerCase();
                return name.includes(q) || desc.includes(q);
            })
            : products;
        displayProducts(filtered);

        if (q) {
            const shop = document.getElementById('shop');
            if (shop) {
                shop.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    input.addEventListener('input', runFilter);
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            input.value = '';
            displayProducts();
            input.focus();
        });
    }
        if (searchLink) {
        searchLink.addEventListener('click', (e) => {
            e.preventDefault();
            input.focus();
        });
        
    }

}

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

async function loadProductsFromStorage() {
    try {
        const res = await fetch(`${API_BASE}/products.php`, { cache: 'no-store' });
        const data = await res.json();
        if (data.ok && Array.isArray(data.items)) {
            products.length = 0;
            data.items.forEach(p => products.push(p));
            localStorage.setItem('ldProducts', JSON.stringify(products));
            return;
        }
    } catch (err) {
        console.warn('API products load failed, using localStorage', err);
    }

    const saved = localStorage.getItem('ldProducts');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length) {
                products.length = 0;
                parsed.forEach(p => products.push(p));
            }
        } catch (err) {
            console.error('Failed to parse saved products', err);
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    handleLogoOverlay();
    setupNavToggle();
    setupSearch();

    const savedCart = localStorage.getItem('ldCollectionCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }

    await loadProductsFromStorage();
    displayProducts();

    if (document.querySelector('.promo-banner')) {
        updateCountdown();
    }

    const elements = document.querySelectorAll('.product-card, .custom-option, .about p, .contact-content > div');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    setTimeout(animateOnScroll, 300);
});

window.addEventListener('scroll', animateOnScroll);

// Live updates from admin panel (same device)
if (siteChannel) {
    siteChannel.addEventListener('message', (event) => {
        if (!event || !event.data) return;
        if (event.data.type === 'productsUpdated') {
            loadProductsFromStorage();
            displayProducts();
        }
    });
}

window.addEventListener('storage', (e) => {
    if (e.key === 'ldProducts' || e.key === 'ldProductsUpdated') {
        loadProductsFromStorage();
        displayProducts();
    }
});

// Initialize EmailJS and currency
if (window.emailjs && typeof window.emailjs.init === 'function') {
    emailjs.init('YOUR_EMAILJS_PUBLIC_KEY');
}
