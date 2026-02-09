<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_guard.php';

header('Content-Type: application/json; charset=utf-8');

function respond($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

require_admin();

try {
    $conn = db_connect();
} catch (Exception $e) {
    respond(['ok' => false, 'error' => 'DB connection failed'], 500);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $res = $conn->query('SELECT id, email, name, role, last_login, created_at FROM admin_users ORDER BY id DESC');
    $items = [];
    while ($row = $res->fetch_assoc()) {
        $items[] = $row;
    }
    respond(['ok' => true, 'items' => $items]);
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) {
    respond(['ok' => false, 'error' => 'Invalid JSON'], 400);
}

$action = $body['action'] ?? '';

if ($action === 'delete') {
    $id = isset($body['id']) ? (int)$body['id'] : 0;
    if ($id <= 0) respond(['ok' => false, 'error' => 'Invalid id'], 400);
    $stmt = $conn->prepare('DELETE FROM admin_users WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    respond(['ok' => true]);
}

if ($action === 'create') {
    $email = trim($body['email'] ?? '');
    $name = trim($body['name'] ?? '');
    $role = trim($body['role'] ?? 'admin');
    $password = $body['password'] ?? '';
    if ($email === '' || $password === '') {
        respond(['ok' => false, 'error' => 'Email and password required'], 400);
    }
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $conn->prepare('INSERT INTO admin_users (email, name, role, password_hash) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('ssss', $email, $name, $role, $hash);
    $stmt->execute();
    respond(['ok' => true, 'id' => $stmt->insert_id]);
}

if ($action === 'password') {
    $id = isset($body['id']) ? (int)$body['id'] : 0;
    $password = $body['password'] ?? '';
    if ($id <= 0 || $password === '') {
        respond(['ok' => false, 'error' => 'Invalid input'], 400);
    }
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $conn->prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?');
    $stmt->bind_param('si', $hash, $id);
    $stmt->execute();
    respond(['ok' => true]);
}

respond(['ok' => false, 'error' => 'Unknown action'], 400);
