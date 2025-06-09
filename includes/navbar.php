<nav class="navbar">
    <div class="container">
        <div class="navbar-brand">
            <a href="index.php">OSIS SMKN 5 Bulukumba</a>
        </div>
        
        <div class="navbar-menu" id="navbarMenu">
            <div class="navbar-nav">
                <a href="index.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? 'active' : ''; ?>">
                    <i class="fas fa-home"></i>
                    Beranda
                </a>
                <a href="koleksi.php" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'koleksi.php' ? 'active' : ''; ?>">
                    <i class="fas fa-images"></i>
                    Koleksi
                </a>
                <?php if (isLoggedIn()): ?>
                    <a href="admin/dashboard.php" class="nav-link">
                        <i class="fas fa-tachometer-alt"></i>
                        Dashboard
                    </a>
                <?php else: ?>
                    <a href="admin/login.php" class="nav-link">
                        <i class="fas fa-shield-alt"></i>
                        Admin
                    </a>
                <?php endif; ?>
            </div>
        </div>
        
        <div class="navbar-toggle" id="navbarToggle">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
</nav>