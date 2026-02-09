<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

// Admin login now uses DB users

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST') {
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) {
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

$action = $body['action'] ?? 'login';

if ($action === 'check') {
    $isAdmin = isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true;
    echo json_encode(['ok' => true, 'isAdmin' => $isAdmin, 'email' => $_SESSION['admin_email'] ?? null]);
    exit;
}

if ($action === 'logout') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
    echo json_encode(['ok' => true]);
    exit;
}

if ($action === 'has_admin') {
    try {
        $conn = db_connect();
        $res = $conn->query('SELECT COUNT(*) AS cnt FROM admin_users');
        $row = $res->fetch_assoc();
        $count = isset($row['cnt']) ? (int)$row['cnt'] : 0;
        echo json_encode(['ok' => true, 'hasAdmin' => $count > 0]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Failed to check admins']);
    }
    exit;
}

// login
$email = trim($body['email'] ?? '');
$password = $body['password'] ?? '';
if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Email and password required']);
    exit;
}

try {
    $conn = db_connect();
    $stmt = $conn->prepare('SELECT id, email, password_hash FROM admin_users WHERE email = ? LIMIT 1');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $res = $stmt->get_result();
    $user = $res->fetch_assoc();
    if ($user && password_verify($password, $user['password_hash'])) {
        $_SESSION['is_admin'] = true;
        $_SESSION['admin_id'] = (int)$user['id'];
        $_SESSION['admin_email'] = $user['email'];
        $upd = $conn->prepare('UPDATE admin_users SET last_login = NOW() WHERE id = ?');
        $upd->bind_param('i', $_SESSION['admin_id']);
        $upd->execute();
        echo json_encode(['ok' => true]);
    } else {
        http_response_code(401);
        echo json_encode(['ok' => false, 'error' => 'Invalid credentials']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Login failed']);
}
