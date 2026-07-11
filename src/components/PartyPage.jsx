import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { REGISTRATION_ENDPOINT, CONTACT_PHONE } from '../config.js'

// ── PARTY DETAILS — edit these ───────────────────────────────────────────────
const PARTY = {
  title: "Luca's 8th Birthday Party",
  date: 'Saturday, July 18',
  time: '11:00am',
  location: 'Atlantic Ave & S Pelham Ave, Longport NJ',
  dateISO: '2026-07-18T11:00:00-04:00', // for the countdown timer
}

const PARTY_COLORS = ['#1A4A66', '#8BC53F', '#2B6B8C', '#ffffff', '#E87A4A']

function fireConfetti() {
  confetti({ particleCount: 130, spread: 95, startVelocity: 45, origin: { y: 0.6 }, colors: PARTY_COLORS })
  const end = Date.now() + 900
  ;(function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: PARTY_COLORS })
    confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: PARTY_COLORS })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

const WAIVER_TEXT = `DISCLAIMER OF LIABILITY
Field Day Adventures LLC ("Field Day Adventures") and its staff do not assume liability for any injuries incurred while at the event or on the way to the event. Parents or guardians should contact their own insurance carrier to obtain additional insurance for the child, if necessary. As a condition of participation, the following release of liability must be agreed to by the child's parent or guardian.

RELEASE OF LIABILITY
In consideration of the minor child/ward named in this form being allowed to participate in the Field Day Adventures event, its related activities, I, the parent/guardian:

1. Give permission for the minor to participate in the Field Day Adventures event. The minor is physically able and mentally prepared to participate in all activities.

2. Affirm that the health information provided for the minor named in this form is accurate and truthful, and that all medical problems or conditions have been fully noted. I give permission for this information to be shared with the appropriate staff and outside medical personnel as necessary.

3. Understand that in the event the minor needs medical treatment and I am unable to be reached, the staff of Field Day Adventures may take reasonable action seeking appropriate care, and I specifically authorize Field Day Adventures to seek emergency medical care for the minor child as deemed necessary.

4. Grant permission for Field Day Adventures to record, print, photograph, film, and/or video the minor while attending Field Day Adventures activities, and understand this media may be used for print advertising, the Field Day Adventures website and social media accounts, and other promotional materials.

5. On behalf of myself, hereby release, indemnify, and hold harmless Field Day Adventures, its directors, officers, employees, and volunteers from any and all liability, claims, and demands for personal injury, sickness, or death, as well as property damage and expenses, of any nature whatsoever which may be incurred while the child is participating in activities for this event.

PARENT/GUARDIAN CONSENT
I am the parent or legal guardian of the named minor and hereby give consent for my child to participate. I affirm that I have read this Release of Liability, fully understand its terms, and agree to it freely and voluntarily.`

const EMPTY = {
  firstName: '', lastName: '', email: '', phone: '',
  childName: '', childAge: '',
  emergency: '', allergies: '', notes: '',
  attendance: '', pickup: '',
  waiverAgree: false, signature: '',
}

