// Admin page script
let products = [];
let orders = [];
const adminChannel = (typeof BroadcastChannel !== 'undefined') ? new BroadcastChannel('ld_collection') : null;
const API_BASE = '../api';

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--accent-color)';
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '6px';
    notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';

    document.body.appendChild(notification);

    setTimeout(() => { notification.style.opacity = '1'; }, 100);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => { notification.remove(); }, 300);
    }, 2500);
}

function saveProductsToStorage() {
    localStorage.setItem('ldProducts', JSON.stringify(products));
    localStorage.setItem('ldProductsUpdated', String(Date.now()));
    if (adminChannel) adminChannel.postMessage({ type: 'productsUpdated' });
}

async function apiFetchProducts() {
    const res = await fetch(`${API_BASE}/products.php`, { cache: 'no-store' });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Failed to load products');
    return data.items || [];
}

async function apiSaveProduct(payload) {
    const res = await fetch(`${API_BASE}/products.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Failed to save product');
    return data.item;
}

async function apiDeleteProduct(id) {
    const res = await fetch(`${API_BASE}/products.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Failed to delete product');
    return true;
}

async function apiFetchOrders() {
    const status = window.currentOrderFilter && window.currentOrderFilter !== 'all'
        ? `?status=${encodeURIComponent(window.currentOrderFilter)}`
        : '';
    const res = await fetch(`${API_BASE}/orders.php${status}`, { cache: 'no-store' });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Failed to load orders');
    return data.items || [];
}

async function apiUpdateOrderStatus(id, status) {
    const res = await fetch(`${API_BASE}/orders.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', id, status })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Failed to update status');
}

async function apiDeleteOrder(id) {
    const res = await fetch(`${API_BASE}/orders.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Failed to delete order');
}

async function loadProductsFromStorage() {
    try {
        const items = await apiFetchProducts();
        products = items.slice();
        saveProductsToStorage();
        return;
    } catch (err) {
        console.warn('API products load failed, using localStorage', err);
    }

    const saved = localStorage.getItem('ldProducts');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length) {
                products = parsed.slice();
            }
        } catch (err) {
            console.error('Failed to parse saved products', err);
        }
    }
}

function renderAdminProducts() {
    const list = document.getElementById('admin-product-list');
    if (!list) return;
    list.innerHTML = '';

    if (!products.length) {
        list.innerHTML = '<div style="color:var(--light-text)">No products yet.</div>';
        return;
    }

    products.forEach(p => {
        const row = document.createElement('div');
        row.className = 'admin-row';
        row.innerHTML = `
            <div class="admin-row-main">
                <img src="${p.image || ''}" alt="${p.name}" onerror="this.style.display='none'">
                <div>
                    <strong>${p.name}</strong>
                    <div class="admin-desc">${p.description || ''}</div>
                    <div class="admin-price">${Number(p.price).toFixed(2)}</div>
                </div>
            </div>
            <div class="admin-row-actions">
                <button class="btn" data-id="${p.id}" onclick="editProduct(${p.id})">Edit</button>
                <button class="btn btn-outline" data-id="${p.id}" onclick="deleteProduct(${p.id})">Delete</button>
            </div>
        `;
        list.appendChild(row);
    });
}

async function handleAdminFormSubmit(e) {
    e.preventDefault();
    const idField = document.getElementById('admin-id');
    const name = document.getElementById('admin-name').value.trim();
    const price = parseFloat(document.getElementById('admin-price').value) || 0;
    const image = document.getElementById('admin-image').value.trim();
    const desc = document.getElementById('admin-desc').value.trim();

    if (!name) return showNotification('Product name is required');

    const idVal = idField.value ? parseInt(idField.value) : null;
    try {
        const saved = await apiSaveProduct({
            id: idVal || undefined,
            name,
            price,
            image,
            description: desc
        });
        if (idVal) {
            const idx = products.findIndex(p => p.id === idVal);
            if (idx > -1) products[idx] = saved;
            showNotification('Product updated');
        } else {
            products.unshift(saved);
            showNotification('Product added');
        }
        saveProductsToStorage();
        renderAdminProducts();
        clearAdminForm();
    } catch (err) {
        console.error(err);
        showNotification('Save failed. Check server/API.');
    }
}

