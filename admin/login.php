<?php
session_start();
require_once '../includes/config.php';
require_once '../includes/functions.php';

// Redirect if already logged in
if (isLoggedIn()) {
    header('Location: dashboard.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        $error = 'Username dan password harus diisi';
    } else {
        $user = authenticateUser($username, $password);
        if ($user) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            header('Location: dashboard.php');
            exit;
        } else {
            $error = 'Username atau password salah';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin - OSIS SMKN 5 Bulukumba</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            padding: 20px;
        }
        
        .login-card {
            background: var(--white);
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        
        .login-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, var(--primary-color), #2563eb);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 30px;
            font-size: 2rem;
            color: var(--white);
        }
        
        .login-title {
            font-size: 2rem;
            font-weight: bold;
            color: var(--gray-900);
            margin-bottom: 10px;
        }
        
        .login-subtitle {
            color: var(--gray-600);
            margin-bottom: 30px;
        }
        
        .error-message {
            background-color: rgba(239, 68, 68, 0.1);
            color: var(--danger-color);
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        
        .demo-info {
            background-color: var(--gray-100);
            padding: 16px;
            border-radius: 8px;
            margin-top: 20px;
            font-size: 14px;
            color: var(--gray-600);
        }
        
        .demo-credentials {
            font-family: monospace;
            background-color: var(--white);
            padding: 8px 12px;
            border-radius: 4px;
            margin: 4px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-card">
            <div class="login-icon">
                <i class="fas fa-shield-alt"></i>
            </div>
            
            <h1 class="login-title">Login Admin</h1>
            <p class="login-subtitle">Masuk untuk mengelola dokumentasi OSIS</p>
            
            <?php if ($error): ?>
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>
            
            <form method="POST" action="">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" class="form-control" 
                           placeholder="Masukkan username" required 
                           value="<?php echo htmlspecialchars($_POST['username'] ?? ''); ?>">
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" class="form-control" 
                           placeholder="Masukkan password" required>
                </div>
                
                <button type="submit" class="btn btn-primary" style="width: 100%;">
                    <i class="fas fa-sign-in-alt"></i>
                    Masuk
                </button>
            </form>
            
            <div class="demo-info">
                <strong>Demo Credentials:</strong><br>
                Username: <span class="demo-credentials">admin</span><br>
                Password: <span class="demo-credentials">admin123</span>
            </div>
            
            <div style="margin-top: 20px;">
                <a href="../index.php" class="nav-link">
                    <i class="fas fa-arrow-left"></i>
                    Kembali ke Beranda
                </a>
            </div>
        </div>
    </div>
</body>
</html>