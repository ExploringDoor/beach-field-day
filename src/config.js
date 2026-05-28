// ─────────────────────────────────────────────────────────────────────────────
// Central config for Beach Field Day.
// ─────────────────────────────────────────────────────────────────────────────

// Paste the Apps Script Web App URL here after you deploy scripts/registration-endpoint.gs
// (it ends in /exec). Until then, the form runs in "demo mode" and won't save.
export const REGISTRATION_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxZViIOl_tr5GmkuhT3SGk6v6EI7aHrF_9mUVjKhEKkNPXpmE8DM9NjO5KiN-mJUaCXMg/exec'

// Payment
export const VENMO_HANDLE = '@Adam-Miller-23'
export const ZELLE_CONTACT = '(610) 804-9222'
export const CONTACT_PHONE = '(610) 804-9222'
export const CONTACT_EMAIL = 'adam.miller.22@gmail.com'

// Pricing
export const DAY_RATE = 100
export const EXTENDED_RATE = 35

// Max kids per day. When a date reaches this, it shows as "Full".
export const CAPACITY = 40

// Separator used between dates in the Days / Extended fields (must match the Apps Script).
export const DAY_SEP = ' | '

// Season window for the "Which days?" checkboxes (months are 0-indexed: 5 = June)
const SEASON_START = new Date(2026, 5, 27) // Sat, Jun 27, 2026
const SEASON_END = new Date(2026, 7, 30) // Sun, Aug 30, 2026

// Returns ["Sat, Jun 27", "Sun, Jun 28", …] for every weekend day in the window.
export function weekendDates() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const out = []
  const d = new Date(SEASON_START.getTime())
  while (d <= SEASON_END) {
    const dow = d.getDay()
    if (dow === 0 || dow === 6) {
      out.push(`${days[dow]}, ${months[d.getMonth()]} ${d.getDate()}`)
    }
    d.setDate(d.getDate() + 1)
  }
  return out
}