function clearAdminForm() {
    const idField = document.getElementById('admin-id');
    const name = document.getElementById('admin-name');
    const price = document.getElementById('admin-price');
    const image = document.getElementById('admin-image');
    const desc = document.getElementById('admin-desc');
    if (idField) idField.value = '';
    if (name) name.value = '';
    if (price) price.value = '';
    if (image) image.value = '';
    if (desc) desc.value = '';
}

window.editProduct = function(id) {
    const p = products.find(x => x.id === id);
    if (!p) return showNotification('Product not found');
    document.getElementById('admin-id').value = p.id;
    document.getElementById('admin-name').value = p.name || '';
    document.getElementById('admin-price').value = p.price || '';
    document.getElementById('admin-image').value = p.image || '';
    document.getElementById('admin-desc').value = p.description || '';
    const adminSection = document.getElementById('admin-section');
    if (adminSection) {
        window.scrollTo({ top: adminSection.offsetTop - 80, behavior: 'smooth' });
    }
};

window.deleteProduct = async function(id) {
    if (!confirm('Delete this product?')) return;
    try {
        await apiDeleteProduct(id);
        const idx = products.findIndex(p => p.id === id);
        if (idx > -1) products.splice(idx, 1);
        saveProductsToStorage();
        renderAdminProducts();
        showNotification('Product deleted');
    } catch (err) {
        console.error(err);
        showNotification('Delete failed. Check server/API.');
    }
};

window.currentOrderFilter = 'all';
window.renderAdminOrders = function() {
    const container = document.getElementById('admin-orders-list');
    if (!container) return;
    container.innerHTML = '';

    if (!orders.length) {
        container.innerHTML = '<div style="color:var(--light-text)">No orders yet.</div>';
        return;
    }

    const toShow = orders.slice().reverse().filter(o => {
        if (window.currentOrderFilter === 'all') return true;
        return (o.status || 'pending') === window.currentOrderFilter;
    });

    if (!toShow.length) {
        container.innerHTML = '<div style="color:var(--light-text)">No orders for this filter.</div>';
        return;
    }

    toShow.forEach(order => {
        const el = document.createElement('div');
        el.className = 'admin-order-row';
        el.style.display = 'flex';
        el.style.justifyContent = 'space-between';
        el.style.alignItems = 'center';
        el.style.padding = '10px';
        el.style.background = '#fff';
        el.style.borderRadius = '8px';
        el.style.boxShadow = 'var(--shadow)';

        const left = document.createElement('div');
        const customerName = (order.customer && order.customer.name) ? order.customer.name : 'Unknown customer';
        const customerEmail = (order.customer && order.customer.email) ? order.customer.email : 'No email';
        left.innerHTML = `<div><strong>Order ${order.id}</strong> <span style="margin-left:8px; font-weight:600; font-size:0.9rem; color:${order.status==='shipped'? 'green':'#c47b7b'}">${(order.status||'pending').toUpperCase()}</span></div><div style="color:var(--light-text); font-size:0.95rem">${new Date(order.date).toLocaleString()}</div><div style="margin-top:6px">${customerName} — ${customerEmail}</div>`;

        const right = document.createElement('div');
        right.style.display = 'flex';
        right.style.gap = '8px';

        const viewBtn = document.createElement('button');
        viewBtn.className = 'btn';
        viewBtn.textContent = 'View';
        viewBtn.addEventListener('click', () => viewOrder(order.id));

        const statusBtn = document.createElement('button');
        statusBtn.className = 'btn btn-outline';
        statusBtn.textContent = order.status==='shipped' ? 'Shipped' : 'Mark shipped';
        statusBtn.disabled = order.status==='shipped';
        statusBtn.addEventListener('click', () => markOrderShipped(order.id));

        const delBtn = document.createElement('button');
        delBtn.className = 'btn btn-outline';
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => deleteOrder(order.id));

        right.appendChild(viewBtn);
        right.appendChild(statusBtn);
        right.appendChild(delBtn);

        el.appendChild(left);
        el.appendChild(right);
        container.appendChild(el);
    });
};

