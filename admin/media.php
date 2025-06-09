<?php
session_start();
require_once '../includes/config.php';
require_once '../includes/functions.php';

requireLogin();

$success = '';
$error = '';

// Handle delete action
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'delete') {
    $id = (int)($_POST['id'] ?? 0);
    if (deleteMedia($id)) {
        $success = 'Media berhasil dihapus!';
    } else {
        $error = 'Gagal menghapus media';
    }
}

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
    <title>Kelola Media - OSIS SMKN 5 Bulukumba</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <?php include 'includes/admin-navbar.php'; ?>

    <div class="admin-layout">
        <?php include 'includes/admin-sidebar.php'; ?>
        
        <main class="admin-main">
            <div class="admin-header">
                <h1>Kelola Media</h1>
                <p>Edit dan hapus foto serta video yang telah diupload</p>
            </div>

            <?php if ($success): ?>
                <div style="background-color: rgba(34, 197, 94, 0.1); color: var(--success-color); padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                    <i class="fas fa-check-circle"></i>
                    <?php echo htmlspecialchars($success); ?>
                </div>
            <?php endif; ?>

            <?php if ($error): ?>
                <div style="background-color: rgba(239, 68, 68, 0.1); color: var(--danger-color); padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <!-- Search and Filters -->
            <div class="search-filters">
                <form method="GET" action="">
                    <div class="filter-row">
                        <div class="filter-group">
                            <label for="search">Cari Media</label>
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
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
                    <?php foreach ($media as $item): ?>
                        <div class="card" style="overflow: hidden;">
                            <div style="height: 200px; background-color: var(--gray-200); position: relative; overflow: hidden;">
                                <?php if (strpos($item['mimeType'], 'image/') === 0): ?>
                                    <img src="../uploads/<?php echo htmlspecialchars($item['filename']); ?>" 
                                         alt="<?php echo htmlspecialchars($item['title']); ?>"
                                         style="width: 100%; height: 100%; object-fit: cover;">
                                <?php else: ?>
                                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: var(--gray-800); color: white;">
                                        <div style="text-align: center;">
                                            <i class="fas fa-play" style="font-size: 3rem; margin-bottom: 8px;"></i>
                                            <p>Video</p>
                                        </div>
                                    </div>
                                <?php endif; ?>
                                
                                <div style="position: absolute; top: 8px; right: 8px; display: flex; gap: 8px;">
                                    <a href="../uploads/<?php echo htmlspecialchars($item['filename']); ?>" 
                                       target="_blank" class="btn btn-sm btn-secondary">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                    <form method="POST" action="" style="display: inline;" onsubmit="return confirm('Apakah Anda yakin ingin menghapus media ini?')">
                                        <input type="hidden" name="action" value="delete">
                                        <input type="hidden" name="id" value="<?php echo $item['id']; ?>">
                                        <button type="submit" class="btn btn-sm btn-danger">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                            
                            <div style="padding: 16px;">
                                <h3 style="font-size: 1.1rem; font-weight: bold; color: var(--gray-900); margin-bottom: 8px; line-height: 1.3;"><?php echo htmlspecialchars($item['title']); ?></h3>
                                <p style="color: var(--gray-600); font-size: 14px; margin-bottom: 12px; line-height: 1.4;">
                                    <?php echo htmlspecialchars($item['description'] ?: 'Tidak ada deskripsi'); ?>
                                </p>
                                
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <span class="status-badge status-secondary" style="font-size: 11px;">
                                        <?php echo getCategoryLabel($item['category']); ?>
                                    </span>
                                    <span style="font-size: 12px; color: var(--gray-500);">
                                        <?php echo formatFileSize($item['size']); ?>
                                    </span>
                                </div>
                                
                                <div style="font-size: 12px; color: var(--gray-500);">
                                    Upload: <?php echo formatDate($item['uploadedAt']); ?>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <!-- Empty State -->
                <div style="text-align: center; padding: 80px 20px;">
                    <div style="width: 96px; height: 96px; background-color: var(--gray-100); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                        <i class="fas fa-folder-open" style="font-size: 3rem; color: var(--gray-400);"></i>
                    </div>
                    <h3 style="font-size: 1.5rem; color: var(--gray-700); margin-bottom: 12px;">
                        <?php echo ($search || $category || $type) ? 'Tidak Ada Media Ditemukan' : 'Belum Ada Media'; ?>
                    </h3>
                    <p style="color: var(--gray-500); margin-bottom: 24px; max-width: 400px; margin-left: auto; margin-right: auto;">
                        <?php if ($search || $category || $type): ?>
                            Coba ubah kata kunci pencarian atau filter untuk mendapatkan hasil yang berbeda.
                        <?php else: ?>
                            Upload foto dan video terlebih dahulu untuk mulai mengelola media dokumentasi.
                        <?php endif; ?>
                    </p>
                    <?php if ($search || $category || $type): ?>
                        <a href="media.php" class="btn btn-primary">Reset Filter</a>
                    <?php else: ?>
                        <a href="upload.php" class="btn btn-primary">
                            <i class="fas fa-upload"></i>
                            Upload Media
                        </a>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </main>
    </div>

    <script src="../assets/js/script.js"></script>
</body>
</html>