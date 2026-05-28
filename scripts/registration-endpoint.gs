/**
 * Beach Field Day — registration endpoint (Google Apps Script Web App).
 *
 * Handles three jobs:
 *   • POST  (form submit)            → saves a row, emails owner + parent
 *   • GET  ?action=counts           → per-date booked counts (for capacity)   [JSONP]
 *   • GET  ?action=list&key=PASSWORD → all registrations (for the admin page)  [JSONP]
 *
 * ── SETUP / REDEPLOY ──────────────────────────────────────────────────────────
 *  Paste this whole file into your existing Apps Script project (replace all),
 *  then:  Deploy ▸ Manage deployments ▸ (edit, pencil) ▸ Version: New version ▸ Deploy.
 *  The /exec URL stays the same, so nothing on the website needs to change.
 *
 *  IMPORTANT: keep "Who has access = Anyone" so the website can reach it.
 */

var OWNER_EMAIL = 'adam.miller.22@gmail.com';
var SHEET_NAME  = 'Beach Field Day — Registrations';
var ADMIN_KEY   = 'L0ngport';   // password for the /admin page
var CAPACITY    = 40;           // max kids per day
var VENMO       = '@Adam-Miller-23';
var ZELLE       = '(610) 804-9222';
var CONTACT     = '(610) 804-9222';
var DAY_RATE    = 80;
var EXT_RATE    = 30;
var DAY_SEP     = ' | ';        // separator used inside the Days / Extended cells

// Column order written to the Sheet. [payloadKey, Header]
var FIELDS = [
  ['submittedAt',  'Submitted'],
  ['firstName',    'Parent First'],
  ['lastName',     'Parent Last'],
  ['email',        'Email'],
  ['phone',        'Phone'],
  ['address',      'Address'],
  ['childName',    'Child Name'],
  ['childAge',     'Child Age'],
  ['emergency',    'Emergency Contact'],
  ['allergies',    'Allergies / Restrictions'],
  ['notes',        'Notes'],
  ['days',         'Days Requested'],
  ['extendedDays', 'Extended Days'],
  ['total',        'Total $'],
  ['payment',      'Pay Method'],
  ['signature',    'Signature'],
];

// ── POST: save + email ───────────────────────────────────────────────────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    saveRow_(data);
    notifyOwner_(data);
    confirmParent_(data);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// ── GET: status / counts / admin list (JSONP when ?callback= is present) ──────
function doGet(e) {
  var p = (e && e.parameter) || {};
  var cb = p.callback;

  if (p.action === 'counts') {
    return reply_(cb, { ok: true, capacity: CAPACITY, counts: countsByDate_() });
  }

  if (p.action === 'list') {
    if (p.key !== ADMIN_KEY) {
      return reply_(cb, { ok: false, error: 'unauthorized' });
    }
    return reply_(cb, { ok: true, capacity: CAPACITY, registrations: listAll_() });
  }

  return reply_(cb, { ok: true, message: 'Beach Field Day registration endpoint is running.' });
}

// ── Sheet helpers ─────────────────────────────────────────────────────────────
function saveRow_(data) {
  var sheet = getSpreadsheet_().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    var headers = FIELDS.map(function (f) { return f[1]; });
    headers.push('Paid?');
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  var row = FIELDS.map(function (f) { return data[f[0]] !== undefined ? data[f[0]] : ''; });
  row.push('');
  sheet.appendRow(row);

  // Re-write date/phone cells as PLAIN TEXT so Sheets doesn't turn a lone
  // "Sat, Jul 4" into a Date or drop leading zeros from phone numbers.
  // (appendRow coerces on its own; setting format THEN value is the reliable fix.)
  var r = sheet.getLastRow();
  ['phone', 'days', 'extendedDays'].forEach(function (k) {
    var idx = -1;
    for (var i = 0; i < FIELDS.length; i++) { if (FIELDS[i][0] === k) { idx = i + 1; break; } }
    if (idx > 0) {
      var cell = sheet.getRange(r, idx);
      cell.setNumberFormat('@');
      cell.setValue(String(data[k] !== undefined ? data[k] : ''));
    }
  });
}

function countsByDate_() {
  var sheet = getSpreadsheet_().getSheets()[0];
  var counts = {};
  if (sheet.getLastRow() < 2) return counts;
  var values = sheet.getDataRange().getValues();
  var header = values[0];
  var daysCol = header.indexOf('Days Requested');
  if (daysCol < 0) return counts;
  for (var i = 1; i < values.length; i++) {
    var cell = String(values[i][daysCol] || '');
    if (!cell) continue;
    cell.split(DAY_SEP).forEach(function (d) {
      d = d.trim();
      if (d) counts[d] = (counts[d] || 0) + 1;
    });
  }
  return counts;
}