window.markOrderShipped = async function(orderId) {
    try {
        await apiUpdateOrderStatus(orderId, 'shipped');
        const idx = orders.findIndex(o => o.id === orderId);
        if (idx > -1) orders[idx].status = 'shipped';
        renderAdminOrders();
        showNotification('Order marked as shipped');
    } catch (err) {
        console.error(err);
        showNotification('Status update failed');
    }
};

window.viewOrder = function(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return showNotification('Order not found');
    openOrderModal(order);
};

window.deleteOrder = async function(orderId) {
    if (!confirm('Delete this order?')) return;
    try {
        await apiDeleteOrder(orderId);
        const idx = orders.findIndex(o => o.id === orderId);
        if (idx > -1) orders.splice(idx, 1);
        renderAdminOrders();
        showNotification('Order deleted');
    } catch (err) {
        console.error(err);
        showNotification('Delete failed');
    }
};

// Admin page UI (login, tabs, settings, categories, messages)
const PASSWORD = 'admin123';
const loginBtn = document.getElementById('admin-login-btn');
const loginEmail = document.getElementById('admin-email');
const loginInput = document.getElementById('admin-password');
const loginBox = document.getElementById('admin-login');
const adminSection = document.getElementById('admin-section');
const setupHint = document.getElementById('admin-setup-hint');

function renderDashboard() {
    const productsList = JSON.parse(localStorage.getItem('ldProducts') || '[]');
    const pending = orders.filter(o => (o.status || 'pending') === 'pending').length;
    const messages = JSON.parse(localStorage.getItem('ldMessages') || '[]');

    document.getElementById('stat-products').textContent = productsList.length;
    document.getElementById('stat-orders').textContent = orders.length;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-messages').textContent = messages.length;
}

function renderSettings() {
    const settings = JSON.parse(localStorage.getItem('ldSettings') || '{}');
    document.getElementById('settings-company').value = settings.company || 'LD Collection';
    document.getElementById('settings-email').value = settings.email || 'ld.collection@gmail.com';
    document.getElementById('settings-phone').value = settings.phone || '+91 79849 22434';
    document.getElementById('settings-tagline').value = settings.tagline || 'Handmade with \u2764\uFE0F';
    document.getElementById('settings-discount').value = settings.discount || '0';
    document.getElementById('settings-shipping').value = settings.shipping || '0';
}

function renderCategories() {
    const categories = JSON.parse(localStorage.getItem('ldCategories') || '[]');
    const list = document.getElementById('categories-list');
    list.innerHTML = '';
    if (categories.length === 0) {
        list.innerHTML = '<p style="color:var(--light-text)">No categories yet.</p>';
        return;
    }
    categories.forEach((cat, idx) => {
        const div = document.createElement('div');
        div.style.cssText = 'background:white; padding:15px; border-radius:8px; display:flex; justify-content:space-between; align-items:center';
        div.innerHTML = `
            <div>
                <strong>${cat.name}</strong><br>
                <small style="color:var(--light-text)">${cat.desc}</small>
            </div>
            <button class="btn btn-outline btn-sm" onclick="deleteCategory(${idx})">Delete</button>
        `;
        list.appendChild(div);
    });
}

function renderMessages() {
    const messages = JSON.parse(localStorage.getItem('ldMessages') || '[]');
    const list = document.getElementById('messages-list');
    list.innerHTML = '';
    if (messages.length === 0) {
        list.innerHTML = '<p style="color:var(--light-text)">No messages yet.</p>';
        return;
    }
    messages.slice().reverse().forEach((msg) => {
        const div = document.createElement('div');
        div.className = 'message-item';
        div.innerHTML = `
            <div class="msg-header">
                <strong>${msg.name}</strong>
                <small>${msg.email}</small>
            </div>
            <div class="msg-body">${msg.message}</div>
            <div style="margin-top:10px; font-size:0.85rem; color:var(--light-text)">${new Date(msg.date).toLocaleString()}</div>
        `;
        list.appendChild(div);
    });
}

