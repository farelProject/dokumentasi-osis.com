<?php
session_start();
require_once '../includes/config.php';
require_once '../includes/functions.php';

requireLogin();

$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $category = $_POST['category'] ?? '';
    
    if (empty($title)) {
        $error = 'Judul harus diisi';
    } elseif (empty($category)) {
        $error = 'Kategori harus dipilih';
    } elseif (empty($_FILES['files']['name'][0])) {
        $error = 'Pilih file untuk diupload';
    } else {
        $uploadCount = 0;
        $files = $_FILES['files'];
        
        for ($i = 0; $i < count($files['name']); $i++) {
            if ($files['error'][$i] === UPLOAD_ERR_OK) {
                $originalName = $files['name'][$i];
                $tmpName = $files['tmp_name'][$i];
                $size = $files['size'][$i];
                $mimeType = mime_content_type($tmpName);
                
                // Validate file type
                $allowedTypes = array_merge(ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES);
                if (!in_array($mimeType, $allowedTypes)) {
                    $error = "File {$originalName} tidak didukung. Hanya foto dan video yang diizinkan.";
                    continue;
                }
                
                // Validate file size
                if ($size > MAX_FILE_SIZE) {
                    $error = "File {$originalName} terlalu besar. Maksimal 50MB.";
                    continue;
                }
                
                // Generate unique filename
                $extension = pathinfo($originalName, PATHINFO_EXTENSION);
                $filename = uniqid() . '_' . time() . '.' . $extension;
                $filepath = UPLOADS_PATH . '/' . $filename;
                
                if (move_uploaded_file($tmpName, $filepath)) {
                    // Add to database
                    $mediaData = [
                        'title' => $title,
                        'description' => $description,
                        'filename' => $filename,
                        'originalName' => $originalName,
                        'mimeType' => $mimeType,
                        'size' => $size,
                        'category' => $category
                    ];
                    
                    addMedia($mediaData);
                    $uploadCount++;
                }
            }
        }
        
        if ($uploadCount > 0) {
            $success = $uploadCount === 1 ? 'File berhasil diupload!' : "{$uploadCount} file berhasil diupload!";
        } elseif (empty($error)) {
            $error = 'Gagal mengupload file';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Media - OSIS SMKN 5 Bulukumba</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <?php include 'includes/admin-navbar.php'; ?>

    <div class="admin-layout">
        <?php include 'includes/admin-sidebar.php'; ?>
        
        <main class="admin-main">
            <div class="admin-header">
                <h1>Upload Media</h1>
                <p>Upload foto dan video dokumentasi kegiatan OSIS</p>
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

            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Upload File Baru</h2>
                </div>
                
                <form method="POST" action="" enctype="multipart/form-data" style="padding: 24px;">
                    <div class="form-group">
                        <label>Upload File</label>
                        <div class="upload-area" id="uploadArea">
                            <div class="upload-icon">
                                <i class="fas fa-cloud-upload-alt"></i>
                            </div>
                            <div class="upload-text">
                                <h3>Pilih file untuk diupload</h3>
                                <p>atau drag & drop file di sini</p>
                                <button type="button" class="btn btn-outline" onclick="document.getElementById('fileInput').click()">
                                    Pilih File
                                </button>
                                <p style="color: var(--gray-400); font-size: 12px; margin-top: 12px;">
                                    Format yang didukung: JPG, PNG, GIF, MP4, AVI, MOV, WMV (Max 50MB per file)
                                </p>
                            </div>
                        </div>
                        <input type="file" id="fileInput" name="files[]" multiple accept="image/*,video/*" style="display: none;" required>
                    </div>

                    <div id="fileList" class="file-list" style="display: none;"></div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 24px;">
                        <div class="form-group">
                            <label for="title">Judul</label>
                            <input type="text" id="title" name="title" class="form-control" 
                                   placeholder="Masukkan judul media" required 
                                   value="<?php echo htmlspecialchars($_POST['title'] ?? ''); ?>">
                        </div>
                        
                        <div class="form-group">
                            <label for="category">Kategori</label>
                            <select id="category" name="category" class="form-control" required>
                                <option value="">Pilih kategori</option>
                                <option value="kegiatan-sekolah" <?php echo ($_POST['category'] ?? '') === 'kegiatan-sekolah' ? 'selected' : ''; ?>>Kegiatan Sekolah</option>
                                <option value="program-kerja" <?php echo ($_POST['category'] ?? '') === 'program-kerja' ? 'selected' : ''; ?>>Program Kerja</option>
                                <option value="event-khusus" <?php echo ($_POST['category'] ?? '') === 'event-khusus' ? 'selected' : ''; ?>>Event Khusus</option>
                                <option value="lainnya" <?php echo ($_POST['category'] ?? '') === 'lainnya' ? 'selected' : ''; ?>>Lainnya</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="description">Deskripsi</label>
                        <textarea id="description" name="description" class="form-control" rows="4" 
                                  placeholder="Masukkan deskripsi media"><?php echo htmlspecialchars($_POST['description'] ?? ''); ?></textarea>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 16px; margin-top: 32px;">
                        <a href="dashboard.php" class="btn btn-outline">
                            Batal
                        </a>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-upload"></i>
                            Upload Media
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </div>

    <script>
        // File upload handling
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const fileList = document.getElementById('fileList');

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            fileInput.files = e.dataTransfer.files;
            displayFiles();
        });

        fileInput.addEventListener('change', displayFiles);

        function displayFiles() {
            const files = fileInput.files;
            if (files.length === 0) {
                fileList.style.display = 'none';
                return;
            }

            fileList.style.display = 'block';
            fileList.innerHTML = '<h3 style="margin-bottom: 16px;">File yang dipilih:</h3>';

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';

                const isImage = file.type.startsWith('image/');
                const isVideo = file.type.startsWith('video/');
                const icon = isImage ? 'fa-image' : (isVideo ? 'fa-video' : 'fa-file');

                fileItem.innerHTML = `
                    <div class="file-info">
                        <i class="fas ${icon} file-icon"></i>
                        <div class="file-details">
                            <h4>${file.name}</h4>
                            <p>${formatFileSize(file.size)}</p>
                        </div>
                    </div>
                    <button type="button" onclick="removeFile(${i})" class="btn btn-sm btn-danger">
                        <i class="fas fa-times"></i>
                    </button>
                `;

                fileList.appendChild(fileItem);
            }
        }

        function removeFile(index) {
            const dt = new DataTransfer();
            const files = fileInput.files;

            for (let i = 0; i < files.length; i++) {
                if (i !== index) {
                    dt.items.add(files[i]);
                }
            }

            fileInput.files = dt.files;
            displayFiles();
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    </script>
</body>
</html>