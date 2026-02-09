<?php
// Simple admin order email sender
// Expects JSON POST from checkout.js

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

$adminEmail = 'ld.collection@gmail.com';
$orderId = $data['order_id'] ?? 'Unknown';
$orderDate = $data['order_date'] ?? '';
$total = $data['total'] ?? '';
$currency = $data['currency'] ?? 'INR';
$paymentMethod = $data['payment_method'] ?? '';

$customer = $data['customer'] ?? [];
$name = $customer['name'] ?? '';
$email = $customer['email'] ?? '';
$phone = $customer['phone'] ?? '';
$address = $customer['address'] ?? '';
$city = $customer['city'] ?? '';
$state = $customer['state'] ?? '';
$pin = $customer['pin'] ?? '';

$items = $data['items'] ?? [];
$itemsLines = '';
if (is_array($items)) {
    foreach ($items as $item) {
        $itemName = $item['name'] ?? 'Item';
        $itemQty = $item['quantity'] ?? 1;
        $itemPrice = $item['price'] ?? 0;
        $itemsLines .= "- {$itemName} x{$itemQty} @ {$itemPrice} {$currency}\n";
    }
}

$subject = "New Order: {$orderId}";
$message = "New order received\n\n";
$message .= "Order ID: {$orderId}\n";
$message .= "Order Date: {$orderDate}\n";
$message .= "Payment: {$paymentMethod}\n";
$message .= "Total: {$total} {$currency}\n\n";

$message .= "Customer Details:\n";
$message .= "Name: {$name}\n";
$message .= "Email: {$email}\n";
$message .= "Phone: {$phone}\n";
$message .= "Address: {$address}\n";
$message .= "City: {$city}\n";
$message .= "State: {$state}\n";
$message .= "Pin Code: {$pin}\n\n";

$message .= "Items:\n";
$message .= $itemsLines ?: "- (No items)\n";

$headers = [];
$from = 'no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'example.com');
$headers[] = "From: {$from}";
if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $headers[] = "Reply-To: {$email}";
}
$headersStr = implode("\r\n", $headers);

$sent = @mail($adminEmail, $subject, $message, $headersStr);
if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Mail failed']);
}
