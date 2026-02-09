<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_guard.php';

header('Content-Type: application/json; charset=utf-8');

function respond($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

try {
    $conn = db_connect();
} catch (Exception $e) {
    respond(['ok' => false, 'error' => 'DB connection failed'], 500);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    require_admin();
    $status = $_GET['status'] ?? '';
    $status = trim($status);
    $where = '';
    if ($status !== '' && in_array($status, ['pending', 'shipped'], true)) {
        $where = " WHERE status = '" . $conn->real_escape_string($status) . "'";
    }
    $orders = [];
    $res = $conn->query('SELECT id, order_date, total, currency, payment_method, customer_name, customer_email, customer_phone, customer_address, customer_city, customer_state, customer_pin, status FROM orders' . $where . ' ORDER BY order_date DESC');
    while ($row = $res->fetch_assoc()) {
        $orders[$row['id']] = [
            'id' => $row['id'],
            'date' => $row['order_date'],
            'total' => (float)$row['total'],
            'currency' => $row['currency'],
            'paymentMethod' => $row['payment_method'],
            'customer' => [
                'name' => $row['customer_name'],
                'email' => $row['customer_email'],
                'phone' => $row['customer_phone'],
                'address' => $row['customer_address'],
                'city' => $row['customer_city'],
                'state' => $row['customer_state'],
                'pin' => $row['customer_pin']
            ],
            'status' => $row['status']
        ];
    }

    if (count($orders)) {
        $ids = "'" . implode("','", array_map('addslashes', array_keys($orders))) . "'";
        $itemsRes = $conn->query("SELECT order_id, product_name, price, quantity FROM order_items WHERE order_id IN ($ids) ORDER BY id ASC");
        while ($item = $itemsRes->fetch_assoc()) {
            $oid = $item['order_id'];
            if (!isset($orders[$oid]['items'])) $orders[$oid]['items'] = [];
            $orders[$oid]['items'][] = [
                'name' => $item['product_name'],
                'price' => (float)$item['price'],
                'quantity' => (int)$item['quantity']
            ];
        }
    }

    respond(['ok' => true, 'items' => array_values($orders)]);
}

require_admin();

// POST create/update/delete/status
$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) {
    respond(['ok' => false, 'error' => 'Invalid JSON'], 400);
}

$action = $body['action'] ?? 'create';

if ($action === 'delete') {
    $id = $body['id'] ?? '';
    if ($id === '') respond(['ok' => false, 'error' => 'Invalid id'], 400);
    $stmt = $conn->prepare('DELETE FROM orders WHERE id = ?');
    $stmt->bind_param('s', $id);
    $stmt->execute();
    respond(['ok' => true]);
}

if ($action === 'status') {
    $id = $body['id'] ?? '';
    $status = $body['status'] ?? '';
    if ($id === '' || $status === '') respond(['ok' => false, 'error' => 'Invalid status'], 400);
    $stmt = $conn->prepare('UPDATE orders SET status = ? WHERE id = ?');
    $stmt->bind_param('ss', $status, $id);
    $stmt->execute();
    respond(['ok' => true]);
}

// create order
$id = $body['id'] ?? '';
$date = $body['date'] ?? '';
$total = isset($body['total']) ? (float)$body['total'] : 0;
$currency = $body['currency'] ?? 'INR';
$payment = $body['paymentMethod'] ?? '';
$status = $body['status'] ?? 'pending';
$customer = $body['customer'] ?? [];
$items = $body['items'] ?? [];

if ($id === '' || $date === '') {
    respond(['ok' => false, 'error' => 'Missing id/date'], 400);
}

$stmt = $conn->prepare('INSERT INTO orders (id, order_date, total, currency, payment_method, customer_name, customer_email, customer_phone, customer_address, customer_city, customer_state, customer_pin, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
$stmt->bind_param(
    'ssdssssssssss',
    $id,
    $date,
    $total,
    $currency,
    $payment,
    $customer['name'],
    $customer['email'],
    $customer['phone'],
    $customer['address'],
    $customer['city'],
    $customer['state'],
    $customer['pin'],
    $status
);
$stmt->execute();

if (is_array($items)) {
    $itemStmt = $conn->prepare('INSERT INTO order_items (order_id, product_name, price, quantity) VALUES (?, ?, ?, ?)');
    foreach ($items as $it) {
        $pname = $it['name'] ?? 'Item';
        $price = isset($it['price']) ? (float)$it['price'] : 0;
        $qty = isset($it['quantity']) ? (int)$it['quantity'] : 1;
        $itemStmt->bind_param('ssdi', $id, $pname, $price, $qty);
        $itemStmt->execute();
    }
}

respond(['ok' => true]);
