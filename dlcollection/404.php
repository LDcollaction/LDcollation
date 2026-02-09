<?php
$base = '';
$isHome = false;
$requested = htmlspecialchars($_SERVER['REQUEST_URI'] ?? '', ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found - LD Collection</title>
    <link rel="stylesheet" href="css/index.css">
    <link rel="stylesheet" href="css/404.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <?php include __DIR__ . '/includes/header.php'; ?>

    <main class="not-found">
        <div class="container">
            <div class="not-found-card">
                <div class="not-found-icon" aria-hidden="true">
                    <i class="fas fa-compass"></i>
                </div>
                <h1>Page not found</h1>
                <p class="not-found-subtitle">We couldn't find the page you requested.</p>
                <?php if ($requested !== ''): ?>
                    <p class="not-found-path">Requested: <span><?php echo $requested; ?></span></p>
                <?php endif; ?>
                <div class="not-found-actions">
                    <a href="index.php#home" class="btn">Back to Home</a>
                    <a href="index.php#categories" class="btn btn-outline">Browse Categories</a>
                </div>
            </div>
        </div>
    </main>

    <?php include __DIR__ . '/includes/footer.php'; ?>
</body>
</html>
