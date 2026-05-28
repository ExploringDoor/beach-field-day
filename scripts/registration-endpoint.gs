/**
 * Beach Field Day — registration endpoint (Google Apps Script Web App).
 *
 * What it does when the website form is submitted:
 *   1. Saves the registration as a new row in a Google Sheet (auto-creates headers + a "Paid?" column)
 *   2. Emails YOU an instant "new registration" alert
 *   3. Emails the PARENT a branded confirmation with payment instructions
 *
 * ── ONE-TIME SETUP ───────────────────────────────────────────────────────────
 *  1. Go to https://script.google.com  →  New project
 *  2. Delete the sample code, paste THIS whole file in
 *  3. Click Deploy ▸ New deployment
 *       - Type:        Web app
 *       - Description:  Beach Field Day registrations
 *       - Execute as:   Me
 *       - Who has access:  Anyone           ← important (the website calls it)
 *  4. Click Deploy, authorize when asked
 *  5. Copy the "Web app URL" (ends in /exec)
 *  6. Paste that URL into  src/config.js  →  REGISTRATION_ENDPOINT
 *
 *  To find your registrations later: open the Sheet named below from your Google Drive.
 *  (If you change this code later, you must Deploy ▸ Manage deployments ▸ Edit ▸ New version.)
 */

var OWNER_EMAIL = 'adam.miller.22@gmail.com';
var SHEET_NAME  = 'Beach Field Day — Registrations';
var VENMO       = '@Adam-Miller-23';
var ZELLE       = '(610) 804-9222';
var CONTACT     = '(610) 804-9222';
var DAY_RATE    = 80;
var EXT_RATE    = 30;

// Column order written to the Sheet.
var FIELDS = [
  ['submittedAt', 'Submitted'],
  ['firstName',   'Parent First'],
  ['lastName',    'Parent Last'],
  ['email',       'Email'],
  ['phone',       'Phone'],
  ['address',     'Address'],
  ['childName',   'Child Name'],
  ['childAge',    'Child Age'],
  ['emergency',   'Emergency Contact'],
  ['allergies',   'Allergies / Restrictions'],
  ['notes',       'Notes'],
  ['days',        'Days Requested'],
  ['extended',    'Extended Stay'],
  ['payment',     'Pay Method'],
  ['signature',   'Signature'],
];

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

// Lets you open the /exec URL in a browser to confirm it's live.
function doGet() {
  return json_({ ok: true, message: 'Beach Field Day registration endpoint is running.' });
}

function saveRow_(data) {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheets()[0];

  if (sheet.getLastRow() === 0) {
    var headers = FIELDS.map(function (f) { return f[1]; });
    headers.push('Paid?'); // you fill this in manually as payments arrive
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  var row = FIELDS.map(function (f) { return data[f[0]] || ''; });
  row.push(''); // empty Paid? cell
  sheet.appendRow(row);
}

function getSpreadsheet_() {
  // Reuse a single spreadsheet across submissions, tracked in script properties.
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  if (id) {
    try { return SpreadsheetApp.openById(id); } catch (e) { /* recreate below */ }
  }
  var ss = SpreadsheetApp.create(SHEET_NAME);
  props.setProperty('SHEET_ID', ss.getId());
  return ss;
}

function notifyOwner_(d) {
  var subject = 'New registration: ' + (d.childName || 'child') + ' — ' + (d.days || '');
  var body =
    'New Beach Field Day registration\n\n' +
    'Child: ' + d.childName + ' (age ' + (d.childAge || 'n/a') + ')\n' +
    'Parent: ' + d.firstName + ' ' + d.lastName + '\n' +
    'Email: ' + d.email + '\n' +
    'Phone: ' + d.phone + '\n' +
    'Days: ' + d.days + '\n' +
    'Extended stay: ' + d.extended + '\n' +
    'Pay method: ' + d.payment + '\n' +
    'Emergency: ' + d.emergency + '\n' +
    'Allergies: ' + d.allergies + '\n' +
    'Notes: ' + (d.notes || '—') + '\n\n' +
    'Watch for payment via ' + d.payment + '.';
  MailApp.sendEmail(OWNER_EMAIL, subject, body);
}

function confirmParent_(d) {
  if (!d.email) return;
  var extLine = d.extended === 'Yes'
    ? (' (plus $' + EXT_RATE + '/day for the extended stay until 1pm)')
    : '';
  var subject = "You're registered for Beach Field Day! 🏖️";
  var body =
    'Hi ' + d.firstName + ',\n\n' +
    "Thanks for registering " + d.childName + " for Beach Field Day!\n\n" +
    'Days: ' + d.days + '\n' +
    (d.extended === 'Yes' ? 'Extended stay: until 1pm\n' : '') +
    '\n' +
    '⚠️ IMPORTANT — your child\'s spot is NOT confirmed until payment is received.\n\n' +
    'Please send $' + DAY_RATE + ' per child, per day' + extLine + ', with ' + d.childName + "'s name in the note:\n" +
    '  • Venmo: ' + VENMO + '\n' +
    '  • Zelle: ' + ZELLE + '\n\n' +
    'Once we receive payment, we\'ll text you to confirm the spot.\n\n' +
    'WHAT TO BRING each day:\n' +
    '  • Sunscreen applied at home (we can\'t apply on arrival)\n' +
    '  • Labeled water bottle, hat, and towel\n' +
    '  • Athletic clothes + closed-toe sneakers (no flip flops)\n' +
    '  • Swimsuit underneath on water-game days\n' +
    (d.extended === 'Yes' ? '  • A small packed lunch on your extended-stay days\n' : '') +
    '\n' +
    'WHERE: the basketball courts at 35th & Atlantic, Longport, NJ\n' +
    'WHEN: drop-off 9am, pick-up Noon' + (d.extended === 'Yes' ? ' (1pm on extended days)' : '') + '\n\n' +
    'Questions? Just reply to this email or text ' + CONTACT + '.\n\n' +
    'See you on the sand!\n' +
    'Beach Field Day';
  MailApp.sendEmail(d.email, subject, body);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
