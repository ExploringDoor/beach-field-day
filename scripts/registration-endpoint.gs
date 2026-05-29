/**
 * Field Day Adventures - registration endpoint + admin (Google Apps Script Web App).
 *
 * THREE jobs:
 *   - POST (form submit)        -> saves a row (with unique ID), emails owner + parent
 *   - GET ?action=counts        -> per-date booked counts for the website form  [JSONP]
 *   - GET (no params)           -> serves the password-gated ADMIN web app (HTML)
 *
 * The admin is served BY Google, so no browser extension / CORS / ad-blocker can ever
 * block it. It can read AND write the sheet (mark paid, edit, cancel) via google.script.run.
 *
 * -- DEPLOY / REDEPLOY ---------------------------------------------------------
 *  Paste this whole file into the Apps Script project (replace all), Save, then:
 *  Deploy > Manage deployments >  > Version: New version > Deploy.
 *  Keep "Execute as: Me" and "Who has access: Anyone". The /exec URL stays the same.
 *
 *  ADMIN URL = your /exec URL (open it in a browser, enter the password).
 */

var OWNER_EMAIL = 'adam.miller.22@gmail.com';
var SHEET_NAME  = 'Field Day Adventures - Registrations';
var ADMIN_KEY   = 'fielddaycamp';
var CAPACITY    = 40;
var VENMO       = '@Adam-Miller-23';
var ZELLE       = '(610) 804-9222';
var CONTACT     = '(610) 804-9222';
var DAY_RATE    = 100;
var EXT_RATE    = 35;
var DAY_SEP     = ' | ';

// [payloadKey, Header] - column order. ID is first, Paid? is appended at the end.
var FIELDS = [
  ['id',           'ID'],
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
var PAID_HEADER = 'Paid?';

// -- ROUTING -------------------------------------------------------------------
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    data.id = Utilities.getUuid();
    saveRow_(data);
    notifyOwner_(data);
    confirmParent_(data);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.action === 'counts') {
    return reply_(p.callback, { ok: true, capacity: CAPACITY, counts: countsByDate_() });
  }
  // Otherwise: serve the admin web app.
  return HtmlService.createHtmlOutput(adminHtml_())
    .setTitle('Field Day Adventures Admin')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// -- SAVE ----------------------------------------------------------------------
