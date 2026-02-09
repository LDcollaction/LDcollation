<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LD Collection - Admin Dashboard</title>
    <link rel="stylesheet" href="../css/admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .admin-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
        .admin-tabs button { padding: 10px 20px; border: 2px solid #ddd; background: white; border-radius: 6px; cursor: pointer; transition: all 0.3s; }
        .admin-tabs button.active { background: var(--accent-dark); color: white; border-color: var(--accent-dark); }
        .admin-tab-content { display: none; }
        .admin-tab-content.active { display: block; }
        .admin-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .stat-box { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center; }
        .stat-box h4 { margin: 0 0 10px; color: var(--text-color); }
        .stat-box .number { font-size: 2rem; font-weight: 700; color: var(--accent-dark); }
        .message-item { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid var(--accent-color); margin-bottom: 10px; }
        .message-item .msg-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .message-item .msg-header strong { color: var(--text-color); }
        .message-item .msg-header small { color: var(--light-text); }
        .message-item .msg-body { color: var(--light-text); line-height: 1.6; }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="logo">
                <a href="../index.php">
                    <img src="../images/logo.jpeg" alt="LD Collection" class="brand-logo">
                </a>
            </div>
        </div>
    </header>

    <main style="padding-top:110px">
        <div class="container">
            <h1>Admin Dashboard</h1>

            <div id="admin-login" style="max-width:420px; margin-bottom:20px">
                <p>This page is for administrators only. Enter the admin password to continue.</p>
                <div style="display:flex; gap:8px; flex-direction:column">
                    <input id="admin-email" type="email" placeholder="Admin email" style="padding:10px; border-radius:8px; border:1px solid #ddd">
                    <input id="admin-password" type="password" placeholder="Admin password" style="padding:10px; border-radius:8px; border:1px solid #ddd">
                    <button id="admin-login-btn" class="btn">Enter</button>
                </div>
                <p style="margin-top:8px; color:var(--light-text); font-size:0.95rem">Use your admin email + password</p>
                <div id="admin-setup-hint" style="display:none; margin-top:14px; padding:12px; border-radius:8px; background:#fff7f0; border:1px solid #f2d4c0; color:#8a5a3c; font-size:0.95rem">
                    No admin user found. <a href="admin-setup.php" style="color:#c46a3a; font-weight:600">Set up an admin user</a>.
                </div>
            </div>

            <section id="admin-section" style="display:none">
                <!-- Tab Navigation -->
                <div class="admin-tabs">
                    <button class="admin-tab-btn active" data-tab="dashboard"><i class="fas fa-chart-line"></i> Dashboard</button>
                    <button class="admin-tab-btn" data-tab="products"><i class="fas fa-box"></i> Products</button>
                    <button class="admin-tab-btn" data-tab="orders"><i class="fas fa-shopping-bag"></i> Orders</button>
                    <button class="admin-tab-btn" data-tab="settings"><i class="fas fa-cog"></i> Settings</button>
                    <button class="admin-tab-btn" data-tab="categories"><i class="fas fa-tags"></i> Categories</button>
                    <button class="admin-tab-btn" data-tab="messages"><i class="fas fa-envelope"></i> Messages</button>
                    <button class="admin-tab-btn" data-tab="logout"><i class="fas fa-sign-out-alt"></i> Logout</button>
                </div>

                <!-- Dashboard Tab -->
                <div id="dashboard-tab" class="admin-tab-content active">
                    <h2>Dashboard Overview</h2>
                    <div style="background:#f0f8ff; border:1px solid #D4A5A5; border-radius:8px; padding:12px; margin-bottom:20px; font-size:0.95rem">
                        <strong>Currency:</strong> All prices are in <strong>INR (&#8377;) - Indian Rupees</strong>
                    </div>
                    <div class="admin-stats">
                        <div class="stat-box">
                            <h4>Total Products</h4>
                            <div class="number" id="stat-products">0</div>
                        </div>
                        <div class="stat-box">
                            <h4>Total Orders</h4>
                            <div class="number" id="stat-orders">0</div>
                        </div>
                        <div class="stat-box">
                            <h4>Pending Orders</h4>
                            <div class="number" id="stat-pending">0</div>
                        </div>
                        <div class="stat-box">
                            <h4>Messages</h4>
                            <div class="number" id="stat-messages">0</div>
                        </div>
                    </div>
                </div>

                <!-- Products Tab -->
                <div id="products-tab" class="admin-tab-content">
                    <h2>Manage Products</h2>
                    <div class="admin-grid">
                        <form id="admin-form" class="admin-form">
                            <input type="hidden" id="admin-id">
                            <label>Name</label>
                            <input type="text" id="admin-name" required placeholder="Product name">
                            <label>Price (&#8377; INR)</label>
                            <input type="number" id="admin-price" step="0.01" required placeholder="Enter price in INR">
                            <label>Image URL / Path</label>
                            <input type="text" id="admin-image" placeholder="https://... or images/your-file.jpg">
                            <label>Description</label>
                            <textarea id="admin-desc" rows="3" placeholder="Short description"></textarea>
                            <div class="admin-form-actions">
                                <button type="submit" class="btn">Add / Update</button>
                                <button type="button" class="btn btn-outline" id="admin-clear">Clear</button>
                            </div>
                        </form>
                        <div class="admin-list">
                            <h3>Products</h3>
                            <div id="admin-product-list" class="admin-product-list"></div>
                        </div>
                    </div>
                </div>

                <!-- Orders Tab -->
                <div id="orders-tab" class="admin-tab-content">
                    <h2>Manage Orders</h2>
                    <div class="orders-toolbar" style="display:flex; gap:8px; align-items:center; margin-bottom:15px">
                        <span style="color:var(--light-text); font-size:0.95rem">Filter:</span>
                        <button id="orders-filter-all" class="btn">All</button>
                        <button id="orders-filter-pending" class="btn btn-outline">Pending</button>
                        <button id="orders-filter-shipped" class="btn btn-outline">Shipped</button>
                    </div>
                    <div id="admin-orders-list" style="display:flex; flex-direction:column; gap:12px"></div>
                </div>

                <!-- Settings Tab -->
                <div id="settings-tab" class="admin-tab-content">
                    <h2>Website Settings</h2>
                    <form id="settings-form" class="admin-form" style="max-width:500px">
                        <label>Company Name</label>
                        <input type="text" id="settings-company" placeholder="LD Collection">
                        <label>Contact Email</label>
                        <input type="email" id="settings-email" placeholder="ld.collection@gmail.com">
                        <label>Phone Number</label>
                        <input type="tel" id="settings-phone" placeholder="+91 79849 22434">
                        <label>Tagline</label>
                        <input type="text" id="settings-tagline" placeholder="Handmade with &#10084;&#65039;">
                        <label>Currency</label>
                        <input type="text" value="INR (₹) - Indian Rupees" readonly style="background:#f5f5f5; cursor:not-allowed">
                        <label>Discount Percentage</label>
                        <input type="number" id="settings-discount" min="0" max="100" placeholder="0">
                        <label>Shipping Cost (&#8377; INR)</label>
                        <input type="number" id="settings-shipping" step="0.01" placeholder="0">
                        <div class="admin-form-actions">
                            <button type="submit" class="btn">Save Settings</button>
                            <button type="button" class="btn btn-outline" id="settings-reset">Reset</button>
                        </div>
                    </form>
                </div>

                <!-- Categories Tab -->
                <div id="categories-tab" class="admin-tab-content">
                    <h2>Manage Categories</h2>
                    <form id="categories-form" class="admin-form" style="max-width:500px">
                        <label>Category Name</label>
                        <input type="text" id="category-name" placeholder="e.g., Personalized Gifts">
                        <label>Description</label>
                        <textarea id="category-desc" rows="2" placeholder="Brief description"></textarea>
                        <div class="admin-form-actions">
                            <button type="submit" class="btn">Add Category</button>
                        </div>
                    </form>
                    <h3 style="margin-top:30px">Categories List</h3>
                    <div id="categories-list" style="display:flex; flex-direction:column; gap:8px"></div>
                </div>

                <!-- Messages Tab -->
                <div id="messages-tab" class="admin-tab-content">
                    <h2>Customer Messages</h2>
                    <div id="messages-list" style="display:flex; flex-direction:column; gap:12px">
                        <p style="color:var(--light-text)">No messages yet.</p>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <script src="../js/admin.js"></script>
    <!-- Order Details Modal -->
    <div id="order-modal" class="modal" style="display:none">
        <div class="modal-content" style="max-width:720px">
            <button class="modal-close" id="order-modal-close">&times;</button>
            <div id="order-modal-content"></div>
        </div>
    </div>
</body>
</html>



