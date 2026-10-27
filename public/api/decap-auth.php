<?php
/**
 * GitHub OAuth for Decap CMS (/admin/): GET /api/decap-auth (rewritten by .htaccess).
 * Needed because the site is static on Hostinger (no Netlify Identity).
 *
 *  1st call: redirects to GitHub's consent screen (with a CSRF state cookie)
 *  callback: exchanges ?code for a token and hands it to the CMS window via postMessage,
 *            only to this site's own origin.
 *
 * Requires github_client_id / github_client_secret in api/config.php. The GitHub OAuth App's
 * callback URL must be https://<this host>/api/decap-auth
 */
declare(strict_types=1);

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$config = is_file(__DIR__ . '/config.php') ? (require __DIR__ . '/config.php') : [];
$clientId = (string) ($config['github_client_id'] ?? '');
$clientSecret = (string) ($config['github_client_secret'] ?? '');

$host = preg_replace('/[^a-z0-9.\-:]/i', '', $_SERVER['HTTP_HOST'] ?? '') ?? '';
$origin = 'https://' . $host;
$callback = $origin . '/api/decap-auth';

function finish(string $status, array $payload, string $origin): void
{
    $message = 'authorization:github:' . $status . ':' . json_encode($payload, JSON_UNESCAPED_SLASHES);
    $msgJs = json_encode($message, JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
    $originJs = json_encode($origin, JSON_UNESCAPED_SLASHES | JSON_HEX_TAG);
    header('Content-Type: text/html; charset=utf-8');
    echo <<<HTML
<!doctype html><meta charset="utf-8"><title>HCC CMS login</title>
<p style="font:16px system-ui;padding:24px">Finishing sign-in…</p>
<script>
(function () {
  var origin = {$originJs};
  function receive(e) {
    if (e.origin !== origin) return;
    window.opener.postMessage({$msgJs}, origin);
    window.removeEventListener('message', receive, false);
    setTimeout(function () { window.close(); }, 300);
  }
  window.addEventListener('message', receive, false);
  window.opener && window.opener.postMessage('authorizing:github', origin);
})();
</script>
HTML;
    exit;
}

if ($clientId === '' || $clientSecret === '') {
    http_response_code(503);
    finish('error', ['message' => 'CMS login is not configured on the server'], $origin);
}

// Step 1: send the editor to GitHub.
if (!isset($_GET['code'])) {
    $state = bin2hex(random_bytes(16));
    setcookie('hcc_cms_state', $state, ['expires' => time() + 600, 'path' => '/api/', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax']);
    header('Location: https://github.com/login/oauth/authorize?' . http_build_query([
        'client_id' => $clientId,
        'redirect_uri' => $callback,
        'scope' => 'repo,user',
        'state' => $state,
    ]));
    exit;
}

// Step 2: GitHub sent the editor back.
$state = (string) ($_GET['state'] ?? '');
if ($state === '' || !hash_equals((string) ($_COOKIE['hcc_cms_state'] ?? ''), $state)) {
    finish('error', ['message' => 'Login expired or invalid. Please try again.'], $origin);
}
setcookie('hcc_cms_state', '', ['expires' => time() - 3600, 'path' => '/api/', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax']);

$ch = curl_init('https://github.com/login/oauth/access_token');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query([
        'client_id' => $clientId,
        'client_secret' => $clientSecret,
        'code' => (string) $_GET['code'],
        'redirect_uri' => $callback,
    ]),
    CURLOPT_HTTPHEADER => ['Accept: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
]);
$res = json_decode((string) curl_exec($ch), true);
curl_close($ch);

if (!is_array($res) || empty($res['access_token'])) {
    finish('error', ['message' => 'GitHub did not return a token: ' . ($res['error_description'] ?? 'unknown error')], $origin);
}

// Only approved GitHub accounts may sign in (cms_allowed_users in config.php). An empty list
// allows nobody, so a missing setting fails closed. The token is never handed to anyone else.
$allowed = array_map('strtolower', array_map('strval', (array) ($config['cms_allowed_users'] ?? [])));
$ch = curl_init('https://api.github.com/user');
curl_setopt_array($ch, [
    CURLOPT_HTTPHEADER => ['Accept: application/vnd.github+json', 'Authorization: Bearer ' . $res['access_token'], 'User-Agent: hcc-cms-login'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
]);
$user = json_decode((string) curl_exec($ch), true);
curl_close($ch);
$login = strtolower((string) ($user['login'] ?? ''));
if ($login === '' || !in_array($login, $allowed, true)) {
    finish('error', ['message' => 'This GitHub account is not approved for the HCC admin panel.'], $origin);
}
finish('success', ['token' => $res['access_token'], 'provider' => 'github'], $origin);