function saveRow_(data) {
  var sheet = getSpreadsheet_().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    var headers = FIELDS.map(function (f) { return f[1]; });
    headers.push(PAID_HEADER);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  var row = FIELDS.map(function (f) { return data[f[0]] !== undefined ? data[f[0]] : ''; });
  row.push('');
  sheet.appendRow(row);

  // Keep date/phone columns as plain text (no Sheets auto-coercion).
  var r = sheet.getLastRow();
  ['phone', 'days', 'extendedDays'].forEach(function (k) {
    var idx = colIndex_(k);
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
  var daysCol = values[0].indexOf('Days Requested');
  if (daysCol < 0) return counts;
  for (var i = 1; i < values.length; i++) {
    String(values[i][daysCol] || '').split(DAY_SEP).forEach(function (d) {
      d = d.trim();
      if (d) counts[d] = (counts[d] || 0) + 1;
    });
  }
  return counts;
}

// -- ADMIN SERVER FUNCTIONS (called from the HTML via google.script.run) --------
function adminGetData(key) {
  if (String(key).trim() !== ADMIN_KEY) return { ok: false, error: 'unauthorized' };
  var sheet = getSpreadsheet_().getSheets()[0];
  var rows = [];
  if (sheet.getLastRow() >= 2) {
    var values = sheet.getDataRange().getValues();
    var header = values[0];
    for (var i = 1; i < values.length; i++) {
      var obj = {};
      for (var c = 0; c < header.length; c++) obj[header[c]] = values[i][c];
      rows.push(obj);
    }
  }
  return { ok: true, capacity: CAPACITY, dayRate: DAY_RATE, extRate: EXT_RATE, rows: rows };
}

function adminSetPaid(key, id, value) {
  if (String(key).trim() !== ADMIN_KEY) return { ok: false, error: 'unauthorized' };
  return writeCell_(id, PAID_HEADER, value);
}

function adminCancel(key, id) {
  if (String(key).trim() !== ADMIN_KEY) return { ok: false, error: 'unauthorized' };
  var sheet = getSpreadsheet_().getSheets()[0];
  var rowNum = findRow_(sheet, id);
  if (rowNum < 0) return { ok: false, error: 'not found' };
  sheet.deleteRow(rowNum);
  return { ok: true };
}

function adminUpdate(key, id, patch) {
  if (String(key).trim() !== ADMIN_KEY) return { ok: false, error: 'unauthorized' };
  var sheet = getSpreadsheet_().getSheets()[0];
  var rowNum = findRow_(sheet, id);
  if (rowNum < 0) return { ok: false, error: 'not found' };
  var header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  Object.keys(patch).forEach(function (h) {
    var c = header.indexOf(h);
    if (c >= 0) {
      var cell = sheet.getRange(rowNum, c + 1);
      if (h === 'Days Requested' || h === 'Extended Days' || h === 'Phone') cell.setNumberFormat('@');
      cell.setValue(patch[h]);
    }
  });
  return { ok: true };
}

function adminAdd(key, patch) {
  if (String(key).trim() !== ADMIN_KEY) return { ok: false, error: 'unauthorized' };
  var data = {};
  FIELDS.forEach(function (f) { data[f[0]] = patch[f[1]] !== undefined ? patch[f[1]] : ''; });
  data.id = Utilities.getUuid();
  if (!data.submittedAt) {
    data.submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }) + ' (added manually)';
  }
  saveRow_(data); // appends a row; no emails sent for manual adds
  return { ok: true, id: data.id };
}

function writeCell_(id, header, value) {
  var sheet = getSpreadsheet_().getSheets()[0];
  var rowNum = findRow_(sheet, id);
  if (rowNum < 0) return { ok: false, error: 'not found' };
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var c = headers.indexOf(header);
  if (c < 0) return { ok: false, error: 'no column' };
  sheet.getRange(rowNum, c + 1).setValue(value);
  return { ok: true };
}

function findRow_(sheet, id) {
  if (sheet.getLastRow() < 2) return -1;
  var ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues(); // ID is column 1
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

function colIndex_(payloadKey) {
  for (var i = 0; i < FIELDS.length; i++) if (FIELDS[i][0] === payloadKey) return i + 1;
  return -1;
}

function getSpreadsheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  if (id) {
    try { return SpreadsheetApp.openById(id); } catch (e) {}
  }
  var ss = SpreadsheetApp.create(SHEET_NAME);
  props.setProperty('SHEET_ID', ss.getId());
  return ss;
}

// -- Helper functions you can Run manually from the editor ----------------------
function showSheetUrl() { Logger.log(getSpreadsheet_().getUrl()); }
function clearAllRows() { getSpreadsheet_().getSheets()[0].clear(); Logger.log('Sheet cleared.'); }

// -- EMAIL ---------------------------------------------------------------------
function notifyOwner_(d) {
  var subject = 'New registration: ' + (d.childName || 'child') + ' - $' + (d.total || '0');
  var body =
    'New Field Day Adventures registration\n\n' +
    'Child: ' + d.childName + ' (age ' + (d.childAge || 'n/a') + ')\n' +
    'Parent: ' + d.firstName + ' ' + d.lastName + '\n' +
    'Email: ' + d.email + '\nPhone: ' + d.phone + '\n' +
    'Days: ' + pretty_(d.days) + '\n' +
    'Extended (1pm): ' + (pretty_(d.extendedDays) || 'none') + '\n' +
    'TOTAL OWED: $' + d.total + '\nPay method: ' + d.payment + '\n' +
    'Emergency: ' + d.emergency + '\nAllergies: ' + d.allergies + '\n' +
    'Notes: ' + (d.notes || '-') + '\n\nWatch for $' + d.total + ' via ' + d.payment + '.';
  MailApp.sendEmail(OWNER_EMAIL, subject, body);
}

