<?php
// Configuration file for OSIS SMKN 5 Bulukumba

// Paths
define('BASE_PATH', dirname(__DIR__));
define('UPLOADS_PATH', BASE_PATH . '/uploads');
define('DATA_PATH', BASE_PATH . '/data');

// JSON Database files
define('MEDIA_FILE', DATA_PATH . '/media.json');
define('PROGRAMS_FILE', DATA_PATH . '/programs.json');
define('USERS_FILE', DATA_PATH . '/users.json');

// Upload settings
define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50MB
define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']);
define('ALLOWED_VIDEO_TYPES', ['video/mp4', 'video/avi', 'video/mov', 'video/wmv']);

// Create necessary directories
if (!file_exists(UPLOADS_PATH)) {
    mkdir(UPLOADS_PATH, 0755, true);
}

if (!file_exists(DATA_PATH)) {
    mkdir(DATA_PATH, 0755, true);
}

// Initialize JSON files if they don't exist
if (!file_exists(MEDIA_FILE)) {
    file_put_contents(MEDIA_FILE, json_encode([]));
}

if (!file_exists(PROGRAMS_FILE)) {
    file_put_contents(PROGRAMS_FILE, json_encode([]));
}

if (!file_exists(USERS_FILE)) {
    $defaultUsers = [
        [
            'id' => 1,
            'username' => 'admin',
            'password' => password_hash('admin123', PASSWORD_DEFAULT)
        ]
    ];
    file_put_contents(USERS_FILE, json_encode($defaultUsers, JSON_PRETTY_PRINT));
}

// Helper function to check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// Helper function to require login
function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: admin/login.php');
        exit;
    }
}
?>