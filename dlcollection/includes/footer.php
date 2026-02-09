<?php
$base = $base ?? '';
$isHome = $isHome ?? false;
$home = $base . 'index.php';
$admin = $base . 'pages/admin.php';
?>
<!-- Footer -->
<footer>
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h3>LD Collection</h3>
                <p>Making gift-giving special since 2023</p>
                <p style="font-size:0.95rem; color:var(--light-text)">Managed by Site Assistant &mdash; <a href="mailto:ld.callection@gmail.com">ld.callection@gmail.com</a></p>
            </div>
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="<?php echo $isHome ? '#home' : $home . '#home'; ?>">Home</a></li>
                    <li><a href="<?php echo $isHome ? '#shop' : $home . '#shop'; ?>">Shop</a></li>
                    <li><a href="<?php echo $isHome ? '#custom' : $home . '#custom'; ?>">Custom Gifts</a></li>
                    <li><a href="<?php echo $isHome ? '#about' : $home . '#about'; ?>">About Us</a></li>
                    <li><a href="<?php echo $isHome ? '#contact' : $home . '#contact'; ?>">Contact</a></li>
                    <li><a href="<?php echo $admin; ?>">Admin</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Follow Us</h3>
                <div class="social-links">
                    <a href="https://www.instagram.com/ld_collaction?igsh=MXV0N3JqY3R3cDdtaQ=="><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fab fa-facebook"></i></a>
                    <a href="#"><i class="fab fa-pinterest"></i></a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 LD Collection. All rights reserved.</p>
        </div>
    </div>
</footer>
