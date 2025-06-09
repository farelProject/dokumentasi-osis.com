<?php
session_start();
require_once 'includes/config.php';
require_once 'includes/functions.php';

// Get search parameters
$search = $_GET['search'] ?? '';
$category = $_GET['category'] ?? '';
$type = $_GET['type'] ?? '';

// Get filtered media
$media = searchMedia($search, $category, $type);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Koleksi Dokumentasi - OSIS SMKN 5 Bulukumba</title>
    <meta name="description" content="Jelajahi koleksi foto dan video kegiatan OSIS SMKN 5 Bulukumba. Dokumentasi lengkap program kerja dan event sekolah.">
    <link rel="stylesheet" href="assets/css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <?php include 'includes/navbar.php'; ?>

    <!-- Collection Header -->
    <section class="collection-header">
        <div class="container">
            <h1>Koleksi Dokumentasi</h1>
            <p>Jelajahi foto dan video kegiatan OSIS SMKN 5 Bulukumba</p>
        </div>
    </section>

    <!-- Collection Content -->
    <section class="collection-content">
        <div class="container">
            <!-- Search and Filters -->
            <div class="search-filters">
                <form method="GET" action="">
                    <div class="filter-row">
                        <div class="filter-group">
                            <label for="search">Cari Dokumentasi</label>
                            <div class="search-input">
                                <i class="fas fa-search"></i>
                                <input type="text" id="search" name="search" class="form-control" 
                                       placeholder="Cari berdasarkan judul atau deskripsi..." 
                                       value="<?php echo htmlspecialchars($search); ?>">
                            </div>
                        </div>
                        
                        <div class="filter-group">
                            <label for="type">Tipe Media</label>
                            <select id="type" name="type" class="form-control">
                                <option value="">Semua Tipe</option>
                                <option value="image" <?php echo $type === 'image' ? 'selected' : ''; ?>>Foto</option>
                                <option value="video" <?php echo $type === 'video' ? 'selected' : ''; ?>>Video</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label for="category">Kategori</label>
                            <select id="category" name="category" class="form-control">
                                <option value="">Semua Kategori</option>
                                <option value="kegiatan-sekolah" <?php echo $category === 'kegiatan-sekolah' ? 'selected' : ''; ?>>Kegiatan Sekolah</option>
                                <option value="program-kerja" <?php echo $category === 'program-kerja' ? 'selected' : ''; ?>>Program Kerja</option>
                                <option value="event-khusus" <?php echo $category === 'event-khusus' ? 'selected' : ''; ?>>Event Khusus</option>
                                <option value="lainnya" <?php echo $category === 'lainnya' ? 'selected' : ''; ?>>Lainnya</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>&nbsp;</label>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-search"></i> Cari
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Media Grid -->
            <?php if (!empty($media)): ?>
                <div class="docs-grid">
                    <?php foreach ($media as $item): ?>
                        <div class="doc-card">
                            <div class="doc-image">
                                <?php if (strpos($item['mimeType'], 'image/') === 0): ?>
                                    <img src="uploads/<?php echo htmlspecialchars($item['filename']); ?>" 
                                         alt="<?php echo htmlspecialchars($item['title']); ?>"
                                         loading="lazy">
                                    <div class="doc-overlay">
                                        <a href="uploads/<?php echo htmlspecialchars($item['filename']); ?>" 
                                           target="_blank" class="btn btn-sm btn-secondary">
                                            <i class="fas fa-eye"></i> Lihat
                                        </a>
                                    </div>
                                <?php else: ?>
                                    <div class="video-placeholder">
                                        <i class="fas fa-play"></i>
                                        <p>Video</p>
                                        <div class="doc-overlay">
                                            <a href="uploads/<?php echo htmlspecialchars($item['filename']); ?>" 
                                               target="_blank" class="btn btn-sm btn-secondary">
                                                <i class="fas fa-play"></i> Putar
                                            </a>
                                        </div>
                                    </div>
                                <?php endif; ?>
                            </div>
                            <div class="doc-content">
                                <h3><?php echo htmlspecialchars($item['title']); ?></h3>
                                <p><?php echo htmlspecialchars($item['description'] ?: 'Tidak ada deskripsi'); ?></p>
                                <div class="doc-meta">
                                    <span class="status-badge status-secondary">
                                        <?php echo getCategoryLabel($item['category']); ?>
                                    </span>
                                    <span class="file-size"><?php echo formatFileSize($item['size']); ?></span>
                                </div>
                                <div class="doc-date">
                                    <i class="fas fa-calendar"></i>
                                    <?php echo formatDate($item['uploadedAt']); ?>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <!-- Empty State -->
                <div class="empty-state">
                    <?php if ($search || $category || $type): ?>
                        <i class="fas fa-search"></i>
                        <h3>Tidak Ada Hasil Ditemukan</h3>
                        <p>Coba ubah kata kunci pencarian atau filter untuk mendapatkan hasil yang berbeda.</p>
                        <a href="koleksi.php" class="btn btn-primary">Reset Filter</a>
                    <?php else: ?>
                        <i class="fas fa-images"></i>
                        <h3>Belum Ada Dokumentasi</h3>
                        <p>Koleksi dokumentasi masih kosong. Admin dapat menambahkan foto dan video melalui panel admin.</p>
                        <a href="admin/login.php" class="btn btn-primary">Login Admin</a>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </div>
    </section>

    <?php include 'includes/footer.php'; ?>

    <script src="assets/js/script.js"></script>
</body>
</html>