function showAdmin() {
    loginBox.style.display = 'none';
    adminSection.style.display = '';
    sessionStorage.setItem('isAdmin', '1');
    renderDashboard();
    renderAdminProducts();
    renderAdminOrders();
    renderSettings();
    renderCategories();
    renderMessages();
}

function hideAdmin() {
    loginBox.style.display = '';
    adminSection.style.display = 'none';
    sessionStorage.removeItem('isAdmin');
}

document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', function(){
        const tab = this.getAttribute('data-tab');
        if (tab === 'logout') {
            apiAuth('logout').catch(() => {});
            hideAdmin();
            loginInput.value = '';
            return;
        }
        document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(tab + '-tab').classList.add('active');
    });
});

if (sessionStorage.getItem('isAdmin') === '1') showAdmin();

if (loginBtn) {
    loginBtn.addEventListener('click', function(){
        if (!loginEmail || !loginEmail.value.trim()) {
            alert('ld.collection@gmail.com');
            return;
        }
        apiAuth('login', loginInput.value, loginEmail.value.trim())
            .then(() => showAdmin())
            .catch(() => alert('h12032025d'));
    });
    loginInput.addEventListener('keypress', function(e){
        if (e.key === 'Enter') {
            if (!loginEmail || !loginEmail.value.trim()) {
                alert('ld.collection@gmail.com');
                return;
            }
            apiAuth('login', loginInput.value, loginEmail.value.trim())
                .then(() => showAdmin())
                .catch(() => alert('h12032025d'));
        }
    });
}

const settingsForm = document.getElementById('settings-form');
if (settingsForm) settingsForm.addEventListener('submit', function(e){
    e.preventDefault();
    const settings = {
        company: document.getElementById('settings-company').value,
        email: document.getElementById('settings-email').value,
        phone: document.getElementById('settings-phone').value,
        tagline: document.getElementById('settings-tagline').value,
        discount: parseInt(document.getElementById('settings-discount').value) || 0,
        shipping: parseFloat(document.getElementById('settings-shipping').value) || 0
    };
    localStorage.setItem('ldSettings', JSON.stringify(settings));
    alert('Settings saved!');
});

const settingsReset = document.getElementById('settings-reset');
if (settingsReset) settingsReset.addEventListener('click', function(){
    localStorage.removeItem('ldSettings');
    renderSettings();
    alert('Settings reset to defaults!');
});

const categoriesForm = document.getElementById('categories-form');
if (categoriesForm) categoriesForm.addEventListener('submit', function(e){
    e.preventDefault();
    const categories = JSON.parse(localStorage.getItem('ldCategories') || '[]');
    categories.push({
        name: document.getElementById('category-name').value,
        desc: document.getElementById('category-desc').value
    });
    localStorage.setItem('ldCategories', JSON.stringify(categories));
    this.reset();
    renderCategories();
    alert('Category added!');
});

window.deleteCategory = function(idx) {
    if (!confirm('Delete this category?')) return;
    const categories = JSON.parse(localStorage.getItem('ldCategories') || '[]');
    categories.splice(idx, 1);
    localStorage.setItem('ldCategories', JSON.stringify(categories));
    renderCategories();
};

