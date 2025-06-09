<?php
session_start();
require_once '../includes/config.php';
require_once '../includes/functions.php';

requireLogin();

$success = '';
$error = '';

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'add') {
        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $startDate = $_POST['startDate'] ?? '';
        $endDate = $_POST['endDate'] ?? '';
        $status = $_POST['status'] ?? '';
        
        if (empty($name) || empty($description) || empty($startDate) || empty($endDate) || empty($status)) {
            $error = 'Semua field harus diisi';
        } else {
            $programData = [
                'name' => $name,
                'description' => $description,
                'startDate' => $startDate,
                'endDate' => $endDate,
                'status' => $status
            ];
            
            if (addProgram($programData)) {
                $success = 'Program kerja berhasil ditambahkan!';
            } else {
                $error = 'Gagal menambahkan program kerja';
            }
        }
    } elseif ($action === 'edit') {
        $id = (int)($_POST['id'] ?? 0);
        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $startDate = $_POST['startDate'] ?? '';
        $endDate = $_POST['endDate'] ?? '';
        $status = $_POST['status'] ?? '';
        
        if (empty($name) || empty($description) || empty($startDate) || empty($endDate) || empty($status)) {
            $error = 'Semua field harus diisi';
        } else {
            $programData = [
                'name' => $name,
                'description' => $description,
                'startDate' => $startDate,
                'endDate' => $endDate,
                'status' => $status
            ];
            
            if (updateProgram($id, $programData)) {
                $success = 'Program kerja berhasil diperbarui!';
            } else {
                $error = 'Gagal memperbarui program kerja';
            }
        }
    } elseif ($action === 'delete') {
        $id = (int)($_POST['id'] ?? 0);
        if (deleteProgram($id)) {
            $success = 'Program kerja berhasil dihapus!';
        } else {
            $error = 'Gagal menghapus program kerja';
        }
    }
}