export default function PartyPage() {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  // Celebrate on a successful RSVP.
  useEffect(() => {
    if (status === 'done') fireConfetti()
  }, [status])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Required'
    if (!form.childName.trim()) e.childName = 'Required'
    if (!form.childAge.trim()) e.childAge = 'Required'
    if (!form.emergency.trim()) e.emergency = 'Required'
    if (!form.attendance) e.attendance = 'Required'
    if (form.attendance === 'Dropping off' && !form.pickup.trim()) e.pickup = 'Required for drop-off'
    if (!form.waiverAgree) e.waiverAgree = 'You must agree to register'
    if (!form.signature.trim()) e.signature = 'Type your name to sign'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) {
      const first = document.querySelector('[data-error="true"]')
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setStatus('submitting')

    const noteParts = [
      `[PARTY: ${PARTY.title}]`,
      `Attendance: ${form.attendance}`,
    ]
    if (form.attendance === 'Dropping off') noteParts.push(`Authorized pickup: ${form.pickup}`)
    if (form.notes.trim()) noteParts.push(`Notes: ${form.notes.trim()}`)

    const payload = {
      type: 'party',
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      address: '',
      childName: form.childName,
      childAge: form.childAge,
      emergency: form.emergency,
      allergies: form.allergies,
      notes: noteParts.join(' | '),
      days: PARTY.title,
      extendedDays: '',
      total: 0,
      payment: 'Free party',
      signature: form.signature,
      submittedAt: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
    }

    try {
      if (REGISTRATION_ENDPOINT) {
        await fetch(REGISTRATION_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
        })
      }
      setStatus('done')
      window.scrollTo(0, 0)
    } catch (err) {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="min-h-screen bg-cream">
        <PartyHeader />
        <main className="mx-auto max-w-[560px] px-5 pb-24 pt-28 text-center sm:pt-32">
          <img src="/logo.png" alt="" className="mx-auto mb-6 h-28 w-28 object-contain" />
          <h1 className="text-[clamp(28px,6vw,42px)] text-ocean-deep">You're all set! 🎉</h1>
          <p className="mx-auto mt-3 max-w-[440px] text-[16px] text-ink-soft">
            Thanks, {form.firstName} — we've got {form.childName}'s RSVP, emergency info, and signed waiver for
            {' '}<strong className="text-ocean-deep">{PARTY.title}</strong>. A confirmation email is on its way to{' '}
            <strong>{form.email}</strong>.
          </p>
          <p className="mx-auto mt-4 text-[15px] text-ink-soft">
            Questions? Text {CONTACT_PHONE}. See you there!
          </p>
          <Link to="/" className="btn-primary mt-8 inline-flex">Back to home</Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <PartyHeader />
      <main className="mx-auto max-w-[680px] px-5 pb-28 pt-28 sm:pt-32">
        <div className="mb-8 text-center">
          <img
            src="/party-flyer-v2.jpg"
            alt={`${PARTY.title} — ${PARTY.date}, ${PARTY.time}, ${PARTY.location}`}
            className="mx-auto mb-6 w-full rounded-2xl shadow-lg"
          />
          <Countdown iso={PARTY.dateISO} />
          <p className="mx-auto max-w-[520px] text-[16px] text-ink-soft">
            Please fill this out for each child attending so we have contact info, emergency details,
            and a signed waiver on file.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-sunset/30 bg-sand-light/60 p-5">
          <p className="mb-3 font-display text-[18px] font-bold text-ocean-deep">👟 What to bring</p>
          <ul className="grid gap-2 text-[15px] font-medium text-ink-soft sm:grid-cols-3">
            <li>👟 Sneakers or sandals</li>
            <li>💧 Water bottle</li>
            <li>☀️ Sunscreen</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <Section title="Parent / Guardian">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" required error={errors.firstName}>
                <input className="bfd-input" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
              </Field>
              <Field label="Last name" required error={errors.lastName}>
                <input className="bfd-input" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
              </Field>
              <Field label="Email" required error={errors.email}>
                <input type="email" className="bfd-input" value={form.email} onChange={(e) => set('email', e.target.value)} />
              </Field>
              <Field label="Phone number" required error={errors.phone} hint="Best number to reach you day-of.">
                <input type="tel" className="bfd-input" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
              </Field>
            </div>
          </Section>

          <Section title="Child Attending">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Child's name" required error={errors.childName}>
                <input className="bfd-input" value={form.childName} onChange={(e) => set('childName', e.target.value)} />
              </Field>
              <Field label="Child's age" required error={errors.childAge}>
                <input className="bfd-input" value={form.childAge} onChange={(e) => set('childAge', e.target.value)} />
              </Field>
            </div>
            <p className="mt-3 text-[13px] text-ink-soft">Bringing more than one child? Submit this form once per child.</p>
          </Section>

          <Section title="Emergency & Health">
            <Field label="Emergency contact & number" required error={errors.emergency} hint="Someone other than the parent above.">
              <input className="bfd-input" value={form.emergency} onChange={(e) => set('emergency', e.target.value)} />
            </Field>
            <Field label="Anything we should know? (allergies, medical, etc.)" className="mt-4">
              <textarea rows={2} className="bfd-input" value={form.notes} onChange={(e) => set('notes', e.target.value)} />
            </Field>
          </Section>

          <Section title="Drop-off or staying?">
            <div data-error={!!errors.attendance}>
              <div className="space-y-2">
                <Radio label="I'm staying at the party" value="Staying" current={form.attendance} onChange={(v) => set('attendance', v)} />
                <Radio label="I'm dropping off" value="Dropping off" current={form.attendance} onChange={(v) => set('attendance', v)} />
              </div>
              {errors.attendance && <ErrorText>{errors.attendance}</ErrorText>}
            </div>
            {form.attendance === 'Dropping off' && (
              <Field label="Authorized pickup name(s)" required error={errors.pickup} hint="Who is allowed to pick up your child?" className="mt-4">
                <input className="bfd-input" value={form.pickup} onChange={(e) => set('pickup', e.target.value)} />
              </Field>
            )}
          </Section>

          <Section title="Liability Waiver">
            <div className="max-h-56 overflow-y-auto whitespace-pre-line rounded-xl border border-ocean/15 bg-sand-light/40 p-4 text-[13px] leading-relaxed text-ink-soft">
              {WAIVER_TEXT}
            </div>
            <div className="mt-4" data-error={!!errors.waiverAgree}>
              <Checkbox checked={form.waiverAgree} onChange={(v) => set('waiverAgree', v)} label="I have read and agree to the Release of Liability above." />
              {errors.waiverAgree && <ErrorText>{errors.waiverAgree}</ErrorText>}
            </div>
            <Field label="Parent / guardian full name (type to sign)" required error={errors.signature} hint="Typing your name is your digital signature." className="mt-4">
              <input className="bfd-input" value={form.signature} onChange={(e) => set('signature', e.target.value)} />
            </Field>
          </Section>

          {status === 'error' && (
            <p className="rounded-xl bg-sunset/15 p-4 text-center text-[15px] font-medium text-sunset-deep">
              Something went wrong. Please try again, or text {CONTACT_PHONE}.
            </p>
          )}

          <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full justify-center !py-5 text-[17px] disabled:opacity-60">
            {status === 'submitting' ? 'Submitting...' : 'Submit RSVP →'}
          </button>
          <p className="text-center text-[13px] text-ink-soft">Questions? Text {CONTACT_PHONE}.</p>
        </form>
      </main>
    </div>
  )
}