function confirmParent_(d) {
  if (!d.email) return;
  var subject = "You're registered for Field Day Adventures! ";
  var body =
    'Hi ' + d.firstName + ',\n\n' +
    'Thanks for registering ' + d.childName + ' for Field Day Adventures!\n\n' +
    'Days: ' + pretty_(d.days) + '\n' +
    (d.extendedDays ? 'Extended until 1pm on: ' + pretty_(d.extendedDays) + '\n' : '') + '\n' +
    " IMPORTANT - your child's spot is NOT confirmed until payment is received.\n\n" +
    'AMOUNT TO SEND: $' + d.total + '\n' +
    'Please send it with ' + d.childName + "'s name in the note:\n" +
    '  - Venmo: ' + VENMO + '\n  - Zelle: ' + ZELLE + '\n\n' +
    "Once we receive payment, we'll text you to confirm the spot.\n\n" +
    'WHAT TO BRING each day:\n' +
    '  - Sunscreen applied at home (we can\'t apply on arrival)\n' +
    '  - Labeled water bottle, hat, and towel\n' +
    '  - Athletic clothes + closed-toe sneakers (no flip flops)\n' +
    '  - Swimsuit underneath on water-game days\n' +
    (d.extendedDays ? '  - A small packed lunch on your extended-stay days\n' : '') + '\n' +
    'WHERE: the basketball courts at 35th & Atlantic, Longport, NJ\n' +
    'WHEN: drop-off 9am, pick-up Noon (1pm on extended days)\n\n' +
    'Questions? Reply to this email or text ' + CONTACT + '.\n\nSee you on the sand!\nField Day Adventures';
  MailApp.sendEmail(d.email, subject, body);
}

function pretty_(s) {
  return String(s || '').split(DAY_SEP).map(function (x) { return x.trim(); }).filter(String).join(', ');
}

