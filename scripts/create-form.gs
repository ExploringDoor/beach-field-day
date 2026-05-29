/**
 * Field Day Adventures — registration form generator (Google Apps Script).
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

// ── Payment details (UPDATE THESE to your real handles) ──────────────────────
var VENMO_HANDLE  = '@Adam-Miller-23';      // ← your Venmo username
var ZELLE_CONTACT = '(610) 804-9222';      // ← your Zelle phone number or email
var DAY_RATE      = 80;                     // $ per child, per day

function createBeachFieldDayForm() {
  var form = FormApp.create('Field Day Adventures — Registration');

  form.setDescription(
    'Drop-off beach camp for kids ages 4–9 in Longport, NJ. Saturdays & Sundays, ' +
    '9am–Noon, $80/day (optional stay until 1pm for +$30/day). We meet at the ' +
    'basketball courts at 35th & Atlantic.\n\n' +
    'Questions? Email adam.miller.22@gmail.com or text (610) 804-9222.'
  );

  form.setCollectEmail(false);          // we ask for email explicitly, so no forced Google login
  form.setProgressBar(true);
  form.setShowLinkToRespondAgain(true); // lets a parent register a second child easily

  var emailRule = FormApp.createTextValidation()
    .setHelpText('Please enter a valid email address.')
    .requireTextIsEmail()
    .build();

  // ── PARENT / GUARDIAN ────────────────────────────────────────────────────────
  form.addSectionHeaderItem().setTitle('Parent / Guardian');

  form.addTextItem()
    .setTitle('First name')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Last name')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Email')
    .setValidation(emailRule)
    .setRequired(true);

  form.addTextItem()
    .setTitle('Phone number')
    .setHelpText('Best number for day-of texts.')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Address')
    .setRequired(false);

  // ── CHILD ────────────────────────────────────────────────────────────────────
  form.addSectionHeaderItem().setTitle('Your Child');

  form.addTextItem()
    .setTitle("Child's name")
    .setRequired(true);

  form.addListItem()
    .setTitle("Child's age")
    .setChoiceValues(['4', '5', '6', '7', '8', '9'])
    .setRequired(false);

  // ── EMERGENCY & HEALTH ───────────────────────────────────────────────────────
  form.addSectionHeaderItem().setTitle('Emergency & Health');

  form.addTextItem()
    .setTitle('Emergency contact & number')
    .setHelpText('Someone OTHER than the parent above.')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("Child's allergies or restrictions?")
    .setHelpText('Write "None" if not applicable. Reviewed daily by staff.')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Anything else we should know?')
    .setRequired(false);

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

  // ── PAYMENT ──────────────────────────────────────────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Payment')
    .setHelpText(
      '$' + DAY_RATE + ' per child, per day (+$30 for any extended-stay days). ' +
      'Send payment after you submit:\n' +
      '   • Venmo: ' + VENMO_HANDLE + '\n' +
      '   • Zelle: ' + ZELLE_CONTACT + '\n\n' +
      "⚠️ Your child's spot is NOT confirmed until payment is received."
    );

  form.addMultipleChoiceItem()
    .setTitle('How will you be paying?')
    .setChoiceValues(['Venmo (' + VENMO_HANDLE + ')', 'Zelle (' + ZELLE_CONTACT + ')'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Payment acknowledgment')
    .setHelpText('Please confirm you understand the payment policy.')
    .setChoiceValues(['I understand my child is not confirmed until payment is sent.'])
    .setRequired(true);

  // ── LIABILITY WAIVER ─────────────────────────────────────────────────────────
  var waiver =
    'DISCLAIMER OF LIABILITY\n' +
    'Field Day Adventures and its staff do not assume liability for any injuries incurred ' +
    'while at camp or on the way to camp. Parents or guardians should contact their own ' +
    'insurance carrier to obtain additional insurance for the camper, if necessary. As a ' +
    'condition of enrollment, the following release of liability must be agreed to by the ' +
    "camper's parent or guardian.\n\n" +

    'RELEASE OF LIABILITY\n' +
    'In consideration of the minor child/ward named in this registration being allowed to ' +
    'participate in the Field Day Adventures program, its related events and activities, I, the ' +
    'parent/guardian:\n\n' +

    '1. Acknowledge, agree, and represent that I give permission for the minor to participate ' +
    'in the Field Day Adventures program. The minor is physically able and mentally prepared to ' +
    'participate in all activities as described on the Field Day Adventures website and registration ' +
    'materials.\n\n' +

    '2. Affirm that the health history provided for the minor named in this registration is ' +
    'accurate and truthful, and that all medical problems or conditions requiring ongoing ' +
    'medical supervision or care have been fully noted. I give permission for this health ' +
    'information to be shared with the appropriate staff and outside medical personnel as ' +
    'necessary.\n\n' +

    '3. Understand that in the event the minor needs medical treatment and I am unable to be ' +
    'reached, the staff of Field Day Adventures may take reasonable action seeking appropriate care, ' +
    'and I specifically authorize Field Day Adventures to seek emergency medical care for the minor ' +
    'child as deemed necessary.\n\n' +

    '4. Grant permission for Field Day Adventures to record, print, photograph, film, and/or video ' +
    'the minor while attending Field Day Adventures activities. I understand this media may be used ' +
    'for print advertising, the Field Day Adventures website and social media accounts, and other ' +
    'promotional materials for Field Day Adventures.\n\n' +

    '5. On behalf of myself (as parent or guardian), hereby release, indemnify, and hold ' +
    'harmless Field Day Adventures, its directors, officers, employees, and volunteers (collectively ' +
    '"Releasees") from any and all liability, claims, and demands for personal injury, sickness, ' +
    'or death, as well as property damage and expenses, of any nature whatsoever which may be ' +
    'incurred by the undersigned and the child-participant that occur while the child is ' +
    'participating in activities for the above-described program.\n\n' +

    '6. Agree that in the event of any dispute pertaining to any provision of this agreement, to ' +
    'the services rendered by Field Day Adventures, or in any way related to attendance at a Beach ' +
    'Field Day program — including any claim for personal injury or other loss, and including any ' +
    'claim against Field Day Adventures or any director, officer, owner, official, employee, or agent ' +
    'of Field Day Adventures — I hereby agree to submit to binding arbitration to resolve such ' +
    'disputes, by claim filed in New Jersey, to be arbitrated here or at such other venue as ' +
    'deemed appropriate by the arbitrator, such arbitration to proceed under the applicable ' +
    'Rules.\n\n' +

    'PARENT/GUARDIAN CONSENT\n' +
    'I am the parent or legal guardian of the registered minor and hereby give consent for my ' +
    'child to participate in the Field Day Adventures program. I affirm that I have the legal right to ' +
    'issue such consent. I further affirm that I have read this Release of Liability, fully ' +
    'understand its terms, and understand that I have given up substantial rights by agreeing to ' +
    'it and registering for a Field Day Adventures program, and that I do so freely and voluntarily ' +
    'without any inducement.';

  form.addSectionHeaderItem()
    .setTitle('Liability Waiver')
    .setHelpText(waiver);

  form.addCheckboxItem()
    .setTitle('Agreement')
    .setChoiceValues(['I have read and agree to the Release of Liability above.'])
    .setRequired(true);

  form.addTextItem()
    .setTitle('Parent / guardian full name (type to sign)')
    .setHelpText('Typing your name here serves as your digital signature. The date is recorded automatically.')
    .setRequired(true);

  // ── CONFIRMATION SCREEN ──────────────────────────────────────────────────────
  form.setConfirmationMessage(
    'Thanks for registering! 🏖️\n\n' +
    "Your child's spot is NOT yet confirmed. To lock it in, send payment now:\n\n" +
    '   • Venmo: ' + VENMO_HANDLE + '\n' +
    '   • Zelle: ' + ZELLE_CONTACT + '\n\n' +
    'Amount: $' + DAY_RATE + ' per child, per day (+$30 per extended-stay day). ' +
    'Please put your child\'s name in the payment note.\n\n' +
    "We'll text you to confirm once payment is received. " +
    'Questions? Text (610) 804-9222.'
  );

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
