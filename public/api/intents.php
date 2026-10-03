<?php
/**
 * HCC enquiry endpoint: POST /api/intents (rewritten to this file by .htaccess).
 *
 * Receives a BookingIntent from the site's lead forms (custom trip, book a seat, itinerary,
 * contact), then:
 *   1. validates it (same-origin, size, honeypot, rate limit, name + 10-digit Indian mobile)
 *   2. re-computes the quote from api/catalog.json (generated at build). The browser's
 *      price is never trusted; mismatches are flagged on the lead.
 *   3. appends a backup copy to a private JSONL file (outside the web root when possible)
 *   4. forwards the lead to the Google Sheet via the Apps Script web app
 *   5. responds { ok, id, next } with next = "confirm" (or "pay" once Razorpay is enabled)
 *
 * Secrets live in api/config.php on the server (never in git). See config.sample.php.
 * Requires PHP 8.0+ with curl (standard on Hostinger).
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const MAX_BODY_BYTES = 16384;
const KINDS = ['custom', 'book', 'itinerary', 'contact'];
const ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'landing', 'referrer'];

function respond(int $status, array $data): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Trim, drop control characters, cap length. */
function clean($value, int $max = 200): string
{
    if (is_array($value) || is_object($value)) {
        return '';
    }
    $s = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', (string) $value) ?? '';
    return trim(mb_substr($s, 0, $max));
}

function ist_now(): DateTimeImmutable
{
    return new DateTimeImmutable('now', new DateTimeZone('Asia/Kolkata'));
}

/* ------------------------------------------------------------------ config */

$configFile = __DIR__ . '/config.php';
$config = is_file($configFile) ? (require $configFile) : [];
if (!is_array($config)) {
    $config = [];
}
$config += [
    'leads_webhook_url' => '',          // Google Apps Script web app URL
    'leads_secret' => '',               // shared secret, also set in the Apps Script
    'extra_allowed_hosts' => [],        // e.g. ['staging.hyderabadcampersclubhcc.in']
    'backup_dir' => dirname(__DIR__, 2) . '/hcc-leads', // outside public_html on Hostinger
    'rate_limit' => 8,                  // max submissions…
    'rate_window' => 600,               // …per IP per 10 minutes
];

/* ------------------------------------------------------------- request guard */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

// Same-origin only: browsers always send Origin on cross-site POSTs.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
    $selfHost = strtolower(preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '') ?? '');
    $allowed = array_map('strtolower', array_merge([$selfHost], (array) $config['extra_allowed_hosts']));
    if (!in_array($originHost, $allowed, true)) {
        respond(403, ['ok' => false, 'error' => 'forbidden_origin']);
    }
}

$raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
if ($raw === false || $raw === '' || strlen($raw) > MAX_BODY_BYTES) {
    respond(413, ['ok' => false, 'error' => 'invalid_body']);
}
$in = json_decode($raw, true);
if (!is_array($in)) {
    respond(400, ['ok' => false, 'error' => 'invalid_json']);
}

// Honeypot: pretend success, store nothing.
if (clean($in['company'] ?? '') !== '') {
    respond(200, ['ok' => true, 'id' => 'HCC-' . ist_now()->format('ymd') . '-000000', 'next' => 'confirm']);
}

/* ---------------------------------------------------------------- rate limit */

function rate_limited(string $ip, int $limit, int $window): bool
{
    $dir = sys_get_temp_dir() . '/hcc-rl';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return false; // fail open: never lose a genuine lead because of tmp permissions
    }
    $file = $dir . '/' . hash('sha256', $ip . '|hcc') . '.json';
    $now = time();
    $fh = @fopen($file, 'c+');
    if (!$fh) {
        return false;
    }
    flock($fh, LOCK_EX);
    $hits = json_decode((string) stream_get_contents($fh), true);
    $hits = array_values(array_filter(is_array($hits) ? $hits : [], fn ($t) => is_int($t) && $t > $now - $window));
    $blocked = count($hits) >= $limit;
    if (!$blocked) {
        $hits[] = $now;
    }
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($hits));
    flock($fh, LOCK_UN);
    fclose($fh);
    return $blocked;
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (rate_limited($ip, (int) $config['rate_limit'], (int) $config['rate_window'])) {
    respond(429, ['ok' => false, 'error' => 'too_many_requests']);
}

