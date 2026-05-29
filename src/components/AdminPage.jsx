import { useState } from 'react'
import { Link } from 'react-router-dom'
import { REGISTRATION_ENDPOINT, CAPACITY, DAY_SEP, weekendDates } from '../config.js'
import { jsonp } from '../jsonp.js'

const DAYS = weekendDates()
const COLUMNS = [
  'Submitted', 'Child Name', 'Child Age', 'Parent First', 'Parent Last',
  'Email', 'Phone', 'Address', 'Days Requested', 'Extended Days', 'Total $',
  'Pay Method', 'Paid?', 'Emergency Contact', 'Allergies / Restrictions', 'Notes', 'Signature',
]

export default function AdminPage() {
  const [key, setKey] = useState(sessionStorage.getItem('bfd_admin_key') || '')
  const [rows, setRows] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | ready | error | unauthorized
  const [error, setError] = useState('')

  async function load(pwd) {
    if (!REGISTRATION_ENDPOINT) { setStatus('error'); setError('No endpoint configured.'); return }
    setStatus('loading')
    setError('')
    try {
      const res = await jsonp(REGISTRATION_ENDPOINT, { action: 'list', key: pwd })
      if (!res || res.ok === false) {
        sessionStorage.removeItem('bfd_admin_key')
        setStatus('unauthorized')
        return
      }
      sessionStorage.setItem('bfd_admin_key', pwd)
      setRows(res.registrations || [])
      setStatus('ready')
    } catch (e) {
      setStatus('error')
      setError('Could not reach the server. Try again.')
    }
  }

  function submit(e) {
    e.preventDefault()
    load(key)
  }

  // Login gate
  if (status !== 'ready') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-5">
        <form onSubmit={submit} className="w-full max-w-[380px] rounded-3xl border border-ocean/10 bg-white/70 p-8 text-center">
          <img src="/logo.png" alt="" className="mx-auto mb-4 h-20 w-20 object-contain" />
          <h1 className="font-display text-[26px] font-black text-ocean-deep">Admin</h1>
          <p className="mt-1 text-[14px] text-ink-soft">Enter the admin password to view registrations.</p>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Password"
            className="bfd-input mt-5 text-center"
            autoFocus
          />
          {status === 'unauthorized' && (
            <p className="mt-2 text-[13px] font-semibold text-sunset-deep">Wrong password — try again.</p>
          )}
          {status === 'error' && (
            <p className="mt-2 text-[13px] font-semibold text-sunset-deep">{error}</p>
          )}
          <button type="submit" disabled={status === 'loading'} className="btn-primary mt-5 w-full justify-center disabled:opacity-60">
            {status === 'loading' ? 'Loading…' : 'View registrations'}
          </button>
          <Link to="/" className="mt-4 block text-[13px] text-ink-soft hover:text-ocean-deep">← Back to site</Link>
        </form>
      </div>
    )
  }

  // Per-day tally
  const tally = {}
  DAYS.forEach((d) => (tally[d] = 0))
  rows.forEach((r) => {
    String(r['Days Requested'] || '').split(DAY_SEP).forEach((d) => {
      d = d.trim()
      if (d in tally) tally[d] += 1
    })
  })

  const paidCount = rows.filter((r) => String(r['Paid?'] || '').trim()).length
  const revenue = rows.reduce((sum, r) => sum + (Number(r['Total $']) || 0), 0)

  return (
    <div className="min-h-screen bg-cream">
      <header
        className="sticky top-0 z-50 border-b border-ink/10"
        style={{ background: 'rgba(255,248,236,0.92)', backdropFilter: 'blur(12px)' }}
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2 font-display text-[19px] font-black text-ocean-deep">
            <img src="/logo.png" alt="" className="h-9 w-9 object-contain" />
            Admin
          </div>
          <div className="flex items-center gap-4 text-[14px]">
            <button onClick={() => load(key)} className="font-medium text-ocean-deep hover:underline">Refresh</button>
            <button
              onClick={() => { sessionStorage.removeItem('bfd_admin_key'); setStatus('idle'); setRows(null); setKey('') }}
              className="font-medium text-ink-soft hover:text-ocean-deep"
            >
              Log out
            </button>
            <Link to="/" className="font-medium text-ink-soft hover:text-ocean-deep">Site →</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-5 py-8">
        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Registrations" value={rows.length} />
          <Stat label="Paid" value={`${paidCount} / ${rows.length}`} />
          <Stat label="Awaiting payment" value={rows.length - paidCount} />
          <Stat label="Expected revenue" value={`$${revenue}`} />
        </div>

        {/* Per-day capacity */}
        <div className="mb-8 rounded-2xl border border-ocean/10 bg-white/60 p-5">
          <h2 className="mb-3 font-display text-[18px] font-bold text-ocean-deep">Per-day signups (cap {CAPACITY})</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {DAYS.map((d) => {
              const n = tally[d]
              const full = n >= CAPACITY
              return (
                <div key={d} className={'flex items-center justify-between rounded-lg border px-3 py-2 text-[13px] ' + (full ? 'border-sunset bg-sunset/10' : 'border-ocean/10 bg-cream')}>
                  <span className="text-ink-soft">{d}</span>
                  <span className={'font-bold ' + (full ? 'text-sunset-deep' : 'text-ocean-deep')}>{n}/{CAPACITY}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Registrations table */}
        <h2 className="mb-3 font-display text-[18px] font-bold text-ocean-deep">All registrations</h2>
        {rows.length === 0 ? (
          <p className="text-[15px] text-ink-soft">No registrations yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-ocean/10 bg-white/60">
            <table className="w-full min-w-[1100px] border-collapse text-[13px]">
              <thead>
                <tr className="bg-ocean-deep text-cream">
                  {COLUMNS.map((c) => (
                    <th key={c} className="whitespace-nowrap px-3 py-2.5 text-left font-bold">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice().reverse().map((r, i) => {
                  const paid = String(r['Paid?'] || '').trim()
                  return (
                    <tr key={i} className={'border-t border-ocean/10 ' + (paid ? '' : 'bg-sunset/5')}>
                      {COLUMNS.map((c) => (
                        <td key={c} className="whitespace-nowrap px-3 py-2 text-ink-soft">
                          {c === 'Paid?'
                            ? (paid ? <span className="font-bold text-ocean-deep">{paid}</span> : <span className="font-semibold text-sunset-deep">— unpaid</span>)
                            : c === 'Total $'
                            ? `$${r[c] || 0}`
                            : String(r[c] ?? '')}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 text-[13px] text-ink-soft">
          To mark someone paid, open the Google Sheet and type anything in their <strong>Paid?</strong> cell (e.g. "Venmo 6/1"), then hit Refresh here.
        </p>
      </main>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-ocean/10 bg-white/60 p-4 text-center">
      <div className="font-display text-[28px] font-black leading-none text-ocean-deep">{value}</div>
      <div className="mt-1 text-[12px] uppercase tracking-wide text-ink-soft">{label}</div>
    </div>
  )
}
