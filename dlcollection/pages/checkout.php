<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout - LD Collection</title>
    <link rel="stylesheet" href="../css/checkout.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
</head>
<body>
    <!-- Header -->
    <?php $base = "../"; include __DIR__ . "/../includes/header-checkout.php"; ?>

    <!-- Checkout Section -->
    <section class="checkout-page">
        <div class="container">
            <h1>Checkout</h1>

            <div class="checkout-layout">
                <!-- Checkout Form -->
                <div class="checkout-form-section">
                    <form id="checkout-form">
                        <!-- Customer Details -->
                        <div class="form-section">
                            <h3>Customer Details</h3>
                            <input type="text" id="cust-name" placeholder="Full Name" required>
                            <input type="email" id="cust-email" placeholder="Email Address" required>
                            <input type="text" id="cust-phone" placeholder="Phone Number" required>
                            <input type="text" id="cust-address" placeholder="Delivery Address" required>
                            <input type="text" id="cust-city" placeholder="City" required>
                            <input type="text" id="cust-state" placeholder="State" required>
                            <input type="text" id="cust-pin" placeholder="Pin Code" required>
                        </div>

                        <!-- Payment Method -->
                        <div class="form-section">
                            <h3>Payment Method</h3>
                            <p style="margin:0 0 15px; color:#666"><strong>UPI Payment</strong></p>
                            <p style="color:#888; font-size:0.9rem; margin:0 0 12px;">Choose PhonePe or Google Pay, or use any UPI app via "Complete Payment".</p>

                            <div class="upi-apps" aria-label="Select UPI app">
                                <button type="button" class="upi-app-btn" data-app="phonepe">
                                    <i class="fas fa-mobile-alt"></i> PhonePe
                                </button>
                                <button type="button" class="upi-app-btn" data-app="gpay">
                                    <i class="fas fa-mobile-alt"></i> Google Pay
                                </button>
                            </div>

                            <!-- UPI Fields (Default) -->
                            <div id="upi-section" style="display:block; padding:15px; background:#f9f1f0; border-radius:8px">
                                <h4 style="margin-top:0">Scan QR Code</h4>
                                <p style="color:#888; font-size:0.9rem; margin:0 0 15px;">Available on: Google Pay, PhonePe, Paytm</p>
                                <div id="upi-qr-container" style="display:flex; justify-content:center; margin:15px 0; background:white; padding:15px; border-radius:6px">
                                    <img src="../images/upi-qr.jpeg" alt="UPI QR Code" style="max-width:220px; width:100%; height:auto;">
                                </div>
                                <p style="text-align:center; font-size:0.85rem; color:#888; margin:10px 0 0">Merchant UPI: <strong>ldcollection05@ybl</strong></p>
                            </div>
                        </div>

                        <button type="submit" class="btn" style="width:100%; margin-top:20px; padding:15px; font-size:1.1rem; background:#D4A5A5">
                            <i class="fas fa-lock"></i> Complete Payment
                        </button>
                    </form>

                    <div id="checkout-status" style="margin-top:15px;"></div>
                </div>

                <!-- Order Summary -->
                <div class="checkout-summary">
                    <div class="summary-box">
                        <h3>Order Summary</h3>
                        
                        <div id="order-items" style="max-height:300px; overflow-y:auto; margin-bottom:15px;"></div>

                        <hr style="border:none; border-top:1px solid #eee; margin:15px 0">

                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span id="summary-subtotal">$0.00</span>
                        </div>
                        <div class="summary-row">
                            <span>Tax:</span>
                            <span id="summary-tax">$0.00</span>
                        </div>
                        <div class="summary-row">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>

                        <hr style="border:none; border-top:1px solid #eee; margin:15px 0">

                        <div class="summary-row total">
                            <span>Total:</span>
                            <span id="summary-total">$0.00</span>
                        </div>

                        <a href="cart.php" class="btn btn-outline" style="width:100%; text-align:center; margin-top:15px">
                            Back to Cart
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Receipt Modal -->
    <div id="receipt-modal" class="modal" style="display:none">
        <div class="modal-content" style="max-width:800px">
            <button class="modal-close" id="receipt-close">&times;</button>
            <div id="receipt-content"></div>
            <div style="display:flex; gap:8px; margin-top:20px; justify-content:center">
                <button class="btn" id="receipt-print-btn"><i class="fas fa-print"></i> Print</button>
                <button class="btn" id="receipt-pdf-btn"><i class="fas fa-file-pdf"></i> Download PDF</button>
                <button class="btn btn-outline" id="receipt-close-btn">Close</button>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <?php include __DIR__ . "/../includes/footer-checkout.php"; ?>

    <script src="../js/checkout.js"></script>
</body>
</html>




