<?php
/**
 * Local test server that mimics Hostinger's .htaccess rewrites.
 *   npm run build && php -S localhost:8088 -t dist tools/php-router.php
 * Also serves a mock Google Sheet webhook at /__mock-sheet (writes to tools/.mock-sheet.jsonl)
 * and a mock Meta Conversions API at /__mock-meta/… (writes to tools/.mock-meta.jsonl).
 */
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
$root = $_SERVER['DOCUMENT_ROOT'];

if ($path === '/__mock-sheet') {
    $body = json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];
    header('Content-Type: application/json');
    if (($body['secret'] ?? '') !== 'local-test-secret') {
        echo json_encode(['ok' => false, 'error' => 'unauthorized']);
        return true;
    }
    file_put_contents(__DIR__ . '/.mock-sheet.jsonl', json_encode($body['lead']) . "\n", FILE_APPEND);
    echo json_encode(['ok' => true, 'id' => $body['lead']['id'] ?? null]);
    return true;
}
if (str_starts_with($path, '/__mock-meta/')) {
    file_put_contents(__DIR__ . '/.mock-meta.jsonl', json_encode(['path' => $path, 'query' => $_GET, 'body' => json_decode(file_get_contents('php://input') ?: '{}', true)]) . "
", FILE_APPEND);
    header('Content-Type: application/json');
    echo json_encode(['events_received' => 1]);
    return true;
}
if (preg_match('#^/api/intents/?$#', $path)) {
    require $root . '/api/intents.php';
    return true;
}
if (preg_match('#^/api/decap-auth/?$#', $path)) {
    require $root . '/api/decap-auth.php';
    return true;
}
if (preg_match('#/api/config(\.sample)?\.php$#', $path)) {
    http_response_code(403);
    return true;
}
// Directory-style URLs → index.html (Astro build.format = 'directory')
if (substr($path, -1) === '/' && is_file($root . $path . 'index.html')) {
    readfile($root . $path . 'index.html');
    return true;
}
return false; // let the built-in server serve static files
