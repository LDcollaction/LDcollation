<?php
// Simple session-based admin guard
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

function require_admin() {
    if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
        http_response_code(401);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => false, 'error' => 'Unauthorized']);
        exit;
    }
}
