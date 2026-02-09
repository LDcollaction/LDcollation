<?php
$base = $base ?? '../';
$home = $base . 'index.php';
$admin = $base . 'pages/admin.php';
?>
<!-- Header -->
<header>
    <div class="container">
        <div class="logo">
            <a href="<?php echo $home; ?>">
                <img src="<?php echo $base; ?>images/logo.jpeg" alt="LD Collection" class="brand-logo">
            </a>
            <p class="tagline">Handmade with &#10084;&#65039;</p>
        </div>
        <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="main-nav"><span></span><span></span><span></span></button>
        <nav id="main-nav">
            <ul>
                <li><a href="<?php echo $home; ?>">Home</a></li>
                <li><a href="<?php echo $home; ?>#shop">Shop</a></li>
                <li><a href="<?php echo $home; ?>#custom">Custom Gifts</a></li>
                <li><a href="<?php echo $home; ?>#about">About Us</a></li>
                <li><a href="<?php echo $home; ?>#contact">Contact</a></li>
                <li><a href="<?php echo $admin; ?>" style="color:#D4A5A5; font-weight:600"><i class="fas fa-lock"></i> Admin</a></li>
                <li style="display:flex; align-items:center; gap:8px"><select id="global-currency" style="padding:6px 8px; border-radius:4px; border:1px solid #ddd; background:white"><option value="INR" selected>INR (&#8377;)</option></select></li>
                <li><a href="<?php echo $base; ?>pages/cart.php"><i class="fas fa-shopping-cart"></i> <span id="cart-count">0</span></a></li>
            </ul>
        </nav>
    </div>
</header>
