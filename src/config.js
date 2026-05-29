// ─────────────────────────────────────────────────────────────────────────────
// Central config for Field Day Adventures.
// ─────────────────────────────────────────────────────────────────────────────

// Paste the Apps Script Web App URL here after you deploy scripts/registration-endpoint.gs
// (it ends in /exec). Until then, the form runs in "demo mode" and won't save.
export const REGISTRATION_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxZViIOl_tr5GmkuhT3SGk6v6EI7aHrF_9mUVjKhEKkNPXpmE8DM9NjO5KiN-mJUaCXMg/exec'

// Payment
export const VENMO_HANDLE = '@Adam-Miller-23'
export const ZELLE_CONTACT = '(610) 804-9222'
export const CONTACT_PHONE = '(610) 804-9222'
export const CONTACT_EMAIL = 'hello@fielddayadventures.com'

// Pricing
export const DAY_RATE = 100
export const EXTENDED_RATE = 35

// Max kids per day. When a date reaches this, it shows as "Full".
export const CAPACITY = 40

// Separator used between dates in the Days / Extended fields (must match the Apps Script).
export const DAY_SEP = ' | '

// Two session windows (months are 0-indexed: 5 = June, 7 = August):
//   - Sat/Sun:        Jun 27 - Aug 30, 2026
//   - Mon & Fri only: Jun 29 - Aug 21, 2026
const WEEKEND_START = new Date(2026, 5, 27) // Sat, Jun 27, 2026
const WEEKEND_END = new Date(2026, 7, 30) // Sun, Aug 30, 2026
const WEEKDAY_START = new Date(2026, 5, 29) // Mon, Jun 29, 2026
const WEEKDAY_END = new Date(2026, 7, 21) // Fri, Aug 21, 2026

// Returns every available session day across both windows, in chronological order.
// Available days: Saturday, Sunday, Monday, and Friday only.
export function sessionDates() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const out = []
  const earliest = WEEKEND_START < WEEKDAY_START ? WEEKEND_START : WEEKDAY_START
  const latest = WEEKEND_END > WEEKDAY_END ? WEEKEND_END : WEEKDAY_END
  const d = new Date(earliest.getTime())
  while (d <= latest) {
    const dow = d.getDay()
    const isWeekend = (dow === 0 || dow === 6) && d >= WEEKEND_START && d <= WEEKEND_END
    const isMonOrFri = (dow === 1 || dow === 5) && d >= WEEKDAY_START && d <= WEEKDAY_END
    if (isWeekend || isMonOrFri) {
      out.push(`${days[dow]}, ${months[d.getMonth()]} ${d.getDate()}`)
    }
    d.setDate(d.getDate() + 1)
  }
  return out
}
