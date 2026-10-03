/**
 * HCC leads → Google Sheet.
 *
 * Setup (5 minutes, see docs/deployment-hostinger.md §4):
 *  1. Create a Google Sheet named "HCC Leads". Extensions → Apps Script. Paste this file.
 *  2. Project Settings → Script properties → add:
 *       SECRET        = the same long random string as leads_secret in api/config.php
 *       NOTIFY_EMAILS = comma-separated emails to alert on each lead (optional)
 *  3. Deploy → New deployment → Web app → Execute as: Me · Who has access: Anyone → Deploy.
 *     Copy the /exec URL into leads_webhook_url in api/config.php.
 *
 * Every lead becomes one row on the "Leads" tab (created automatically with headers).
 * Columns are added automatically if the website starts sending new fields.
 */
const SHEET_NAME = 'Leads';

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const props = PropertiesService.getScriptProperties();
    const secret = props.getProperty('SECRET');
    if (!secret || body.secret !== secret) return json({ ok: false, error: 'unauthorized' });

    const lead = body.lead || {};
    if (!lead.id || !lead.phone) return json({ ok: false, error: 'invalid_lead' });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      appendLead(lead);
    } finally {
      lock.releaseLock();
    }

    notify(lead, props.getProperty('NOTIFY_EMAILS'));
    return json({ ok: true, id: lead.id });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'server_error' });
  }
}

function appendLead(lead) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  let headers = sheet.getLastRow() > 0 ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];

  // Add any new fields as columns (keeps existing column order intact).
  const missing = Object.keys(lead).filter((k) => headers.indexOf(k) === -1);
  if (missing.length) {
    headers = headers.concat(missing);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  // Phone numbers as text so Sheets doesn't strip the +91 or format them as numbers.
  const row = headers.map((h) => {
    const v = lead[h];
    if (v === undefined || v === null) return '';
    return h === 'phone' ? "'" + v : v;
  });
  sheet.appendRow(row);
}

function notify(lead, emails) {
  if (!emails) return;
  const lines = [
    'Kind: ' + lead.kind,
    'Name: ' + lead.name,
    'Phone: ' + lead.phone,
    lead.trip && 'Trip: ' + lead.trip,
    lead.departureDate && 'Date: ' + lead.departureDate,
    (lead.transport || lead.stay) && 'Option: ' + [lead.transport, lead.stay].filter(String).join(' · '),
    lead.travellers && 'Travellers: ' + lead.travellers,
    lead.quotedTotal && 'Quoted total: ₹' + lead.quotedTotal,
    lead.destination && 'Destination: ' + lead.destination,
    lead.dates && 'When: ' + lead.dates,
    lead.budget && 'Budget: ' + lead.budget,
    lead.lastSource && 'Source: ' + [lead.lastSource, lead.lastMedium, lead.lastCampaign].filter(String).join(' / '),
    lead.warnings && 'Check: ' + lead.warnings,
    '',
    'WhatsApp: https://wa.me/91' + String(lead.phone).replace(/\D/g, '').slice(-10),
    'Lead ID: ' + lead.id,
  ].filter((l) => l !== false && l !== undefined && l !== null);
  MailApp.sendEmail({
    to: emails,
    subject: 'New HCC ' + lead.kind + ' lead: ' + lead.name + (lead.trip ? ' · ' + lead.trip : ''),
    body: lines.join('\n'),
  });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