window.saveContactMessage = function(name, email, message) {
    const messages = JSON.parse(localStorage.getItem('ldMessages') || '[]');
    messages.push({ name, email, message, date: new Date().toISOString() });
    localStorage.setItem('ldMessages', JSON.stringify(messages));
};

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthAndInit();
    await checkAdminExistsUI();
    await loadProductsFromStorage();
    renderAdminProducts();

    await loadOrdersFromApi();
    renderAdminOrders();

    const adminForm = document.getElementById('admin-form');
    const adminClear = document.getElementById('admin-clear');
    if (adminForm) adminForm.addEventListener('submit', handleAdminFormSubmit);
    if (adminClear) adminClear.addEventListener('click', clearAdminForm);

    const filterAll = document.getElementById('orders-filter-all');
    const filterPending = document.getElementById('orders-filter-pending');
    const filterShipped = document.getElementById('orders-filter-shipped');
    if (filterAll) filterAll.addEventListener('click', async () => { window.currentOrderFilter='all'; await loadOrdersFromApi(); renderAdminOrders(); updateFilterButtons(); });
    if (filterPending) filterPending.addEventListener('click', async () => { window.currentOrderFilter='pending'; await loadOrdersFromApi(); renderAdminOrders(); updateFilterButtons(); });
    if (filterShipped) filterShipped.addEventListener('click', async () => { window.currentOrderFilter='shipped'; await loadOrdersFromApi(); renderAdminOrders(); updateFilterButtons(); });

    function updateFilterButtons(){
        if (!filterAll) return;
        [filterAll, filterPending, filterShipped].forEach(b => b.classList && b.classList.remove('active-filter'));
        const map = { all: filterAll, pending: filterPending, shipped: filterShipped };
        const el = map[window.currentOrderFilter];
        if (el) el.classList.add('active-filter');
    }
    updateFilterButtons();
});

async function checkAdminExistsUI() {
    if (!setupHint) return;
    try {
        const res = await apiAuth('has_admin');
        if (res && res.hasAdmin === false) {
            setupHint.style.display = 'block';
        }
    } catch (err) {
        // no-op: keep hint hidden on errors
    }
}

async function loadOrdersFromApi() {
    try {
        orders = await apiFetchOrders();
    } catch (err) {
        console.warn('API orders load failed, using localStorage', err);
        const saved = localStorage.getItem('ldOrders');
        try { orders = saved ? JSON.parse(saved) : []; } catch (e) { orders = []; }
    }
}

function openOrderModal(order) {
    const modal = document.getElementById('order-modal');
    const content = document.getElementById('order-modal-content');
    const closeBtn = document.getElementById('order-modal-close');
    if (!modal || !content) return;

    const itemsHtml = (order.items || []).map(it => `
        <tr>
            <td style="padding:8px; border-bottom:1px solid #eee">${it.name}</td>
            <td style="padding:8px; border-bottom:1px solid #eee; text-align:center">${it.quantity}</td>
            <td style="padding:8px; border-bottom:1px solid #eee; text-align:right">${Number(it.price).toFixed(2)}</td>
        </tr>
    `).join('');

    content.innerHTML = `
        <h2 style="margin-top:0">Order ${order.id}</h2>
        <div style="color:var(--light-text); margin-bottom:12px">${new Date(order.date).toLocaleString()}</div>
        <div style="margin-bottom:12px"><strong>Status:</strong> ${(order.status || 'pending').toUpperCase()}</div>
        <h3>Customer</h3>
        <p style="margin:0 0 6px"><strong>${order.customer.name}</strong></p>
        <p style="margin:0 0 6px">${order.customer.email}</p>
        <p style="margin:0 0 6px">${order.customer.phone || ''}</p>
        <p style="margin:0 0 12px">${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pin}</p>
        <h3>Items</h3>
        <table style="width:100%; border-collapse:collapse; margin-bottom:12px">
            <thead>
                <tr style="background:#F3C5C5; color:white">
                    <th style="padding:8px; text-align:left">Product</th>
                    <th style="padding:8px; text-align:center">Qty</th>
                    <th style="padding:8px; text-align:right">Price</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml || '<tr><td colspan="3" style="padding:8px">No items</td></tr>'}
            </tbody>
        </table>
        <div style="text-align:right; font-weight:700">Total: ${Number(order.total).toFixed(2)} ${order.currency || ''}</div>
    `;

    modal.style.display = 'flex';
    if (closeBtn) closeBtn.onclick = () => { modal.style.display = 'none'; };
    modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
}

async function apiAuth(action, password, email) {
    const res = await fetch(`${API_BASE}/auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, password, email })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Auth failed');
    return data;
}

async function checkAuthAndInit() {
    try {
        const res = await apiAuth('check');
        if (res.isAdmin) {
            showAdmin();
        } else {
            hideAdmin();
        }
    } catch (err) {
        hideAdmin();
    }
}
