<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopping Cart - LD Collection</title>
    <link rel="stylesheet" href="../css/cart.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Header -->
    <?php $base = "../"; include __DIR__ . "/../includes/header-cart.php"; ?>

    <!-- Cart Section -->
    <section id="cart-section" class="cart-page">
        <div class="container">
            <h1>Shopping Cart</h1>

            <div class="cart-layout">
                <!-- Cart Items -->
                <div class="cart-items-container">
                    <div id="cart-items-list"></div>
                </div>

                <!-- Cart Summary -->
                <div class="cart-summary">
                    <div class="summary-box">
                        <h3>Order Summary</h3>
                        
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span id="subtotal">$0.00</span>
                        </div>
                        <div class="summary-row">
                            <span>Tax (0%):</span>
                            <span id="tax">$0.00</span>
                        </div>
                        <div class="summary-row">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>
                        
                        <hr style="margin:15px 0; border:none; border-top:1px solid #eee">
                        
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span id="total">$0.00</span>
                        </div>

                        <button id="checkout-btn" class="btn" style="width:100%; margin-top:20px">
                            Proceed to Checkout
                        </button>
                        <a href="../index.php#shop" class="btn btn-outline" style="width:100%; display:block; text-align:center; margin-top:10px">
                            Continue Shopping
                        </a>
                        <button id="clear-cart-btn" class="btn btn-outline" style="width:100%; margin-top:10px">
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <?php include __DIR__ . "/../includes/footer-cart.php"; ?>

    <script src="../js/cart.js"></script>
</body>
</html>




