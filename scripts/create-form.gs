/**
 * Beach Field Day — registration form generator (Google Apps Script).
 *
 * HOW TO RUN:
 *  1. Go to https://script.google.com  →  New project
 *  2. Delete the sample code, paste THIS whole file in
 *  3. (Optional) adjust SEASON_START / SEASON_END below to your real dates
 *  4. Click Run (▶). The first run asks you to authorize — allow it.
 *  5. Open  View → Logs  (or Execution log). It prints two links:
 *       - EDIT link  (to tweak the form)
 *       - LIVE link  (the forms.gle / viewform link you put on the website)
 *
 * The form is created in your Google Drive and is fully editable afterward.
 */

// ── Season dates for the "Which days?" checkboxes ────────────────────────────
// Only Saturdays & Sundays between these two dates are listed.
// Months are 0-indexed in JS Dates: 5 = June, 7 = August.
var SEASON_START = new Date(2026, 5, 27); // Sat, Jun 27, 2026
var SEASON_END   = new Date(2026, 7, 30); // Sun, Aug 30, 2026

function createBeachFieldDayForm() {
  var form = FormApp.create('Beach Field Day — Registration');

  form.setDescription(
    'Drop-off beach camp for kids ages 4–9 in Longport, NJ. Saturdays & Sundays, ' +
    '9am–Noon, $80/day (optional stay until 1pm for +$30/day). We meet at the ' +
    'basketball courts at 35th & Atlantic.\n\n' +
    'Questions? Email hello@beachfieldday.com or text (610) 804-9222.'
  );

  form.setCollectEmail(true);          // auto-captures the signed-in Google email
  form.setProgressBar(true);
  form.setShowLinkToRespondAgain(true); // lets a parent register a second child easily

  var emailRule = FormApp.createTextValidation()
    .setHelpText('Please enter a valid email address.')
    .requireTextIsEmail()
    .build();

  // ── CHILD ──────────────────────────────────────────────────────────────────
  form.addSectionHeaderItem().setTitle('Your Child');

  form.addTextItem()
    .setTitle("Child's full name")
    .setRequired(true);

  form.addListItem()
    .setTitle("Child's age")
    .setChoiceValues(['4', '5', '6', '7', '8', '9'])
    .setRequired(true);

  form.addTextItem()
    .setTitle('Grade entering Fall 2026')
    .setHelpText('e.g. Pre-K, Kindergarten, 1st, 2nd…')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('T-shirt size')
    .setHelpText('Youth XS / S / M / L (or note if adult size needed)');

  // ── PARENT / GUARDIAN ────────────────────────────────────────────────────────
  form.addSectionHeaderItem().setTitle('Parent / Guardian');

  form.addTextItem()
    .setTitle('Parent / guardian name(s)')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Best phone number (for day-of texts)')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Email')
    .setValidation(emailRule)
    .setRequired(true);

  // ── EMERGENCY + PICKUP ───────────────────────────────────────────────────────
  form.addSectionHeaderItem().setTitle('Emergency & Pick-up');

  form.addTextItem()
    .setTitle('Emergency contact — name & phone')
    .setHelpText('Someone OTHER than the parent above.')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Authorized pick-up names')
    .setHelpText('List every adult allowed to pick up your child. Photo ID is checked at pickup.')
    .setRequired(true);

  // ── MEDICAL ──────────────────────────────────────────────────────────────────
  form.addSectionHeaderItem().setTitle('Health & Safety');

  form.addParagraphTextItem()
    .setTitle('Allergies, medical conditions, or medications')
    .setHelpText('Write "None" if not applicable. This is reviewed daily by staff.')
    .setRequired(true);

  // ── DAYS REQUESTED ───────────────────────────────────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Which days?')
    .setHelpText('Check every day you want to register for. $80 per child, per day.');

  form.addCheckboxItem()
    .setTitle('Days requested')
    .setChoiceValues(weekendDates(SEASON_START, SEASON_END))
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Add the extended stay (until 1pm) for +$30/day?')
    .setHelpText('If yes, pack a small lunch on those days.')
    .setChoiceValues(['No thanks — pick up at Noon', 'Yes — stay until 1pm (+$30/day)'])
    .setRequired(true);

  // ── CONSENTS ─────────────────────────────────────────────────────────────────
  form.addSectionHeaderItem().setTitle('Consent & Waiver');

  form.addCheckboxItem()
    .setTitle('Photo / video consent')
    .setChoiceValues(['I allow Beach Field Day to use photos/videos of my child for promotion.'])
    .setRequired(false);

  form.addCheckboxItem()
    .setTitle('Liability waiver')
    .setHelpText(
      'I acknowledge that beach activities carry inherent risks. I release Beach Field Day ' +
      'and its staff from liability for injuries except those caused by gross negligence. ' +
      'I confirm my child is healthy enough to participate.'
    )
    .setChoiceValues(['I have read and agree to the liability waiver.'])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('How did you hear about us?');

  // ── DONE ─────────────────────────────────────────────────────────────────────
  var editUrl = form.getEditUrl();
  var liveUrl = form.shortenFormUrl(form.getPublishedUrl());

  Logger.log('✅ Form created!');
  Logger.log('EDIT this form here:  ' + editUrl);
  Logger.log('LIVE link for the website (put this in REGISTER_URL):  ' + liveUrl);
}

/** Returns an array like ["Sat, Jun 27", "Sun, Jun 28", …] for weekends in range. */
function weekendDates(start, end) {
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var out = [];
  var d = new Date(start.getTime());
  while (d <= end) {
    var dow = d.getDay();
    if (dow === 0 || dow === 6) {
      out.push(days[dow] + ', ' + months[d.getMonth()] + ' ' + d.getDate());
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}