// -- OUTPUT HELPERS -------------------------------------------------------------
function reply_(callback, obj) {
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + JSON.stringify(obj) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return json_(obj);
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// -- ADMIN WEB APP (HTML/CSS/JS served by Google) -------------------------------
function adminHtml_() {
  return `<!doctype html><html><head><meta charset="utf-8">
<style>
  :root{--sand:#F5E6C8;--sand-light:#FAF0DA;--ocean:#2B6B8C;--ocean-deep:#1A4A66;--sunset:#E87A4A;--sunset-deep:#C95A2E;--cream:#FFF8EC;--ink:#1F2D38;--ink-soft:#4A5763;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--cream);color:var(--ink);line-height:1.5;}
  .wrap{max-width:1200px;margin:0 auto;padding:16px;}
  h1{font-size:22px;color:var(--ocean-deep);}
  button{font:inherit;cursor:pointer;border:none;border-radius:8px;padding:8px 14px;font-weight:600;}
  .btn{background:var(--ocean-deep);color:var(--cream);}
  .btn:hover{background:var(--ocean);}
  .btn-sm{padding:5px 10px;font-size:13px;border-radius:7px;}
  .btn-ghost{background:#fff;border:1.5px solid var(--ocean);color:var(--ocean-deep);}
  .btn-danger{background:#fff;border:1.5px solid #c0392b;color:#c0392b;}
  /* login */
  #login{max-width:360px;margin:14vh auto;background:#fff;border:1px solid #e3dcc8;border-radius:18px;padding:30px;text-align:center;}
  #login input{width:100%;padding:11px;border:1.5px solid #d8cfb4;border-radius:9px;margin:14px 0;font-size:16px;text-align:center;}
  .err{color:var(--sunset-deep);font-weight:600;font-size:14px;margin-top:8px;}
  /* header */
  header{position:sticky;top:0;background:rgba(255,248,236,.95);backdrop-filter:blur(8px);border-bottom:1px solid #e3dcc8;z-index:5;}
  .hrow{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;}
  .tabs{display:flex;gap:6px;}
  .tab{background:#fff;border:1.5px solid #e3dcc8;color:var(--ink-soft);}
  .tab.active{background:var(--sunset);border-color:var(--sunset);color:#fff;}
  /* stats */
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:14px 0;}
  .stat{background:#fff;border:1px solid #e3dcc8;border-radius:12px;padding:12px;text-align:center;}
  .stat b{display:block;font-size:26px;color:var(--ocean-deep);}
  .stat span{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-soft);}
  /* controls */
  .controls{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px;}
  #search{flex:1;min-width:180px;padding:9px 12px;border:1.5px solid #d8cfb4;border-radius:9px;font-size:15px;}
  select{padding:9px;border:1.5px solid #d8cfb4;border-radius:9px;font-size:15px;background:#fff;}
  /* table */
  .tablewrap{overflow-x:auto;background:#fff;border:1px solid #e3dcc8;border-radius:12px;}
  table{border-collapse:collapse;width:100%;font-size:13px;min-width:900px;}
  th{background:var(--ocean-deep);color:#fff;text-align:left;padding:9px;position:sticky;top:0;white-space:nowrap;}
  td{padding:8px 9px;border-top:1px solid #eee;vertical-align:top;}
  tr.unpaid{background:#fff6f0;}
  .pill{display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;}
  .pill.paid{background:#dff3e4;color:#1e7a43;}
  .pill.no{background:#fde2d6;color:var(--sunset-deep);}
  .allergy{color:#c0392b;font-weight:600;}
  .allergy-none{color:#9aa3aa;}
  .muted{color:var(--ink-soft);}
  .day-card{background:#fff;border:1px solid #e3dcc8;border-radius:12px;padding:14px;margin-bottom:12px;}
  .day-card h3{color:var(--ocean-deep);margin-bottom:6px;}
  .roster-row{display:flex;justify-content:space-between;gap:10px;padding:7px 0;border-top:1px solid #eee;font-size:14px;}
  /* modal */
  .overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);display:none;align-items:center;justify-content:center;padding:16px;z-index:20;}
  .overlay.show{display:flex;}
  .modal{background:#fff;border-radius:16px;max-width:520px;width:100%;max-height:90vh;overflow:auto;padding:22px;}
  .modal h2{color:var(--ocean-deep);margin-bottom:10px;}
  .modal label{display:block;font-size:12px;font-weight:700;color:var(--ocean-deep);margin-top:10px;}
  .modal input,.modal textarea{width:100%;padding:8px;border:1.5px solid #d8cfb4;border-radius:8px;font-size:14px;margin-top:3px;}
  .modal-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:16px;}
  @media print{header,.controls,.stats,.tabs,.noprint,.btn,button{display:none!important;}.day-card{border:none;}body{background:#fff;}}
</style></head><body>

<div id="login">
  <h1>Field Day Adventures</h1>
  <p class="muted" style="margin-top:4px;">Admin - enter password</p>
  <input id="pw" type="password" placeholder="Password" autofocus autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" onkeydown="if(event.key==='Enter')login()">
  <button class="btn" style="width:100%" onclick="login()">View registrations</button>
  <div id="loginErr" class="err"></div>
</div>

<div id="app" style="display:none">
  <header><div class="wrap hrow">
    <h1>Field Day Adventures Admin</h1>
    <div style="display:flex;gap:6px;flex-wrap:wrap;">
      <div class="tabs">
        <button class="tab active" id="tabAll" onclick="showTab('all')">All</button>
        <button class="tab" id="tabDay" onclick="showTab('day')">By day</button>
      </div>
      <button class="btn btn-sm" onclick="openAdd()">+ Add</button>
      <button class="btn btn-sm" onclick="load()">Refresh</button>
      <button class="btn btn-sm btn-ghost" onclick="exportCsv()">Export CSV</button>
    </div>
  </div></header>

  <div class="wrap">
    <div class="stats" id="stats"></div>

    <div id="viewAll">
      <div class="controls">
        <input id="search" placeholder="Search name, parent, email, phone..." oninput="renderTable()">
        <select id="paidFilter" onchange="renderTable()">
          <option value="">All</option><option value="paid">Paid</option><option value="unpaid">Unpaid</option>
        </select>
      </div>
      <div class="tablewrap"><table id="tbl"></table></div>
    </div>

    <div id="viewDay" style="display:none">
      <div class="controls noprint">
        <select id="daySel" onchange="renderDay()"></select>
        <button class="btn btn-sm" onclick="window.print()">Print roster</button>
      </div>
      <div id="dayOut"></div>
    </div>
  </div>
</div>

<div class="overlay" id="overlay"><div class="modal" id="modal"></div></div>

<script>
  var KEY='', DATA=[], CAP=40, DAY_RATE=100, EXT_RATE=35, TAB='all';
  var SEP=${JSON.stringify(DAY_SEP)};

  function call(fn,args){return new Promise(function(res,rej){google.script.run.withSuccessHandler(res).withFailureHandler(rej)[fn].apply(google.script.run,args);});}

  function login(){
    var pw=document.getElementById('pw').value;
    document.getElementById('loginErr').textContent='Loading...';
    call('adminGetData',[pw]).then(function(r){
      if(!r||!r.ok){document.getElementById('loginErr').textContent='Wrong password.';return;}
      KEY=pw;CAP=r.capacity;DAY_RATE=r.dayRate;EXT_RATE=r.extRate;DATA=r.rows||[];
      document.getElementById('login').style.display='none';
      document.getElementById('app').style.display='block';
      buildDaySelect();render();
    }).catch(function(){document.getElementById('loginErr').textContent='Error - try again.';});
  }

  function load(){call('adminGetData',[KEY]).then(function(r){if(r&&r.ok){DATA=r.rows||[];render();}});}

  function render(){renderStats();renderTable();renderDay();}

  function renderStats(){
    var total=DATA.length, paid=DATA.filter(isPaid).length, rev=DATA.reduce(function(s,r){return s+(Number(r['Total $'])||0);},0);
    document.getElementById('stats').innerHTML=
      stat(total,'Registrations')+stat(paid+' / '+total,'Paid')+stat(total-paid,'Awaiting pay')+stat('$'+rev,'Expected');
  }
  function stat(v,l){return '<div class="stat"><b>'+v+'</b><span>'+l+'</span></div>';}
  function isPaid(r){return String(r['Paid?']||'').trim()!=='';}

  function renderTable(){
    var q=(document.getElementById('search').value||'').toLowerCase();
    var pf=document.getElementById('paidFilter').value;
    var rows=DATA.filter(function(r){
      if(pf==='paid'&&!isPaid(r))return false;
      if(pf==='unpaid'&&isPaid(r))return false;
      if(!q)return true;
      return [r['Child Name'],r['Parent First'],r['Parent Last'],r['Email'],r['Phone']].join(' ').toLowerCase().indexOf(q)>=0;
    });
    var h='<tr><th>Child</th><th>Age</th><th>Parent</th><th>Phone</th><th>Days</th><th>1pm</th><th>$</th><th>Pay</th><th>Paid</th><th>Allergies</th><th></th></tr>';
    rows.forEach(function(r){
      var al=String(r['Allergies / Restrictions']||'').trim();
      var alClass=(al&&al.toLowerCase()!=='none')?'allergy':'allergy-none';
      h+='<tr class="'+(isPaid(r)?'':'unpaid')+'">'
        +'<td><b>'+esc(r['Child Name'])+'</b></td><td>'+esc(r['Child Age'])+'</td>'
        +'<td>'+esc(r['Parent First'])+' '+esc(r['Parent Last'])+'<div class="muted">'+esc(r['Email'])+'</div></td>'
        +'<td>'+esc(r['Phone'])+'</td>'
        +'<td>'+esc(pretty(r['Days Requested']))+'</td>'
        +'<td>'+esc(pretty(r['Extended Days'])||'-')+'</td>'
        +'<td>$'+esc(r['Total $'])+'</td><td>'+esc(r['Pay Method'])+'</td>'
        +'<td>'+(isPaid(r)?'<span class="pill paid">'+esc(r['Paid?'])+'</span>':'<span class="pill no">unpaid</span>')+'</td>'
        +'<td class="'+alClass+'">'+esc(al||'None')+'</td>'
        +'<td style="white-space:nowrap">'
          +'<button class="btn-sm '+(isPaid(r)?'btn-ghost':'btn')+'" onclick="togglePaid(\\''+r['ID']+'\\')">'+(isPaid(r)?'Unpay':'Mark paid')+'</button> '
          +'<button class="btn-sm btn-ghost" onclick="openEdit(\\''+r['ID']+'\\')">Edit</button> '
          +'<button class="btn-sm btn-danger" onclick="cancelReg(\\''+r['ID']+'\\')">Cancel</button>'
        +'</td></tr>';
    });
    document.getElementById('tbl').innerHTML=h;
  }

  function buildDaySelect(){
    var days={};
    DATA.forEach(function(r){pretty(r['Days Requested']).split(', ').forEach(function(d){if(d)days[d]=1;});});
    var list=Object.keys(days);
    var sel=document.getElementById('daySel');
    sel.innerHTML=list.map(function(d){return '<option>'+d+'</option>';}).join('')||'<option>No days yet</option>';
  }

  function renderDay(){
    var sel=document.getElementById('daySel');var day=sel.value;
    if(!day){document.getElementById('dayOut').innerHTML='';return;}
    var roster=DATA.filter(function(r){return pretty(r['Days Requested']).split(', ').indexOf(day)>=0;});
    var ext=function(r){return pretty(r['Extended Days']).split(', ').indexOf(day)>=0;};
    var h='<div class="day-card"><h3>'+esc(day)+' - '+roster.length+'/'+CAP+' kids</h3>';
    roster.forEach(function(r){
      var al=String(r['Allergies / Restrictions']||'').trim();
      h+='<div class="roster-row"><div><b>'+esc(r['Child Name'])+'</b> (age '+esc(r['Child Age'])+')'
        +(ext(r)?' <span class="pill paid">until 1pm</span>':'')
        +(al&&al.toLowerCase()!=='none'?' <span class="allergy">ALLERGY: '+esc(al)+'</span>':'')
        +'<div class="muted">'+esc(r['Parent First'])+' '+esc(r['Parent Last'])+' / '+esc(r['Phone'])+'</div></div>'
        +'<div>'+(isPaid(r)?'<span class="pill paid">paid</span>':'<span class="pill no">unpaid</span>')+'</div></div>';
    });
    h+='</div>';
    document.getElementById('dayOut').innerHTML=h;
  }

  function showTab(t){TAB=t;
    document.getElementById('tabAll').classList.toggle('active',t==='all');
    document.getElementById('tabDay').classList.toggle('active',t==='day');
    document.getElementById('viewAll').style.display=t==='all'?'block':'none';
    document.getElementById('viewDay').style.display=t==='day'?'block':'none';
  }

  function togglePaid(id){
    var r=byId(id);if(!r)return;
    var val=isPaid(r)?'':('Paid '+new Date().toLocaleDateString());
    call('adminSetPaid',[KEY,id,val]).then(function(){r['Paid?']=val;render();});
  }

  function cancelReg(id){
    var r=byId(id);if(!r)return;
    if(!confirm('Cancel & delete '+r['Child Name']+'\\'s registration? This cannot be undone.'))return;
    call('adminCancel',[KEY,id]).then(function(){DATA=DATA.filter(function(x){return x['ID']!==id;});buildDaySelect();render();});
  }

  var EDIT_FIELDS=['Parent First','Parent Last','Email','Phone','Address','Child Name','Child Age','Emergency Contact','Allergies / Restrictions','Notes','Days Requested','Extended Days','Total $','Pay Method'];

  function openAdd(){
    var h='<h2>Add registration</h2><p class="muted">Manually add a walk-up or phone signup. For Days/Extended use exactly: <i>Sat, Jun 27'+SEP+'Sun, Jun 28</i>. No emails are sent for manual adds.</p>';
    EDIT_FIELDS.forEach(function(f){
      var ml=(f==='Notes'||f==='Allergies / Restrictions'||f==='Address');
      h+='<label>'+f+'</label>'+(ml?'<textarea data-f="'+f+'" rows="2"></textarea>':'<input data-f="'+f+'" value="">');
    });
    h+='<div class="modal-actions"><button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn" onclick="saveAdd()">Create</button></div>';
    document.getElementById('modal').innerHTML=h;document.getElementById('overlay').classList.add('show');
  }
  function saveAdd(){
    var patch={};
    document.querySelectorAll('#modal [data-f]').forEach(function(el){patch[el.getAttribute('data-f')]=el.value;});
    if(!patch['Child Name']){alert('Child Name is required.');return;}
    call('adminAdd',[KEY,patch]).then(function(r){if(r&&r.ok){closeModal();load();}else{alert('Could not add.');}});
  }

  function openEdit(id){
    var r=byId(id);if(!r)return;
    var h='<h2>Edit registration</h2><p class="muted">Tip: for Days/Extended use exactly: <i>Sat, Jun 27'+SEP+'Sun, Jun 28</i></p>';
    EDIT_FIELDS.forEach(function(f){
      var ml=(f==='Notes'||f==='Allergies / Restrictions'||f==='Address');
      h+='<label>'+f+'</label>'+(ml?'<textarea data-f="'+f+'" rows="2">':'<input data-f="'+f+'" value="'+escAttr(r[f])+'">')+(ml?escAttr(r[f])+'</textarea>':'');
    });
    h+='<div class="modal-actions"><button class="btn-ghost" onclick="closeModal()">Cancel</button><button class="btn" onclick="saveEdit(\\''+id+'\\')">Save</button></div>';
    document.getElementById('modal').innerHTML=h;document.getElementById('overlay').classList.add('show');
  }
  function saveEdit(id){
    var patch={};
    document.querySelectorAll('#modal [data-f]').forEach(function(el){patch[el.getAttribute('data-f')]=el.value;});
    call('adminUpdate',[KEY,id,patch]).then(function(){
      var r=byId(id);for(var k in patch)r[k]=patch[k];
      closeModal();buildDaySelect();render();
    });
  }
  function closeModal(){document.getElementById('overlay').classList.remove('show');}

  function exportCsv(){
    if(!DATA.length){alert('No registrations yet.');return;}
    var cols=Object.keys(DATA[0]);
    var rows=[cols.join(',')].concat(DATA.map(function(r){return cols.map(function(c){return '"'+String(r[c]==null?'':r[c]).replace(/"/g,'""')+'"';}).join(',');}));
    var blob=new Blob([rows.join('\\n')],{type:'text/csv'});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='field-day-adventures-registrations.csv';a.click();
  }

  function byId(id){return DATA.filter(function(r){return r['ID']===id;})[0];}
  function pretty(s){return String(s||'').split(SEP).map(function(x){return x.trim();}).filter(Boolean).join(', ');}
  function esc(s){return String(s==null?'':s).replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}
  function escAttr(s){return esc(s).replace(/"/g,'&quot;');}
</script>
</body></html>`;
}
