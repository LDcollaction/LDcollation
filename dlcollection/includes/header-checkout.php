<?php
$base = $base ?? '../';
$home = $base . 'index.php';
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
                <li><a href="<?php echo $base; ?>pages/cart.php">Cart</a></li>
            </ul>
        </nav>
    </div>
</header>
