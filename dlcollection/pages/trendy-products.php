<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LD Collection - Trendy products</title>
    <link rel="stylesheet" href="../css/trendy-products.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
<?php $base = "../"; $isHome = false; include __DIR__ . "/../includes/header.php"; ?>

<main style="padding-top:110px">
    <section class="categories">
        <div class="container">
            <h2>Trendy products</h2>
            <div class="category-grid">
                <div class="category-card" style="max-width:420px">
                    <img src="../images/Trending products.jpeg" alt="Trendy products">
                    <h3>Trendy products</h3>
                    <a href="../index.php#shop" class="btn">Shop Now</a>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include __DIR__ . "/../includes/footer.php"; ?>
    <script src="../js/trendy-products.js"></script>
</body>
</html>




