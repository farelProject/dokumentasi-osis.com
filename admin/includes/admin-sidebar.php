<?php
$currentPage = basename($_SERVER['PHP_SELF']);
?>
<aside class="admin-sidebar">
    <h3>Admin Panel</h3>
    
    <ul class="sidebar-nav">
        <li>
            <a href="dashboard.php" class="<?php echo $currentPage === 'dashboard.php' ? 'active' : ''; ?>">
                <i class="fas fa-tachometer-alt"></i>
                Dashboard
            </a>
        </li>
        <li>
            <a href="upload.php" class="<?php echo $currentPage === 'upload.php' ? 'active' : ''; ?>">
                <i class="fas fa-upload"></i>
                Upload Media
            </a>
        </li>
        <li>
            <a href="programs.php" class="<?php echo $currentPage === 'programs.php' ? 'active' : ''; ?>">
                <i class="fas fa-calendar"></i>
                Kelola Proker
            </a>
        </li>
        <li>
            <a href="media.php" class="<?php echo $currentPage === 'media.php' ? 'active' : ''; ?>">
                <i class="fas fa-folder-open"></i>
                Kelola Media
            </a>
        </li>
        <li style="border-top: 1px solid var(--gray-200); padding-top: 16px; margin-top: 16px;">
            <a href="logout.php" style="color: var(--danger-color);">
                <i class="fas fa-sign-out-alt"></i>
                Logout
            </a>
        </li>
    </ul>
</aside>