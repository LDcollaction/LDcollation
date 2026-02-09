<?php
$base = $base ?? '';
$isHome = $isHome ?? false;
$home = $base . 'index.php';
$admin = $base . 'pages/admin.php';
$cart = $base . 'pages/cart.php';
?>
<!-- Header -->
<header>
    <div class="container header-main">
        <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="main-nav"><span></span><span></span><span></span></button>
        <div class="logo">
            <a href="<?php echo $isHome ? '#home' : $home; ?>">
                <img src="<?php echo $base; ?>images/logo.jpeg" alt="LD Collection" class="brand-logo">
            </a>
            <p class="tagline">Handmade with &#10084;&#65039;</p>
        </div>
        <nav id="main-nav" aria-label="Primary">
            <ul class="nav-links">
                <li><a href="<?php echo $isHome ? '#home' : $home . '#home'; ?>">Home</a></li>
                <li><a href="<?php echo $isHome ? '#shop' : $home . '#shop'; ?>">Shop</a></li>
                <li><a href="<?php echo $isHome ? '#categories' : $home . '#categories'; ?>">Categories</a></li>
                <li><a href="<?php echo $isHome ? '#custom' : $home . '#custom'; ?>">Custom Gifts</a></li>
                <li><a href="<?php echo $isHome ? '#about' : $home . '#about'; ?>">About Us</a></li>
                <li><a href="<?php echo $isHome ? '#contact' : $home . '#contact'; ?>">Contact</a></li>
            </ul>
        </nav>
        <div class="nav-actions">
            <a href="<?php echo $isHome ? '#search' : $home . '#search'; ?>" class="nav-search" aria-label="Search">
                <i class="fas fa-search"></i>
            </a>
            <a href="<?php echo $cart; ?>" id="cart-link" class="nav-cart" aria-label="View cart">
                <i class="fas fa-shopping-cart"></i>
                <span id="cart-count">0</span>
            </a>
        </div>
    </div>
</header>