/* ---------------------------------------------------------------- validation */

$kind = in_array($in['kind'] ?? '', KINDS, true) ? $in['kind'] : 'contact';
$name = clean($in['name'] ?? '', 80);
if (mb_strlen($name) < 2) {
    respond(422, ['ok' => false, 'error' => 'invalid_name', 'field' => 'name']);
}
$phone = preg_replace('/\D/', '', (string) ($in['phone'] ?? '')) ?? '';
$phone = preg_replace('/^(91|0)(?=\d{10}$)/', '', $phone) ?? '';
if (!preg_match('/^[6-9]\d{9}$/', $phone)) {
    respond(422, ['ok' => false, 'error' => 'invalid_phone', 'field' => 'phone']);
}

/* ------------------------------------------------- server-side quote (catalog) */

$catalog = json_decode((string) @file_get_contents(__DIR__ . '/catalog.json'), true);
$catalog = is_array($catalog) ? $catalog : ['trips' => [], 'payments' => ['enabled' => false]];

$tripId = clean($in['tripId'] ?? '', 80);
$depId = clean($in['departureId'] ?? '', 120);
$transport = clean($in['transport'] ?? '', 40);
$stay = clean($in['stay'] ?? '', 40);
$travellers = max(1, min(30, (int) ($in['travellers'] ?? 1)));
$trip = $tripId !== '' ? ($catalog['trips'][$tripId] ?? null) : null;

$warnings = [];
$quote = null;
$departure = null;
$next = 'confirm';

if ($tripId !== '' && !$trip) {
    $warnings[] = 'unknown_trip';
}
if ($trip && $depId !== '') {
    $departure = $trip['departures'][$depId] ?? null;
    if (!$departure) {
        $warnings[] = 'unknown_departure';
    } else {
        if (empty($departure['bookable'])) {
            $warnings[] = 'departure_not_bookable';
        }
        $ppp = $departure['prices']["$transport|$stay"] ?? null;
        if ($ppp === null) {
            $warnings[] = 'option_unavailable';
        } else {
            $quote = [
                'perPerson' => (int) $ppp,
                'total' => (int) $ppp * $travellers,
                'advance' => isset($trip['advance']) ? (int) $trip['advance'] * $travellers : null,
                'gstPercent' => $trip['gstPercent'] ?? null,
            ];
            $clientTotal = (int) ($in['quotedTotal'] ?? 0);
            if ($clientTotal > 0 && $clientTotal !== $quote['total']) {
                $warnings[] = 'price_mismatch(client=' . $clientTotal . ')';
            }
        }
        $paymentsOn = !empty($catalog['payments']['enabled']);
        if ($kind === 'book' && $paymentsOn && $quote && !empty($departure['bookable']) && ($departure['mode'] ?? 'enquiry') === 'payment') {
            $next = 'pay';
        }
    }
}

/* ------------------------------------------------------------- attribution */

function touch_fields($t): array
{
    $out = [];
    if (is_array($t)) {
        foreach (ATTR_KEYS as $k) {
            if (isset($t[$k])) {
                $out[$k] = clean($t[$k], 200);
            }
        }
    }
    return $out;
}
$attr = is_array($in['attribution'] ?? null) ? $in['attribution'] : [];
$first = touch_fields($attr['first'] ?? null);
$last = touch_fields($attr['last'] ?? null);

/* --------------------------------------------------------------------- lead */

