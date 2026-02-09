// Page script
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
    const saved = localStorage.getItem('ldCollectionCart');
    let cart = [];
    try { cart = saved ? JSON.parse(saved) : []; } catch (err) { cart = []; }
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = totalItems;
}

document.addEventListener('DOMContentLoaded', () => {
    setupNavToggle();
    updateCartCount();
});