function listAll_() {
  var sheet = getSpreadsheet_().getSheets()[0];
  if (sheet.getLastRow() < 2) return [];
  var values = sheet.getDataRange().getValues();
  var header = values[0];
  var out = [];
  for (var i = 1; i < values.length; i++) {
    var obj = {};
    for (var c = 0; c < header.length; c++) {
      obj[header[c]] = values[i][c];
    }
    out.push(obj);
  }
  return out;
}

/**
 * Helper: prints the registrations sheet's URL to the Execution log.
 * Select "showSheetUrl" in the function dropdown and click Run — no deploy needed.
 * Open the printed link while signed in to THIS Google account.
 */
function showSheetUrl() {
  Logger.log('Your registrations sheet: ' + getSpreadsheet_().getUrl());
}

/**
 * Helper: wipes ALL rows so the next registration rebuilds the new headers.
 * Run this once (instead of deleting rows by hand) if the sheet has old test data.
 */
function clearAllRows() {
  var sheet = getSpreadsheet_().getSheets()[0];
  sheet.clear();
  Logger.log('Sheet cleared. Next registration will create fresh headers.');
}

function getSpreadsheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  if (id) {
    try { return SpreadsheetApp.openById(id); } catch (e) { /* recreate */ }
  }
  var ss = SpreadsheetApp.create(SHEET_NAME);
  props.setProperty('SHEET_ID', ss.getId());
  return ss;
}

// ── Email ─────────────────────────────────────────────────────────────────────
function notifyOwner_(d) {
  var subject = 'New registration: ' + (d.childName || 'child') + ' — $' + (d.total || '0');
  var body =
    'New Beach Field Day registration\n\n' +
    'Child: ' + d.childName + ' (age ' + (d.childAge || 'n/a') + ')\n' +
    'Parent: ' + d.firstName + ' ' + d.lastName + '\n' +
    'Email: ' + d.email + '\n' +
    'Phone: ' + d.phone + '\n' +
    'Days: ' + prettyDays_(d.days) + '\n' +
    'Extended (1pm): ' + (prettyDays_(d.extendedDays) || 'none') + '\n' +
    'TOTAL OWED: $' + d.total + '\n' +
    'Pay method: ' + d.payment + '\n' +
    'Emergency: ' + d.emergency + '\n' +
    'Allergies: ' + d.allergies + '\n' +
    'Notes: ' + (d.notes || '—') + '\n\n' +
    'Watch for $' + d.total + ' via ' + d.payment + '.';
  MailApp.sendEmail(OWNER_EMAIL, subject, body);
}

function confirmParent_(d) {
  if (!d.email) return;
  var subject = "You're registered for Beach Field Day! 🏖️";
  var body =
    'Hi ' + d.firstName + ',\n\n' +
    'Thanks for registering ' + d.childName + ' for Beach Field Day!\n\n' +
    'Days: ' + prettyDays_(d.days) + '\n' +
    (d.extendedDays ? 'Extended until 1pm on: ' + prettyDays_(d.extendedDays) + '\n' : '') +
    '\n' +
    '⚠️ IMPORTANT — your child\'s spot is NOT confirmed until payment is received.\n\n' +
    'AMOUNT TO SEND: $' + d.total + '\n' +
    'Please send it with ' + d.childName + "'s name in the note:\n" +
    '  • Venmo: ' + VENMO + '\n' +
    '  • Zelle: ' + ZELLE + '\n\n' +
    'Once we receive payment, we\'ll text you to confirm the spot.\n\n' +
    'WHAT TO BRING each day:\n' +
    '  • Sunscreen applied at home (we can\'t apply on arrival)\n' +
    '  • Labeled water bottle, hat, and towel\n' +
    '  • Athletic clothes + closed-toe sneakers (no flip flops)\n' +
    '  • Swimsuit underneath on water-game days\n' +
    (d.extendedDays ? '  • A small packed lunch on your extended-stay days\n' : '') +
    '\n' +
    'WHERE: the basketball courts at 35th & Atlantic, Longport, NJ\n' +
    'WHEN: drop-off 9am, pick-up Noon (1pm on extended days)\n\n' +
    'Questions? Just reply to this email or text ' + CONTACT + '.\n\n' +
    'See you on the sand!\n' +
    'Beach Field Day';
  MailApp.sendEmail(d.email, subject, body);
}

function prettyDays_(s) {
  return String(s || '').split(DAY_SEP).map(function (x) { return x.trim(); }).filter(String).join(', ');
}

// ── Output helpers ────────────────────────────────────────────────────────────
function reply_(callback, obj) {
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(obj) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return json_(obj);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
