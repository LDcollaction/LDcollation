<?php
$base = $base ?? '../';
$home = $base . 'index.php';
?>
<!-- Footer -->
<footer>
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h3>LD Collection</h3>
                <p>Making gift-giving special since 2023</p>
                <p style="font-size:0.95rem; color:var(--light-text)">Contact: <a href="mailto:ld.callection@gmail.com">ld.callection@gmail.com</a></p>
            </div>
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="<?php echo $home; ?>">Home</a></li>
                    <li><a href="<?php echo $home; ?>#shop">Shop</a></li>
                    <li><a href="<?php echo $base; ?>pages/cart.php">Cart</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 LD Collection. All rights reserved.</p>
        </div>
    </div>
</footer>
