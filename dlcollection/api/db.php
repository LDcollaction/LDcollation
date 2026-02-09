<?php
// Database connection (update if needed)
$DB_HOST = 'localhost';
$DB_NAME = 'ldcollection';
$DB_USER = 'root';
$DB_PASS = '';

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

function db_connect() {
    global $DB_HOST, $DB_NAME, $DB_USER, $DB_PASS;
    $conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
    $conn->set_charset('utf8mb4');
    return $conn;
}
