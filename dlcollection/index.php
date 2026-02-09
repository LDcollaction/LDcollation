<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LD Collection - Cute & Custom Gifts</title>
    <link rel="stylesheet" href="css/index.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
</head>
<body>

    <?php $base = ''; $isHome = true; include __DIR__ . '/includes/header.php'; ?>

    <!-- Search Bar -->
    <section id="search" class="search-bar">
        <div class="container">
            <div class="search-inner">
                <i class="fas fa-search"></i>
                <input id="site-search" type="text" placeholder="Search products by name or keyword...">
                
            </div>
            <div id="search-suggestions" class="search-suggestions" aria-label="Search suggestions"></div>
        </div>
    </section>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="container">
            <h1>Welcome to LD Collection</h1>
            <p>Discover our unique collection of cute and customizable gifts</p>
            <a href="#shop" class="btn">Shop Now</a>
        </div>
    </section>


    <!-- Featured Products -->
    <section id="shop" class="products">
        <div class="container">
            <h2>Our Cute Collection</h2>
            <div class="product-grid" id="product-grid">
                <!-- Products will be dynamically added here -->
            </div>
        </div>
    </section>

    <!-- Custom Gifts Section -->
    <section id="custom" class="custom-gifts">
        <div class="container">
            <h2>Custom Gifts</h2>
            <p>Make your gift extra special with our customization options</p>
            <div class="custom-options">
                <div class="custom-option">
                    <i class="fas fa-paint-brush"></i>
                    <h3>Personalized Messages</h3>
                    <p>Add a special touch with custom text</p>
                </div>
                <div class="custom-option">
                    <i class="fas fa-palette"></i>
                    <h3>Color Choices</h3>
                    <p>Pick from our beautiful color palette</p>
                </div>
                <div class="custom-option">
                    <i class="fas fa-gift"></i>
                    <h3>Gift Wrapping</h3>
                    <p>Elegant wrapping options available</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Gift Categories -->
    <section id="categories" class="categories">
        <div class="container">
            <h2>Gift Categories</h2>
            <div class="category-grid">
                <div class="category-card" data-link="pages/customise-hemper.php">
                    <img src="images/Costomise gift hamper.jpeg" alt="Customise Hemper">
                    <h3>Customise hemper</h3>
                    <a href="pages/customise-hemper.php" class="btn">Shop Now</a>
                </div>
                <div class="category-card" data-link="pages/gift-hemper.php">
                    <img src="images/Gift hemper.jpeg" alt="Gift Hemper">
                    <h3>Gift hemper</h3>
                    <a href="pages/gift-hemper.php" class="btn">Shop Now</a>
                </div>
                <div class="category-card" data-link="pages/jwellery.php">
                    <img src="images/Jewellery.jpeg" alt="Jwellery">
                    <h3>Jwellery</h3>
                    <a href="pages/jwellery.php" class="btn">Shop Now</a>
                </div>
                <div class="category-card" data-link="pages/bouquet.php">
                    <img src="images/Bouquet.jpeg" alt="Bouquet">
                    <h3>Bouquet</h3>
                    <a href="pages/bouquet.php" class="btn">Shop Now</a>
                </div>
                <div class="category-card" data-link="pages/trendy-products.php">
                    <img src="images/Trending products.jpeg" alt="Trendy Products">
                    <h3>Trendy products</h3>
                    <a href="pages/trendy-products.php" class="btn">Shop Now</a>
                </div>
                <div class="category-card" data-link="pages/hand-made-card.php">
                    <img src="images/Handmade card.jpeg" alt="Hand Made Card">
                    <h3>Hand made card</h3>
                    <a href="pages/hand-made-card.php" class="btn">Shop Now</a>
                </div>
                <div class="category-card" data-link="pages/scoop.php">
                    <img src="images/Scoop.jpeg" alt="Scoop">
                    <h3>Scoop</h3>
                    <a href="pages/scoop.php" class="btn">Shop Now</a>
                </div>
                <div class="category-card" data-link="pages/couple-product.php">
                    <img src="images/Couple products.jpeg" alt="Couple Product">
                    <h3>Couple product</h3>
                    <a href="pages/couple-product.php" class="btn">Shop Now</a>
                </div>

            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="container">
            <h2>Our Story</h2>
            <p>LD Collection was born from a passion for creating adorable and meaningful gifts that bring joy to both givers and receivers. Each item in our collection is carefully selected and handcrafted with love.</p>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <h2>Get In Touch</h2>
            <div class="contact-content">
                <div class="contact-info">
                    <p><i class="fas fa-envelope"></i> ld.callection@gmail.com</p>
                    <p><i class="fas fa-phone"></i> +91 79849 22434</p>
                    <p><i class="fas fa-map-marker-alt"></i> 123 Gift Street, Modasa</p>
                </div>
                <form id="contact-form">
                    <input type="text" name="name" placeholder="Your Name" required>
                    <input type="email" name="email" placeholder="Your Email" required>
                    <textarea name="message" placeholder="Your Message" required></textarea>
                    <button type="submit" class="btn">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <?php include __DIR__ . '/includes/footer.php'; ?>

    <script src="js/index.js"></script>
</body>
</html>


