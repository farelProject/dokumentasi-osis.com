<?php
session_start();
require_once '../includes/config.php';
require_once '../includes/functions.php';

requireLogin();

// Get statistics
$allMedia = getAllMedia();
$allPrograms = getAllPrograms();

$totalPhotos = count(array_filter($allMedia, function($item) {
    return strpos($item['mimeType'], 'image/') === 0;
}));

$totalVideos = count(array_filter($allMedia, function($item) {
    return strpos($item['mimeType'], 'video/') === 0;
}));

$activePrograms = count(array_filter($allPrograms, function($item) {
    return $item['status'] === 'running';
}));

$recentMedia = getLatestMedia(3);
$recentPrograms = getLatestPrograms(2);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin - OSIS SMKN 5 Bulukumba</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <?php include 'includes/admin-navbar.php'; ?>

    <div class="admin-layout">
        <?php include 'includes/admin-sidebar.php'; ?>
        
        <main class="admin-main">
            <div class="admin-header">
                <h1>Dashboard Admin</h1>
                <p>Kelola dokumentasi dan program kerja OSIS</p>
            </div>

            <!-- Statistics Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon primary">
                        <i class="fas fa-images"></i>
                    </div>
                    <div class="stat-content">
                        <h3><?php echo $totalPhotos; ?></h3>
                        <p>Total Foto</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon success">
                        <i class="fas fa-video"></i>
                    </div>
                    <div class="stat-content">
                        <h3><?php echo $totalVideos; ?></h3>
                        <p>Total Video</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon warning">
                        <i class="fas fa-calendar"></i>
                    </div>
                    <div class="stat-content">
                        <h3><?php echo $activePrograms; ?></h3>
                        <p>Program Aktif</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon secondary">
                        <i class="fas fa-eye"></i>
                    </div>
                    <div class="stat-content">
                        <h3><?php echo count($allMedia); ?></h3>
                        <p>Total Media</p>
                    </div>
                </div>
            </div>

            <div class="d-flex gap-3" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                <!-- Quick Actions -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Aksi Cepat</h2>
                    </div>
                    <div style="padding: 0 24px 24px;">
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <a href="upload.php" class="btn btn-outline" style="display: flex; align-items: center; justify-content: space-between; text-decoration: none;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <i class="fas fa-upload" style="color: var(--primary-color);"></i>
                                    <span>Upload Media Baru</span>
                                </div>
                                <i class="fas fa-chevron-right" style="color: var(--gray-400); font-size: 12px;"></i>
                            </a>
                            
                            <a href="programs.php" class="btn btn-outline" style="display: flex; align-items: center; justify-content: space-between; text-decoration: none;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <i class="fas fa-plus" style="color: var(--secondary-color);"></i>
                                    <span>Tambah Program Kerja</span>
                                </div>
                                <i class="fas fa-chevron-right" style="color: var(--gray-400); font-size: 12px;"></i>
                            </a>
                            
                            <a href="media.php" class="btn btn-outline" style="display: flex; align-items: center; justify-content: space-between; text-decoration: none;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <i class="fas fa-folder-open" style="color: var(--warning-color);"></i>
                                    <span>Kelola Media</span>
                                </div>
                                <i class="fas fa-chevron-right" style="color: var(--gray-400); font-size: 12px;"></i>
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Recent Activity -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Aktivitas Terbaru</h2>
                    </div>
                    <div style="padding: 0 24px 24px;">
                        <?php if (!empty($recentMedia) || !empty($recentPrograms)): ?>
                            <div style="display: flex; flex-direction: column; gap: 16px;">
                                <?php foreach ($recentMedia as $item): ?>
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <div style="width: 40px; height: 40px; background-color: rgba(59, 130, 246, 0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                            <?php if (strpos($item['mimeType'], 'image/') === 0): ?>
                                                <i class="fas fa-image" style="color: var(--primary-color); font-size: 16px;"></i>
                                            <?php else: ?>
                                                <i class="fas fa-video" style="color: var(--primary-color); font-size: 16px;"></i>
                                            <?php endif; ?>
                                        </div>
                                        <div style="flex: 1;">
                                            <p style="font-weight: 600; color: var(--gray-900); margin-bottom: 4px; font-size: 14px;"><?php echo htmlspecialchars($item['title']); ?></p>
                                            <p style="color: var(--gray-500); font-size: 12px;"><?php echo formatDate($item['uploadedAt']); ?></p>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                                
                                <?php foreach ($recentPrograms as $program): ?>
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <div style="width: 40px; height: 40px; background-color: rgba(16, 185, 129, 0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                            <i class="fas fa-calendar" style="color: var(--secondary-color); font-size: 16px;"></i>
                                        </div>
                                        <div style="flex: 1;">
                                            <p style="font-weight: 600; color: var(--gray-900); margin-bottom: 4px; font-size: 14px;"><?php echo htmlspecialchars($program['name']); ?></p>
                                            <p style="color: var(--gray-500); font-size: 12px;"><?php echo formatDate($program['createdAt']); ?></p>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php else: ?>
                            <div style="text-align: center; padding: 40px 20px; color: var(--gray-500);">
                                <i class="fas fa-calendar" style="font-size: 2rem; margin-bottom: 12px;"></i>
                                <p style="font-size: 14px; margin-bottom: 4px;">Belum ada aktivitas</p>
                                <p style="font-size: 12px;">Aktivitas akan muncul setelah Anda mulai mengelola konten</p>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="../assets/js/script.js"></script>
</body>
</html>