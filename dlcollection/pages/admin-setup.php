<?php
require_once __DIR__ . '/../api/db.php';

$error = '';
$success = false;

try {
    $conn = db_connect();
    $res = $conn->query('SELECT COUNT(*) AS cnt FROM admin_users');
    $row = $res->fetch_assoc();
    $hasAdmin = isset($row['cnt']) && (int)$row['cnt'] > 0;
} catch (Exception $e) {
    $hasAdmin = false;
    $error = 'Database connection failed. Check your database settings.';
    $conn = null;
}

if (!$hasAdmin && $conn && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $name = trim($_POST['name'] ?? '');
    $password = $_POST['password'] ?? '';
    if ($email === '' || $password === '') {
        $error = 'Email and password are required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email address.';
    } elseif (strlen($password) < 6) {
        $error = 'Password must be at least 6 characters.';
    } else {
        try {
            $hash = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $conn->prepare('INSERT INTO admin_users (email, name, role, password_hash) VALUES (?, ?, ?, ?)');
            $role = 'admin';
            $stmt->bind_param('ssss', $email, $name, $role, $hash);
            $stmt->execute();
            $success = true;
            $hasAdmin = true;
        } catch (Exception $e) {
            $error = 'Failed to create admin user. The email might already exist.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Setup - LD Collection</title>
    <link rel="stylesheet" href="../css/admin.css">
    <style>
        .setup-card { max-width:520px; margin:0 auto; background:#fff; padding:24px; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.08); }
        .setup-card h1 { margin:0 0 12px; }
        .setup-msg { margin:12px 0; padding:10px 12px; border-radius:8px; font-size:0.95rem; }
        .setup-msg.error { background:#fff1f1; border:1px solid #f1c2c2; color:#9a2f2f; }
        .setup-msg.success { background:#eef9f1; border:1px solid #bfe7c9; color:#2f7a3f; }
        .setup-actions { display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-top:12px; }
        .setup-actions a { color:#c46a3a; font-weight:600; }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="logo">
                <a href="../index.php">
                    <img src="../images/logo.jpeg" alt="LD Collection" class="brand-logo">
                </a>
            </div>
        </div>
    </header>

    <main style="padding-top:110px">
        <div class="container">
            <div class="setup-card">
                <h1>Admin Setup</h1>

                <?php if ($hasAdmin): ?>
                    <div class="setup-msg success">An admin user already exists. Please log in.</div>
                    <div class="setup-actions">
                        <a href="admin.php">Go to Admin Login</a>
                    </div>
                <?php else: ?>
                    <p>Create the first admin user for this site.</p>
                    <?php if ($error): ?>
                        <div class="setup-msg error"><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></div>
                    <?php endif; ?>
                    <?php if ($success): ?>
                        <div class="setup-msg success">Admin user created. You can log in now.</div>
                    <?php endif; ?>
                    <form method="post" style="display:flex; flex-direction:column; gap:10px">
                        <input type="text" name="name" placeholder="Name (optional)" style="padding:10px; border-radius:8px; border:1px solid #ddd">
                        <input type="email" name="email" placeholder="Admin email" required style="padding:10px; border-radius:8px; border:1px solid #ddd">
                        <input type="password" name="password" placeholder="Admin password" required style="padding:10px; border-radius:8px; border:1px solid #ddd">
                        <button type="submit" class="btn">Create Admin</button>
                    </form>
                    <div class="setup-actions">
                        <a href="admin.php">Back to Admin Login</a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </main>
</body>
</html>
