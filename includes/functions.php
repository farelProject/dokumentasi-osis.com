<?php
// Database functions using JSON files

function readJsonFile($filename) {
    if (!file_exists($filename)) {
        return [];
    }
    $content = file_get_contents($filename);
    return json_decode($content, true) ?: [];
}

function writeJsonFile($filename, $data) {
    return file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT));
}

// Media functions
function getAllMedia() {
    $media = readJsonFile(MEDIA_FILE);
    usort($media, function($a, $b) {
        return strtotime($b['uploadedAt']) - strtotime($a['uploadedAt']);
    });
    return $media;
}

function getLatestMedia($limit = 3) {
    $media = getAllMedia();
    return array_slice($media, 0, $limit);
}

function searchMedia($query = '', $category = '', $type = '') {
    $media = getAllMedia();
    
    if (empty($query) && empty($category) && empty($type)) {
        return $media;
    }
    
    return array_filter($media, function($item) use ($query, $category, $type) {
        $matchesQuery = empty($query) || 
            stripos($item['title'], $query) !== false || 
            stripos($item['description'], $query) !== false;
        
        $matchesCategory = empty($category) || $item['category'] === $category;
        
        $matchesType = empty($type) || 
            ($type === 'image' && strpos($item['mimeType'], 'image/') === 0) ||
            ($type === 'video' && strpos($item['mimeType'], 'video/') === 0);
        
        return $matchesQuery && $matchesCategory && $matchesType;
    });
}

function addMedia($data) {
    $media = readJsonFile(MEDIA_FILE);
    $newId = empty($media) ? 1 : max(array_column($media, 'id')) + 1;
    
    $newMedia = [
        'id' => $newId,
        'title' => $data['title'],
        'description' => $data['description'],
        'filename' => $data['filename'],
        'originalName' => $data['originalName'],
        'mimeType' => $data['mimeType'],
        'size' => $data['size'],
        'category' => $data['category'],
        'uploadedAt' => date('Y-m-d H:i:s')
    ];
    
    $media[] = $newMedia;
    writeJsonFile(MEDIA_FILE, $media);
    return $newMedia;
}

function deleteMedia($id) {
    $media = readJsonFile(MEDIA_FILE);
    $index = array_search($id, array_column($media, 'id'));
    
    if ($index !== false) {
        $item = $media[$index];
        // Delete file
        $filepath = UPLOADS_PATH . '/' . $item['filename'];
        if (file_exists($filepath)) {
            unlink($filepath);
        }
        
        // Remove from array
        unset($media[$index]);
        $media = array_values($media);
        writeJsonFile(MEDIA_FILE, $media);
        return true;
    }
    return false;
}

// Program functions
function getAllPrograms() {
    $programs = readJsonFile(PROGRAMS_FILE);
    usort($programs, function($a, $b) {
        return strtotime($b['createdAt']) - strtotime($a['createdAt']);
    });
    return $programs;
}

function getLatestPrograms($limit = 3) {
    $programs = getAllPrograms();
    return array_slice($programs, 0, $limit);
}

function addProgram($data) {
    $programs = readJsonFile(PROGRAMS_FILE);
    $newId = empty($programs) ? 1 : max(array_column($programs, 'id')) + 1;
    
    $newProgram = [
        'id' => $newId,
        'name' => $data['name'],
        'description' => $data['description'],
        'startDate' => $data['startDate'],
        'endDate' => $data['endDate'],
        'status' => $data['status'],
        'createdAt' => date('Y-m-d H:i:s')
    ];
    
    $programs[] = $newProgram;
    writeJsonFile(PROGRAMS_FILE, $programs);
    return $newProgram;
}

function updateProgram($id, $data) {
    $programs = readJsonFile(PROGRAMS_FILE);
    $index = array_search($id, array_column($programs, 'id'));
    
    if ($index !== false) {
        $programs[$index] = array_merge($programs[$index], $data);
        writeJsonFile(PROGRAMS_FILE, $programs);
        return $programs[$index];
    }
    return false;
}

function deleteProgram($id) {
    $programs = readJsonFile(PROGRAMS_FILE);
    $index = array_search($id, array_column($programs, 'id'));
    
    if ($index !== false) {
        unset($programs[$index]);
        $programs = array_values($programs);
        writeJsonFile(PROGRAMS_FILE, $programs);
        return true;
    }
    return false;
}

// User functions
function authenticateUser($username, $password) {
    $users = readJsonFile(USERS_FILE);
    
    foreach ($users as $user) {
        if ($user['username'] === $username && password_verify($password, $user['password'])) {
            return $user;
        }
    }
    return false;
}

// Utility functions
function formatFileSize($bytes) {
    if ($bytes == 0) return '0 Bytes';
    $k = 1024;
    $sizes = ['Bytes', 'KB', 'MB', 'GB'];
    $i = floor(log($bytes) / log($k));
    return round($bytes / pow($k, $i), 2) . ' ' . $sizes[$i];
}

function formatDate($date) {
    return date('d M Y', strtotime($date));
}

function getStatusBadge($status) {
    $statusConfig = [
        'planning' => ['label' => 'Perencanaan', 'class' => 'status-secondary'],
        'running' => ['label' => 'Berjalan', 'class' => 'status-primary'],
        'completed' => ['label' => 'Selesai', 'class' => 'status-success'],
        'postponed' => ['label' => 'Ditunda', 'class' => 'status-danger']
    ];
    
    $config = $statusConfig[$status] ?? $statusConfig['planning'];
    return '<span class="status-badge ' . $config['class'] . '">' . $config['label'] . '</span>';
}

function getCategoryLabel($category) {
    $categories = [
        'kegiatan-sekolah' => 'Kegiatan Sekolah',
        'program-kerja' => 'Program Kerja',
        'event-khusus' => 'Event Khusus',
        'lainnya' => 'Lainnya'
    ];
    return $categories[$category] ?? ucfirst(str_replace('-', ' ', $category));
}
?>