#!/usr/bin/env bash
# Staging deploy helper (called from .github/workflows/deploy.yml). Best effort: never fails the deploy.
# Removes hidden temp files left by interrupted uploads. Hostinger's FTP server writes each upload to
# ".in.<name>." first; if the connection drops, that file stays and every later upload of the same
# file fails with "550 Temporary hidden file … already exists".
# Uses explicit FTPS with lftp's default certificate checks. If the certificate can't be verified,
# this step only warns; delete the listed ".in.*" file in Hostinger's File Manager instead.
# Env: FTP_HOST, FTP_USER, LFTP_PASSWORD, FTP_DIR (with trailing slash).
set -u
command -v lftp > /dev/null || { sudo apt-get update -qq > /dev/null && sudo apt-get install -y -qq lftp > /dev/null; }
lftp -c "
  set cmd:fail-exit no; set net:max-retries 2; set net:timeout 20
  set ftp:ssl-force true; set ftp:ssl-protect-data true
  open --env-password -u \"$FTP_USER\" \"$FTP_HOST\"
  cd \"$FTP_DIR\" || exit 1
  glob -a rm -f .in.* */.in.* */*/.in.* */*/*/.in.*
  echo FTP temp-file cleanup done
" || echo "::warning::FTP temp-file cleanup could not run (connection or certificate); continuing"
exit 0
