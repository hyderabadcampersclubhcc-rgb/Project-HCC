<?php
/**
 * Copy to config.php ON THE SERVER (public_html/api/config.php) and fill in.
 * config.php is git-ignored, excluded from deploys and blocked from the web by .htaccess.
 */
return [
    // Google Apps Script web app URL (Deploy → Web app → URL ending in /exec)
    'leads_webhook_url' => 'https://script.google.com/macros/s/XXXXXXXX/exec',
    // Long random string; the same value goes in the Apps Script's SECRET property
    'leads_secret' => 'replace-with-a-long-random-string',
    // Extra hostnames allowed to post (e.g. the staging subdomain)
    'extra_allowed_hosts' => [],
    // Private backup of every lead (JSON lines). Default: one level above public_html.
    // 'backup_dir' => '/home/uXXXXXXX/hcc-leads',

    // Decap CMS login via GitHub (GitHub → Settings → Developer settings → OAuth Apps)
    'github_client_id' => '',
    'github_client_secret' => '',
];