$now = ist_now();
$id = 'HCC-' . $now->format('ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));

$lead = [
    'id' => $id,
    'receivedAt' => $now->format('Y-m-d H:i:s'),
    'kind' => $kind,
    'status' => 'new',
    'name' => $name,
    'phone' => '+91 ' . $phone,
    'trip' => $trip['title'] ?? clean($in['tripTitle'] ?? '', 120),
    'tripId' => $tripId,
    'departureId' => $depId,
    'departureDate' => $departure['start'] ?? clean($in['date'] ?? '', 10),
    'transport' => $trip['transport'][$transport] ?? $transport,
    'stay' => $trip['stay'][$stay] ?? $stay,
    'travellers' => ($kind === 'book' || $kind === 'custom') ? (string) ($in['travellers'] ?? '') : '',
    'pricePerPerson' => $quote['perPerson'] ?? '',
    'quotedTotal' => $quote['total'] ?? '',
    'advanceTotal' => $quote['advance'] ?? '',
    'gstPercent' => $quote['gstPercent'] ?? '',
    'destination' => clean($in['destination'] ?? '', 120),
    'dates' => clean($in['dates'] ?? '', 120),
    'budget' => clean($in['budget'] ?? '', 60),
    'travelType' => clean($in['travelType'] ?? '', 60),
    'message' => clean($in['message'] ?? '', 1000),
    'page' => clean($in['page'] ?? '', 200),
    'firstSource' => $first['utm_source'] ?? '',
    'firstMedium' => $first['utm_medium'] ?? '',
    'firstCampaign' => $first['utm_campaign'] ?? '',
    'firstLanding' => $first['landing'] ?? '',
    'firstReferrer' => $first['referrer'] ?? '',
    'lastSource' => $last['utm_source'] ?? '',
    'lastMedium' => $last['utm_medium'] ?? '',
    'lastCampaign' => $last['utm_campaign'] ?? '',
    'lastContent' => $last['utm_content'] ?? '',
    'lastTerm' => $last['utm_term'] ?? '',
    'gclid' => $last['gclid'] ?? ($first['gclid'] ?? ''),
    'gbraid' => $last['gbraid'] ?? ($first['gbraid'] ?? ''),
    'wbraid' => $last['wbraid'] ?? ($first['wbraid'] ?? ''),
    'fbclid' => $last['fbclid'] ?? ($first['fbclid'] ?? ''),
    'warnings' => implode(', ', $warnings),
    'next' => $next,
];

/* ----------------------------------------------------------------- delivery */

function backup_lead(array $lead, string $dir): bool
{
    $candidates = [$dir, __DIR__ . '/.leads'];
    foreach ($candidates as $d) {
        if (!is_dir($d) && !@mkdir($d, 0700, true) && !is_dir($d)) {
            continue;
        }
        if (str_starts_with(realpath($d) ?: $d, realpath(__DIR__) ?: __DIR__)) {
            // Inside the web root: make sure it can never be served.
            @file_put_contents($d . '/.htaccess', "Require all denied\nDeny from all\n");
        }
        $file = $d . '/leads-' . substr($lead['receivedAt'], 0, 7) . '.jsonl';
        if (@file_put_contents($file, json_encode($lead, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX) !== false) {
            return true;
        }
    }
    return false;
}

function send_to_sheet(array $lead, string $url, string $secret): bool
{
    if ($url === '' || !function_exists('curl_init')) {
        return false;
    }
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode(['secret' => $secret, 'lead' => $lead], JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true, // Apps Script answers via a 302 to googleusercontent.com
        CURLOPT_MAXREDIRS => 3,
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_TIMEOUT => 9,
    ]);
    $body = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    if ($status !== 200 || !is_string($body)) {
        error_log("HCC leads: sheet webhook failed (HTTP $status) $err");
        return false;
    }
    $res = json_decode($body, true);
    if (!is_array($res) || empty($res['ok'])) {
        error_log('HCC leads: sheet webhook rejected: ' . mb_substr($body, 0, 200));
        return false;
    }
    return true;
}

$backedUp = backup_lead($lead, (string) $config['backup_dir']);
$delivered = send_to_sheet($lead, (string) $config['leads_webhook_url'], (string) $config['leads_secret']);

if (!$delivered && !$backedUp) {
    error_log("HCC leads: lead $id could not be stored anywhere");
    respond(502, ['ok' => false, 'error' => 'storage_unavailable']);
}
if (!$delivered) {
    error_log("HCC leads: lead $id saved to backup only");
}

respond(200, ['ok' => true, 'id' => $id, 'next' => $next]);
