<?php
session_start();
require_once 'includes/config.php';
require_once 'includes/functions.php';

$media = getLatestMedia(3);
$programs = getLatestPrograms(3);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OSIS SMKN 5 Bulukumba - Beranda</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <?php include 'includes/navbar.php'; ?>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-overlay"></div>
        <div class="container">
            <div class="hero-content">
                <h1>OSIS SMKN 5 Bulukumba</h1>
                <p>Organisasi Siswa Intra Sekolah yang berkomitmen untuk mengembangkan potensi siswa melalui berbagai program kerja dan kegiatan yang positif.</p>
                <a href="koleksi.php" class="btn btn-primary">Jelajahi Dokumentasi</a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="about">
        <div class="container">
            <div class="section-header">
                <h2>Tentang OSIS</h2>
                <p>OSIS SMKN 5 Bulukumba adalah wadah untuk mengembangkan kepemimpinan, kreativitas, dan karakter siswa melalui berbagai kegiatan yang bermanfaat.</p>
            </div>
            
            <div class="features">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <h3>Kepemimpinan</h3>
                    <p>Mengembangkan jiwa kepemimpinan melalui berbagai program dan kegiatan organisasi.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <h3>Kreativitas</h3>
                    <p>Menyalurkan kreativitas siswa melalui berbagai event dan kompetisi yang menarik.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <h3>Karakter</h3>
                    <p>Membentuk karakter positif dan nilai-nilai moral yang kuat pada setiap siswa.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Recent Documentation -->
    <section class="recent-docs">
        <div class="container">
            <div class="section-header">
                <h2>Dokumentasi Terbaru</h2>
                <p>Beberapa momen terbaik dari kegiatan OSIS</p>
            </div>
            
            <div class="docs-grid">
                <?php if (!empty($media)): ?>
                    <?php foreach ($media as $item): ?>
                        <div class="doc-card">
                            <div class="doc-image">
                                <?php if (strpos($item['mimeType'], 'image/') === 0): ?>
                                    <img src="uploads/<?php echo htmlspecialchars($item['filename']); ?>" alt="<?php echo htmlspecialchars($item['title']); ?>">
                                <?php else: ?>
                                    <div class="video-placeholder">
                                        <i class="fas fa-play"></i>
                                        <p>Video</p>
                                    </div>
                                <?php endif; ?>
                            </div>
                            <div class="doc-content">
                                <h3><?php echo htmlspecialchars($item['title']); ?></h3>
                                <p><?php echo htmlspecialchars(substr($item['description'], 0, 100)) . '...'; ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php else: ?>
                    <div class="empty-state">
                        <i class="fas fa-images"></i>
                        <h3>Belum ada dokumentasi</h3>
                        <p>Admin dapat menambahkan foto dan video melalui panel admin</p>
                    </div>
                <?php endif; ?>
            </div>
            
            <div class="text-center">
                <a href="koleksi.php" class="btn btn-primary">Lihat Semua Dokumentasi</a>
            </div>
        </div>
    </section>

    <?php include 'includes/footer.php'; ?>

    <script src="assets/js/script.js"></script>
</body>
</html>