function Countdown({ iso }) {
  const target = new Date(iso).getTime()
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = target - now
  if (diff <= 0) {
    return (
      <div className="mb-6 rounded-2xl bg-ocean-deep px-5 py-4 text-center text-cream">
        <span className="font-display text-[22px] font-black">It's party time! ⚽🎉</span>
      </div>
    )
  }
  const days = Math.floor(diff / 86400000)
  const hrs = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  return (
    <div className="mb-6 rounded-2xl bg-ocean-deep px-5 py-4 text-center text-cream">
      <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.1em] text-sand-light">
        ⚽ Party starts in
      </div>
      <div className="flex justify-center gap-3 sm:gap-5">
        <TimeBox n={days} label="days" />
        <TimeBox n={hrs} label="hrs" />
        <TimeBox n={mins} label="min" />
        <TimeBox n={secs} label="sec" />
      </div>
    </div>
  )
}

function TimeBox({ n, label }) {
  return (
    <div className="min-w-[52px]">
      <div className="font-display text-[clamp(28px,7vw,40px)] font-black leading-none text-coral">
        {String(n).padStart(2, '0')}
      </div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-sand-light">{label}</div>
    </div>
  )
}

function PartyHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10" style={{ background: 'rgba(255,248,236,0.9)', backdropFilter: 'blur(12px)' }}>
      <div className="mx-auto flex max-w-[680px] items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-[19px] font-black text-ocean-deep">
          <img src="/logo.png" alt="Field Day Adventures logo" className="h-9 w-9 object-contain" />
          Field Day Adventures
        </Link>
        <Link to="/" className="text-[14px] font-medium text-ink-soft transition-colors hover:text-ocean-deep">← Back</Link>
      </div>
    </header>
  )
}

function Section({ title, children }) {
  return (
    <section className="rounded-3xl border border-ocean/10 bg-white/60 p-6 sm:p-8">
      <h2 className="font-display text-[22px] font-bold text-ocean-deep">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function Field({ label, required, error, hint, className = '', children }) {
  return (
    <label className={'block ' + className} data-error={!!error}>
      <span className="mb-1.5 block text-[14px] font-bold text-ocean-deep">
        {label} {required && <span className="text-sunset-deep">*</span>}
      </span>
      {hint && <span className="mb-1.5 block text-[13px] text-ink-soft">{hint}</span>}
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </label>
  )
}

function Radio({ label, value, current, onChange }) {
  const active = current === value
  return (
    <button type="button" onClick={() => onChange(value)}
      className={'flex w-full items-center gap-3 rounded-xl border-[1.5px] px-4 py-3 text-left text-[15px] transition-all ' + (active ? 'border-sunset bg-sunset/10 text-ocean-deep' : 'border-ocean/15 bg-cream text-ink-soft hover:border-ocean-light')}>
      <span className={'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ' + (active ? 'border-sunset' : 'border-ocean/30')}>
        {active && <span className="h-2.5 w-2.5 rounded-full bg-sunset" />}
      </span>
      {label}
    </button>
  )
}

function Checkbox({ checked, onChange, label }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={'flex w-full items-start gap-3 rounded-xl border-[1.5px] px-4 py-3 text-left text-[15px] transition-all ' + (checked ? 'border-sunset bg-sunset/10 text-ocean-deep' : 'border-ocean/15 bg-cream text-ink-soft hover:border-ocean-light')}>
      <span className={'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ' + (checked ? 'border-sunset bg-sunset text-cream' : 'border-ocean/30')}>
        {checked && '✓'}
      </span>
      {label}
    </button>
  )
}

function ErrorText({ children }) {
  return <span className="mt-1 block text-[13px] font-semibold text-sunset-deep">{children}</span>
}