$programs = getAllPrograms();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kelola Program Kerja - OSIS SMKN 5 Bulukumba</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <?php include 'includes/admin-navbar.php'; ?>

    <div class="admin-layout">
        <?php include 'includes/admin-sidebar.php'; ?>
        
        <main class="admin-main">
            <div class="admin-header">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h1>Kelola Program Kerja</h1>
                        <p>Tambah dan kelola program kerja OSIS</p>
                    </div>
                    <button type="button" class="btn btn-primary" onclick="showAddForm()">
                        <i class="fas fa-plus"></i>
                        Tambah Program
                    </button>
                </div>
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

            <!-- Add/Edit Form -->
            <div id="programForm" class="card" style="display: none; margin-bottom: 24px;">
                <div class="card-header">
                    <h2 class="card-title" id="formTitle">Tambah Program Kerja Baru</h2>
                </div>
                
                <form method="POST" action="" style="padding: 24px;">
                    <input type="hidden" name="action" id="formAction" value="add">
                    <input type="hidden" name="id" id="programId">
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div class="form-group">
                            <label for="name">Nama Program</label>
                            <input type="text" id="name" name="name" class="form-control" 
                                   placeholder="Masukkan nama program" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="status">Status</label>
                            <select id="status" name="status" class="form-control" required>
                                <option value="">Pilih status</option>
                                <option value="planning">Perencanaan</option>
                                <option value="running">Sedang Berjalan</option>
                                <option value="completed">Selesai</option>
                                <option value="postponed">Ditunda</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="startDate">Tanggal Mulai</label>
                            <input type="date" id="startDate" name="startDate" class="form-control" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="endDate">Tanggal Selesai</label>
                            <input type="date" id="endDate" name="endDate" class="form-control" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="description">Deskripsi Program</label>
                        <textarea id="description" name="description" class="form-control" rows="4" 
                                  placeholder="Jelaskan detail program kerja" required></textarea>
                    </div>
                    
                    <div style="display: flex; justify-content: flex-end; gap: 16px;">
                        <button type="button" class="btn btn-outline" onclick="hideForm()">
                            <i class="fas fa-times"></i>
                            Batal
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i>
                            <span id="submitText">Simpan Program</span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Programs Grid -->
            <?php if (!empty($programs)): ?>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 24px;">
                    <?php foreach ($programs as $program): ?>
                        <div class="card" style="position: relative;">
                            <div style="padding: 24px;">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                                    <h3 style="color: var(--gray-900); font-size: 1.25rem; font-weight: bold; margin: 0; flex: 1; margin-right: 16px;"><?php echo htmlspecialchars($program['name']); ?></h3>
                                    <div style="display: flex; gap: 8px;">
                                        <button type="button" class="btn btn-sm btn-outline" onclick="editProgram(<?php echo htmlspecialchars(json_encode($program)); ?>)">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <form method="POST" action="" style="display: inline;" onsubmit="return confirm('Apakah Anda yakin ingin menghapus program ini?')">
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo $program['id']; ?>">
                                            <button type="submit" class="btn btn-sm btn-danger">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                                
                                <p style="color: var(--gray-600); margin-bottom: 16px; line-height: 1.5;"><?php echo htmlspecialchars($program['description']); ?></p>
                                
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; font-size: 14px; color: var(--gray-500);">
                                    <i class="fas fa-calendar"></i>
                                    <span><?php echo formatDate($program['startDate']); ?> - <?php echo formatDate($program['endDate']); ?></span>
                                </div>
                                
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <?php echo getStatusBadge($program['status']); ?>
                                    <span style="font-size: 12px; color: var(--gray-500);">
                                        Dibuat: <?php echo formatDate($program['createdAt']); ?>
                                    </span>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <!-- Empty State -->
                <div style="text-align: center; padding: 80px 20px;">
                    <div style="width: 96px; height: 96px; background-color: var(--gray-100); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                        <i class="fas fa-calendar" style="font-size: 3rem; color: var(--gray-400);"></i>
                    </div>
                    <h3 style="font-size: 1.5rem; color: var(--gray-700); margin-bottom: 12px;">Belum Ada Program Kerja</h3>
                    <p style="color: var(--gray-500); margin-bottom: 24px; max-width: 400px; margin-left: auto; margin-right: auto;">
                        Mulai tambahkan program kerja OSIS untuk mengelola kegiatan dengan lebih terorganisir.
                    </p>
                    <button type="button" class="btn btn-primary" onclick="showAddForm()">
                        <i class="fas fa-plus"></i>
                        Tambah Program Pertama
                    </button>
                </div>
            <?php endif; ?>
        </main>
    </div>

    <script>
        function showAddForm() {
            document.getElementById('programForm').style.display = 'block';
            document.getElementById('formTitle').textContent = 'Tambah Program Kerja Baru';
            document.getElementById('formAction').value = 'add';
            document.getElementById('submitText').textContent = 'Simpan Program';
            resetForm();
        }

        function hideForm() {
            document.getElementById('programForm').style.display = 'none';
            resetForm();
        }

        function resetForm() {
            document.getElementById('programId').value = '';
            document.getElementById('name').value = '';
            document.getElementById('description').value = '';
            document.getElementById('startDate').value = '';
            document.getElementById('endDate').value = '';
            document.getElementById('status').value = '';
        }

        function editProgram(program) {
            document.getElementById('programForm').style.display = 'block';
            document.getElementById('formTitle').textContent = 'Edit Program Kerja';
            document.getElementById('formAction').value = 'edit';
            document.getElementById('submitText').textContent = 'Perbarui Program';
            
            document.getElementById('programId').value = program.id;
            document.getElementById('name').value = program.name;
            document.getElementById('description').value = program.description;
            document.getElementById('startDate').value = program.startDate;
            document.getElementById('endDate').value = program.endDate;
            document.getElementById('status').value = program.status;
            
            document.getElementById('programForm').scrollIntoView({ behavior: 'smooth' });
        }
    </script>
</body>
</html>