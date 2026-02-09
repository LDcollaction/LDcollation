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
    $res = $conn->query('SELECT id, name, price, image, description FROM products ORDER BY id DESC');
    $items = [];
    while ($row = $res->fetch_assoc()) {
        $row['price'] = (float)$row['price'];
        $items[] = $row;
    }
    respond(['ok' => true, 'items' => $items]);
}

require_admin();

// POST for create/update/delete
$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) {
    respond(['ok' => false, 'error' => 'Invalid JSON'], 400);
}

$action = $body['action'] ?? '';
if ($action === 'delete') {
    $id = isset($body['id']) ? (int)$body['id'] : 0;
    if ($id <= 0) respond(['ok' => false, 'error' => 'Invalid id'], 400);

    $stmt = $conn->prepare('DELETE FROM products WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    respond(['ok' => true]);
}

// add/update
$name = trim($body['name'] ?? '');
$price = isset($body['price']) ? (float)$body['price'] : 0;
$image = trim($body['image'] ?? '');
$description = trim($body['description'] ?? '');
$id = isset($body['id']) ? (int)$body['id'] : 0;

if ($name === '') {
    respond(['ok' => false, 'error' => 'Name is required'], 400);
}

if ($id > 0) {
    $stmt = $conn->prepare('UPDATE products SET name=?, price=?, image=?, description=? WHERE id=?');
    $stmt->bind_param('sdssi', $name, $price, $image, $description, $id);
    $stmt->execute();
    respond(['ok' => true, 'item' => ['id' => $id, 'name' => $name, 'price' => $price, 'image' => $image, 'description' => $description]]);
} else {
    $stmt = $conn->prepare('INSERT INTO products (name, price, image, description) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('sdss', $name, $price, $image, $description);
    $stmt->execute();
    $newId = $stmt->insert_id;
    respond(['ok' => true, 'item' => ['id' => $newId, 'name' => $name, 'price' => $price, 'image' => $image, 'description' => $description]]);
}
