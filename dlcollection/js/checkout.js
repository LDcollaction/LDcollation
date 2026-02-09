// Checkout page script
window.currentCurrency = 'INR';
let selectedUpiApp = '';

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

document.addEventListener('DOMContentLoaded', () => {
    setupNavToggle();
    loadCheckoutData();
    setupCheckoutForm();
    generateCheckoutUpiQr();
    setupUpiQrClick();
    setupUpiAppButtons();
});

function setupUpiAppButtons() {
    const buttons = document.querySelectorAll('.upi-app-btn');
    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedUpiApp = btn.getAttribute('data-app') || '';
            openSelectedUpiApp();
        });
    });
}

function setupUpiQrClick() {
    const container = document.getElementById('upi-qr-container');
    if (!container) return;
    container.style.cursor = 'pointer';
    container.addEventListener('click', () => {
        const saved = localStorage.getItem('ldCollectionCart');
        let cart = [];
        try {
            cart = saved ? JSON.parse(saved) : [];
        } catch (err) {
            cart = [];
        }
        const total = cart.reduce((s, it) => s + (it.price * it.quantity), 0);
        const amountInr = Math.round(total * 100) / 100;
        const upiLink = buildUpiLink(amountInr);
        window.location.href = upiLink;
    });
}

function loadCheckoutData() {
    const saved = localStorage.getItem('ldCollectionCart');
    let cart = [];
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (err) {
            cart = [];
        }
    }

    const itemsDiv = document.getElementById('order-items');
    itemsDiv.innerHTML = '';

    if (!cart || cart.length === 0) {
        itemsDiv.innerHTML = '<p style="color:#999">No items in cart</p>';
        updateCheckoutSummary([]);
        return;
    }

    const symbol = '\u20B9';
    cart.forEach(item => {
        const itemPrice = item.price;
        const totalPrice = itemPrice * item.quantity;

        const div = document.createElement('div');
        div.style.cssText = 'padding:10px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center';
        div.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                <span style="font-size:0.9rem; color:#888">Qty: ${item.quantity}</span>
            </div>
            <div style="text-align:right; font-weight:600">${symbol}${totalPrice.toFixed(2)}</div>
        `;
        itemsDiv.appendChild(div);
    });

    updateCheckoutSummary(cart);
}

function updateCheckoutSummary(cart) {
    const symbol = '\u20B9';
    let subtotal = 0;

    if (cart && cart.length > 0) {
        subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    const displaySubtotal = subtotal;
    const tax = 0;
    const total = displaySubtotal + tax;

    document.getElementById('summary-subtotal').textContent = symbol + displaySubtotal.toFixed(2);
    document.getElementById('summary-tax').textContent = symbol + tax.toFixed(2);
    document.getElementById('summary-total').textContent = symbol + total.toFixed(2);
}

function generateCheckoutUpiQr() {
    const container = document.getElementById('upi-qr-container');
    if (!container) return;
    if (container.querySelector('img')) return;
    container.innerHTML = '';

    const saved = localStorage.getItem('ldCollectionCart');
    let cart = [];
    try {
        cart = saved ? JSON.parse(saved) : [];
    } catch (err) {
        cart = [];
    }

    const total = cart.reduce((s, it) => s + (it.price * it.quantity), 0);
    const amountInr = Math.round(total * 100) / 100;
    const upiString = `upi://pay?pa=pandordhaval05@ybl&pn=LD%20Collection&am=${amountInr}&tn=LD%20Collection%20Order`;

    try {
        new QRCode(container, {
            text: upiString,
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (err) {
        console.error('QR generation failed:', err);
        container.innerHTML = '<p style="color:red">QR Code generation failed</p>';
    }
}

function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', handleCheckoutFormSubmit);
    }
}

function handleCheckoutFormSubmit(e) {
    e.preventDefault();

    const saved = localStorage.getItem('ldCollectionCart');
    let cart = [];
    try {
        cart = saved ? JSON.parse(saved) : [];
    } catch (err) {
        cart = [];
    }

    if (!cart || cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    const name = document.getElementById('cust-name').value.trim();
    const email = document.getElementById('cust-email').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const address = document.getElementById('cust-address').value.trim();
    const city = document.getElementById('cust-city').value.trim();
    const state = document.getElementById('cust-state').value.trim();
    const pin = document.getElementById('cust-pin').value.trim();
    const currency = 'INR';

    if (!name || !email || !phone || !address || !city || !state || !pin) {
        alert('Please fill all customer details');
        return;
    }

    processUpiPayment(name, email, phone, address, city, state, pin, currency, cart);
}

function buildUpiLink(amountInr) {
    const baseQuery = `pa=pandordhaval05@ybl&pn=LD%20Collection&am=${amountInr}&tn=LD%20Collection%20Order`;
    return `upi://pay?${baseQuery}`;
}

function buildUpiLinkForApp(amountInr, app) {
    const baseQuery = `pa=pandordhaval05@ybl&pn=LD%20Collection&am=${amountInr}&tn=LD%20Collection%20Order`;
    if (app === 'phonepe') return `phonepe://pay?${baseQuery}`;
    if (app === 'gpay') return `gpay://upi/pay?${baseQuery}`;
    return `upi://pay?${baseQuery}`;
}

function openSelectedUpiApp() {
    const saved = localStorage.getItem('ldCollectionCart');
    let cart = [];
    try {
        cart = saved ? JSON.parse(saved) : [];
    } catch (err) {
        cart = [];
    }
    const total = cart.reduce((s, it) => s + (it.price * it.quantity), 0);
    const amountInr = Math.round(total * 100) / 100;
    const link = buildUpiLinkForApp(amountInr, selectedUpiApp);
    window.location.href = link;
}

function processUpiPayment(name, email, phone, address, city, state, pin, currency, cart) {
    const total = cart.reduce((s, it) => s + (it.price * it.quantity), 0);
    const amountInr = Math.round(total * 100) / 100;
    const upiLink = buildUpiLink(amountInr);

    try {
        window.location.href = upiLink;

        const status = document.getElementById('checkout-status');
        if (status) {
            status.innerHTML = `<div style="padding:10px; background:#fff9e6; border:1px solid #ffeb3b; border-radius:6px;">
                <strong>Opening your UPI app...</strong><br>
                <p>After payment, click below to confirm:</p>
                <button type="button" onclick="confirmUpiPayment('${name}','${email}','${phone}','${address}','${city}','${state}','${pin}','${currency}')" class="btn" style="margin-top:10px">Confirm Payment</button>
            </div>`;
        }
    } catch (err) {
        alert('UPI app not found. Please use the QR code or try card payment.');
    }
}

window.confirmUpiPayment = function(name, email, phone, address, city, state, pin, currency) {
    const saved = localStorage.getItem('ldCollectionCart');
    let cart = [];
    try {
        cart = saved ? JSON.parse(saved) : [];
    } catch (err) {
        cart = [];
    }
    completePayment(name, email, phone, address, city, state, pin, currency, cart, 'upi');
};

function completePayment(name, email, phone, address, city, state, pin, currency, cart, method) {
    const total = cart.reduce((s, it) => s + (it.price * it.quantity), 0);

    const order = {
        id: 'ORD' + Date.now(),
        date: new Date().toISOString(),
        items: cart,
        total: total,
        currency: currency,
        paymentMethod: method,
        customer: { name, email, phone, address, city, state, pin },
        status: 'pending'
    };

    const saved = localStorage.getItem('ldOrders');
    let orders = [];
    try {
        orders = saved ? JSON.parse(saved) : [];
    } catch (err) {
        orders = [];
    }
    orders.push(order);
    localStorage.setItem('ldOrders', JSON.stringify(orders));

    localStorage.removeItem('ldCollectionCart');

    showCheckoutReceipt(order);
    sendCheckoutEmail(order);
    sendAdminOrderEmail(order);
    saveOrderToDb(order);
}

function saveOrderToDb(order) {
    try {
        fetch('../api/orders.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        }).catch(err => console.error('Order DB save failed:', err));
    } catch (err) {
        console.error('Order DB save failed:', err);
    }
}

function sendAdminOrderEmail(order) {
    try {
        fetch('../send-order.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                order_id: order.id,
                order_date: order.date,
                total: order.total,
                currency: order.currency,
                payment_method: order.paymentMethod,
                customer: order.customer,
                items: order.items
            })
        }).catch(err => console.error('Admin email send failed:', err));
    } catch (err) {
        console.error('Admin email send failed:', err);
    }
}

function generateCheckoutInvoiceHtml(order) {
    const symbol = '\u20B9';
    const itemsHtml = order.items.map(item => {
        const itemPrice = item.price * item.quantity;
        return `
            <tr>
                <td style="padding:8px; border-bottom:1px solid #eee">${item.name}</td>
                <td style="padding:8px; border-bottom:1px solid #eee; text-align:center">${item.quantity}</td>
                <td style="padding:8px; border-bottom:1px solid #eee; text-align:right">${symbol}${itemPrice.toFixed(2)}</td>
            </tr>
        `;
    }).join('');

    return `
        <div id="invoice-container" style="padding:30px; background:white; font-family:Arial,sans-serif; color:#333">
            <div style="text-align:center; margin-bottom:30px">
                <h1 style="margin:0; color:#D4A5A5">LD Collection</h1>
                <p style="margin:5px 0 0; color:#888">Handmade with \u2764\uFE0F</p>
                <p style="margin:10px 0 0; font-size:14px; color:#888">Order Invoice</p>
            </div>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:30px; margin-bottom:30px">
                <div>
                    <h3 style="margin:0 0 10px; font-size:14px; color:#D4A5A5">Order Details</h3>
                    <p style="margin:4px 0"><strong>Order ID:</strong> ${order.id}</p>
                    <p style="margin:4px 0"><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                    <p style="margin:4px 0"><strong>Payment:</strong> ${order.paymentMethod} (INR)</p>
                </div>
                
                <div>
                    <h3 style="margin:0 0 10px; font-size:14px; color:#D4A5A5">Billing Address</h3>
                    <p style="margin:4px 0"><strong>${order.customer.name}</strong></p>
                    <p style="margin:4px 0">${order.customer.email}</p>
                    <p style="margin:4px 0">${order.customer.address}</p>
                </div>
            </div>
            
            <h3 style="margin:20px 0 10px; font-size:14px; color:#D4A5A5">Items</h3>
            <table style="width:100%; border-collapse:collapse; margin-bottom:20px">
                <thead>
                    <tr style="background:#F3C5C5; color:white">
                        <th style="padding:10px; text-align:left">Product</th>
                        <th style="padding:10px; text-align:center">Qty</th>
                        <th style="padding:10px; text-align:right">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            
            <div style="text-align:right; margin-bottom:20px">
                <p style="margin:10px 0; font-size:16px"><strong>Total: ${symbol}${Number(order.total).toFixed(2)}</strong></p>
            </div>
            
            <hr style="border:none; border-top:1px solid #ddd; margin:20px 0">
            
            <div style="text-align:center; color:#888; font-size:12px">
                <p>Thank you for your order! We will ship it soon.</p>
                <p>For inquiries, contact: <strong>ld.callection@gmail.com</strong></p>
                <p>This is an automated invoice. Please keep it for your records.</p>
            </div>
        </div>
    `;
}

function showCheckoutReceipt(order) {
    const modal = document.getElementById('receipt-modal');
    const content = document.getElementById('receipt-content');

    if (!modal || !content) return;

    content.innerHTML = generateCheckoutInvoiceHtml(order);

    document.getElementById('receipt-print-btn').onclick = () => window.print();
    document.getElementById('receipt-pdf-btn').onclick = () => downloadCheckoutPdf(order);
    document.getElementById('receipt-close-btn').onclick = () => {
        modal.style.display = 'none';
        window.location.href = '../index.php';
    };
    document.getElementById('receipt-close').onclick = () => {
        modal.style.display = 'none';
        window.location.href = '../index.php';
    };

    modal.style.display = 'flex';
}

function sendCheckoutEmail(order) {
    try {
        emailjs.init('YOUR_EMAILJS_PUBLIC_KEY');

        const invoiceHtml = generateCheckoutInvoiceHtml(order);
        const templateParams = {
            to_email: order.customer.email,
            to_name: order.customer.name,
            order_id: order.id,
            order_total: order.total + ' INR',
            invoice_html: invoiceHtml,
            reply_to: 'ld.callection@gmail.com'
        };

        emailjs.send('service_ldcollection', 'template_receipt', templateParams)
            .then(() => console.log('Receipt sent'))
            .catch(err => console.error('Email failed:', err));
    } catch (err) {
        console.error('Email setup failed:', err);
    }
}

function downloadCheckoutPdf(order) {
    try {
        const element = document.getElementById('invoice-container');
        if (!element) return;

        const opt = {
            margin: 10,
            filename: `Invoice_${order.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        };

        html2pdf().set(opt).from(element).save();
    } catch (err) {
        console.error('PDF download failed:', err);
    }
}

