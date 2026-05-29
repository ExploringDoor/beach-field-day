import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  REGISTRATION_ENDPOINT,
  VENMO_HANDLE,
  ZELLE_CONTACT,
  CONTACT_PHONE,
  DAY_RATE,
  EXTENDED_RATE,
  CAPACITY,
  DAY_SEP,
  weekendDates,
} from '../config.js'
import { jsonp } from '../jsonp.js'

const DAYS = weekendDates()

const WAIVER_TEXT = `DISCLAIMER OF LIABILITY
Field Day Adventures and its staff do not assume liability for any injuries incurred while at camp or on the way to camp. Parents or guardians should contact their own insurance carrier to obtain additional insurance for the camper, if necessary. As a condition of enrollment, the following release of liability must be agreed to by the camper's parent or guardian.

RELEASE OF LIABILITY
In consideration of the minor child/ward named in this registration being allowed to participate in the Field Day Adventures program, its related events and activities, I, the parent/guardian:

1. Acknowledge, agree, and represent that I give permission for the minor to participate in the Field Day Adventures program. The minor is physically able and mentally prepared to participate in all activities as described on the Field Day Adventures website and registration materials.

2. Affirm that the health history provided for the minor named in this registration is accurate and truthful, and that all medical problems or conditions requiring ongoing medical supervision or care have been fully noted. I give permission for this health information to be shared with the appropriate staff and outside medical personnel as necessary.

3. Understand that in the event the minor needs medical treatment and I am unable to be reached, the staff of Field Day Adventures may take reasonable action seeking appropriate care, and I specifically authorize Field Day Adventures to seek emergency medical care for the minor child as deemed necessary.

4. Grant permission for Field Day Adventures to record, print, photograph, film, and/or video the minor while attending Field Day Adventures activities. I understand this media may be used for print advertising, the Field Day Adventures website and social media accounts, and other promotional materials for Field Day Adventures.

5. On behalf of myself (as parent or guardian), hereby release, indemnify, and hold harmless Field Day Adventures, its directors, officers, employees, and volunteers (collectively "Releasees") from any and all liability, claims, and demands for personal injury, sickness, or death, as well as property damage and expenses, of any nature whatsoever which may be incurred by the undersigned and the child-participant that occur while the child is participating in activities for the above-described program.

6. Agree that in the event of any dispute pertaining to any provision of this agreement, to the services rendered by Field Day Adventures, or in any way related to attendance at a Field Day Adventures program — including any claim for personal injury or other loss, and including any claim against Field Day Adventures or any director, officer, owner, official, employee, or agent of Field Day Adventures — I hereby agree to submit to binding arbitration to resolve such disputes, by claim filed in New Jersey, to be arbitrated here or at such other venue as deemed appropriate by the arbitrator, such arbitration to proceed under the applicable Rules.

PARENT/GUARDIAN CONSENT
I am the parent or legal guardian of the registered minor and hereby give consent for my child to participate in the Field Day Adventures program. I affirm that I have the legal right to issue such consent. I further affirm that I have read this Release of Liability, fully understand its terms, and understand that I have given up substantial rights by agreeing to it and registering for a Field Day Adventures program, and that I do so freely and voluntarily without any inducement.`

const EMPTY = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  childName: '',
  childAge: '',
  emergency: '',
  allergies: '',
  notes: '',
  days: [], // selected date strings
  extendedDays: [], // subset of days marked "until 1pm"
  payment: '',
  paymentAck: false,
  waiverAgree: false,
  signature: '',
}

export default function RegisterPage() {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | done | error
  const [counts, setCounts] = useState(null) // {date: bookedCount} or null while loading
  const [total, setTotal] = useState(0)

  // Fetch current per-day booked counts so we can show "Full" dates.
  useEffect(() => {
    let alive = true
    if (!REGISTRATION_ENDPOINT) { setCounts({}); return }
    jsonp(REGISTRATION_ENDPOINT, { action: 'counts' })
      .then((res) => { if (alive) setCounts((res && res.counts) || {}) })
      .catch(() => { if (alive) setCounts({}) }) // degrade gracefully: no caps if it fails
    return () => { alive = false }
  }, [])

  // Keep the live total in sync.
  useEffect(() => {
    setTotal(form.days.length * DAY_RATE + form.extendedDays.length * EXTENDED_RATE)
  }, [form.days, form.extendedDays])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function isFull(day) {
    return counts ? (counts[day] || 0) >= CAPACITY : false
  }
  function spotsLeft(day) {
    if (!counts) return null
    return Math.max(0, CAPACITY - (counts[day] || 0))
  }

  function toggleDay(day) {
    if (isFull(day)) return
    setForm((f) => {
      const selected = f.days.includes(day)
      return {
        ...f,
        days: selected ? f.days.filter((d) => d !== day) : [...f.days, day],
        extendedDays: selected ? f.extendedDays.filter((d) => d !== day) : f.extendedDays,
      }
    })
    if (errors.days) setErrors((e) => ({ ...e, days: undefined }))
  }

  function toggleExtend(day) {
    setForm((f) => ({
      ...f,
      extendedDays: f.extendedDays.includes(day)
        ? f.extendedDays.filter((d) => d !== day)
        : [...f.extendedDays, day],
    }))
  }

  function validate() {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Required'
    if (!form.childName.trim()) e.childName = 'Required'
    if (!form.childAge) e.childAge = 'Required'
    if (!form.emergency.trim()) e.emergency = 'Required'
    if (!form.allergies.trim()) e.allergies = 'Required (write "None" if none)'
    if (form.days.length === 0) e.days = 'Pick at least one day'
    if (!form.payment) e.payment = 'Required'
    if (!form.paymentAck) e.paymentAck = 'Please acknowledge'
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
    const payload = {
      ...form,
      days: form.days.join(DAY_SEP),
      extendedDays: form.extendedDays.join(DAY_SEP),
      total,
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
    return <SuccessScreen form={form} total={total} />
  }

  // Submit stays disabled until the parent picks a payment method and checks both
  // the payment acknowledgment and the waiver agreement.
  const canSubmit = !!form.payment && form.paymentAck && form.waiverAgree

  return (
    <div className="min-h-screen bg-cream">
      <FormHeader />
      <main className="mx-auto max-w-[760px] px-5 pb-40 pt-28 sm:pt-32">
        <div className="mb-8 text-center">
          <span className="section-eyebrow">Registration</span>
          <h1 className="mx-auto text-[clamp(32px,6vw,48px)] text-ocean-deep">
            Sign up for <em className="font-display italic font-semibold text-sunset-deep">Field Day Adventures</em>
          </h1>
          <p className="mx-auto mt-3 max-w-[520px] text-[16px] text-ink-soft">
            ${DAY_RATE} per child, per day (+${EXTENDED_RATE}/day to stay until 1pm). One form per child —
            you can register another child afterward.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* PARENT */}
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
              <Field label="Phone number" required error={errors.phone} hint="Best number for day-of texts.">
                <input type="tel" className="bfd-input" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
              </Field>
            </div>
            <Field label="Address" className="mt-4">
              <input className="bfd-input" value={form.address} onChange={(e) => set('address', e.target.value)} />
            </Field>
          </Section>

          {/* CHILD */}
          <Section title="Your Child">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Child's name" required error={errors.childName}>
                <input className="bfd-input" value={form.childName} onChange={(e) => set('childName', e.target.value)} />
              </Field>
              <Field label="Child's age" required error={errors.childAge}>
                <select className="bfd-input" value={form.childAge} onChange={(e) => set('childAge', e.target.value)}>
                  <option value="">Select...</option>
                  {['4', '5', '6', '7', '8', '9'].map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          {/* EMERGENCY & HEALTH */}
          <Section title="Emergency & Health">
            <Field label="Emergency contact & number" required error={errors.emergency} hint="Someone other than the parent above.">
              <input className="bfd-input" value={form.emergency} onChange={(e) => set('emergency', e.target.value)} />
            </Field>
            <Field label="Child's allergies or restrictions?" required error={errors.allergies} hint='Write "None" if not applicable.' className="mt-4">
              <textarea rows={3} className="bfd-input" value={form.allergies} onChange={(e) => set('allergies', e.target.value)} />
            </Field>
            <Field label="Anything else we should know?" className="mt-4">
              <textarea rows={3} className="bfd-input" value={form.notes} onChange={(e) => set('notes', e.target.value)} />
            </Field>
          </Section>

          {/* DAYS */}
          <Section
            title="Pick your days"
            subtitle={`Tap a day to add it ($${DAY_RATE}). Once selected, you can add "until 1pm" for that day (+$${EXTENDED_RATE}).`}
          >
            {counts === null ? (
              <p className="text-[14px] text-ink-soft">Checking availability…</p>
            ) : (
              <div data-error={!!errors.days} className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {DAYS.map((day) => {
                  const selected = form.days.includes(day)
                  const extended = form.extendedDays.includes(day)
                  const full = isFull(day)
                  const left = spotsLeft(day)
                  return (
                    <div
                      key={day}
                      className={
                        'rounded-xl border-[1.5px] p-2.5 transition-all ' +
                        (full
                          ? 'border-ink/10 bg-ink/5 opacity-60'
                          : selected
                          ? 'border-sunset bg-sunset/10'
                          : 'border-ocean/15 bg-cream')
                      }
                    >
                      <button
                        type="button"
                        disabled={full}
                        onClick={() => toggleDay(day)}
                        className={'flex w-full items-start gap-2 text-left text-[14px] font-medium ' + (full ? 'cursor-not-allowed text-ink-soft' : 'text-ocean-deep')}
                      >
                        <span className="mt-0.5">{full ? '🔒' : selected ? '☑' : '☐'}</span>
                        <span>
                          {day}
                          <span className="mt-0.5 block text-[11px] font-normal text-ink-soft">
                            {full ? 'Full' : left != null && left <= 8 ? `${left} spot${left === 1 ? '' : 's'} left` : ''}
                          </span>
                        </span>
                      </button>
                      {selected && !full && (
                        <button
                          type="button"
                          onClick={() => toggleExtend(day)}
                          className={
                            'mt-2 w-full rounded-lg border px-2 py-1.5 text-[12px] font-semibold transition-all ' +
                            (extended
                              ? 'border-ocean bg-ocean/10 text-ocean-deep'
                              : 'border-ocean/20 bg-cream text-ink-soft hover:border-ocean-light')
                          }
                        >
                          {extended ? `✓ Until 1pm (+$${EXTENDED_RATE})` : `+ Stay until 1pm (+$${EXTENDED_RATE})`}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            {errors.days && <ErrorText>{errors.days}</ErrorText>}
          </Section>

          {/* TOTAL */}
          <div className="rounded-3xl bg-ocean-deep p-6 text-cream sm:p-8">
            <p className="font-display text-[20px] font-bold">Your total</p>
            <div className="mt-3 space-y-1 text-[15px] text-sand-light">
              <Line label={`${form.days.length} day${form.days.length === 1 ? '' : 's'} × $${DAY_RATE}`} value={form.days.length * DAY_RATE} />
              {form.extendedDays.length > 0 && (
                <Line label={`${form.extendedDays.length} extended × $${EXTENDED_RATE}`} value={form.extendedDays.length * EXTENDED_RATE} />
              )}
            </div>
            <div className="mt-3 flex items-end justify-between border-t border-cream/20 pt-3">
              <span className="text-[15px] font-medium text-sand-light">Total to send</span>
              <span className="font-display text-[34px] font-black leading-none text-coral">${total}</span>
            </div>
          </div>

          {/* PAYMENT */}
          <Section title="Payment">
            <div className="mb-4 rounded-2xl border border-sunset/30 bg-sand-light/60 p-4 text-[14px] text-ink-soft">
              <p className="font-bold text-ocean-deep">After you submit, send <strong>${total}</strong> with your child's name in the note:</p>
              <p className="mt-1">• Venmo: <strong>{VENMO_HANDLE}</strong></p>
              <p>• Zelle: <strong>{ZELLE_CONTACT}</strong></p>
              <p className="mt-2 font-semibold text-sunset-deep">
                ⚠️ Your child's spot is not confirmed until payment is received.
              </p>
            </div>
            <div data-error={!!errors.payment}>
              <p className="mb-2 text-[14px] font-bold text-ocean-deep">How will you be paying?</p>
              <div className="space-y-2">
                <Radio name="payment" label={`Venmo ${VENMO_HANDLE}`} value="Venmo" current={form.payment} onChange={(v) => set('payment', v)} />
                <Radio name="payment" label={`Zelle ${ZELLE_CONTACT}`} value="Zelle" current={form.payment} onChange={(v) => set('payment', v)} />
              </div>
              {errors.payment && <ErrorText>{errors.payment}</ErrorText>}
            </div>
            <div className="mt-4" data-error={!!errors.paymentAck}>
              <Checkbox
                checked={form.paymentAck}
                onChange={(v) => set('paymentAck', v)}
                label="I understand my child is not confirmed until payment is sent."
              />
              {errors.paymentAck && <ErrorText>{errors.paymentAck}</ErrorText>}
            </div>
          </Section>

          {/* WAIVER */}
          <Section title="Liability Waiver">
            <div className="max-h-64 overflow-y-auto whitespace-pre-line rounded-xl border border-ocean/15 bg-sand-light/40 p-4 text-[13px] leading-relaxed text-ink-soft">
              {WAIVER_TEXT}
            </div>
            <div className="mt-4" data-error={!!errors.waiverAgree}>
              <Checkbox
                checked={form.waiverAgree}
                onChange={(v) => set('waiverAgree', v)}
                label="I have read and agree to the Release of Liability above."
              />
              {errors.waiverAgree && <ErrorText>{errors.waiverAgree}</ErrorText>}
            </div>
            <Field
              label="Parent / guardian full name (type to sign)"
              required
              error={errors.signature}
              hint="Typing your name is your digital signature. Date is recorded automatically."
              className="mt-4"
            >
              <input className="bfd-input" value={form.signature} onChange={(e) => set('signature', e.target.value)} />
            </Field>
          </Section>

          {status === 'error' && (
            <p className="rounded-xl bg-sunset/15 p-4 text-center text-[15px] font-medium text-sunset-deep">
              Something went wrong sending your registration. Please try again, or text {CONTACT_PHONE}.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting' || !canSubmit}
            className="btn-primary w-full justify-center !py-5 text-[17px] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'submitting' ? 'Submitting...' : `Submit & owe $${total} →`}
          </button>
          {!canSubmit && (
            <p className="text-center text-[13px] font-medium text-sunset-deep">
              Before you can submit: choose a payment method, check the payment acknowledgment, and agree to the waiver.
            </p>
          )}
          <p className="text-center text-[13px] text-ink-soft">Questions? Text {CONTACT_PHONE}.</p>
        </form>
      </main>
    </div>
  )
}

// ── Success screen ─────────────────────────────────────────────────────────────
function SuccessScreen({ form, total }) {
  return (
    <div className="min-h-screen bg-cream">
      <FormHeader />
      <main className="mx-auto max-w-[620px] px-5 pb-24 pt-28 text-center sm:pt-32">
        <img src="/logo.png" alt="" className="mx-auto mb-6 h-28 w-28 object-contain" />
        <h1 className="text-[clamp(30px,6vw,44px)] text-ocean-deep">You're registered! 🏖️</h1>
        <p className="mx-auto mt-3 max-w-[480px] text-[16px] text-ink-soft">
          Thanks, {form.firstName}. We've got {form.childName}'s registration for{' '}
          <strong className="text-ocean-deep">{form.days.join(', ')}</strong>
          {form.extendedDays.length > 0 ? ` (until 1pm on ${form.extendedDays.join(', ')})` : ''}.
        </p>

        <div className="mx-auto mt-8 max-w-[480px] rounded-2xl border border-sunset/30 bg-sand-light/60 p-6 text-left">
          <p className="font-display text-[20px] font-bold text-ocean-deep">One more step — send ${total}</p>
          <p className="mt-2 text-[15px] text-ink-soft">
            Your child's spot is <strong>not confirmed</strong> until payment is received. Please send{' '}
            <strong>${total}</strong> with {form.childName}'s name in the note:
          </p>
          <p className="mt-3 text-[16px] text-ink">• Venmo: <strong>{VENMO_HANDLE}</strong></p>
          <p className="text-[16px] text-ink">• Zelle: <strong>{ZELLE_CONTACT}</strong></p>
        </div>

        <p className="mx-auto mt-6 max-w-[480px] text-[15px] text-ink-soft">
          A confirmation email is on its way to <strong>{form.email}</strong>. We'll text you once payment lands.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="/register" className="btn-secondary">Register another child</a>
          <Link to="/" className="btn-primary">Back to home</Link>
        </div>
      </main>
    </div>
  )
}

// ── Small building blocks ────────────────────────────────────────────────────
function FormHeader() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-ink/10"
      style={{ background: 'rgba(255,248,236,0.9)', backdropFilter: 'blur(12px)' }}
    >
      <div className="mx-auto flex max-w-[760px] items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-[19px] font-black text-ocean-deep">
          <img src="/logo.png" alt="Field Day Adventures logo" className="h-9 w-9 object-contain" />
          Field Day Adventures
        </Link>
        <Link to="/" className="text-[14px] font-medium text-ink-soft transition-colors hover:text-ocean-deep">
          ← Back
        </Link>
      </div>
    </header>
  )
}

function Section({ title, subtitle, children }) {
  return (
    <section className="rounded-3xl border border-ocean/10 bg-white/60 p-6 sm:p-8">
      <h2 className="font-display text-[22px] font-bold text-ocean-deep">{title}</h2>
      {subtitle && <p className="mt-1 text-[14px] text-ink-soft">{subtitle}</p>}
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
    <button
      type="button"
      onClick={() => onChange(value)}
      className={
        'flex w-full items-center gap-3 rounded-xl border-[1.5px] px-4 py-3 text-left text-[15px] transition-all ' +
        (active ? 'border-sunset bg-sunset/10 text-ocean-deep' : 'border-ocean/15 bg-cream text-ink-soft hover:border-ocean-light')
      }
    >
      <span className={'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ' + (active ? 'border-sunset' : 'border-ocean/30')}>
        {active && <span className="h-2.5 w-2.5 rounded-full bg-sunset" />}
      </span>
      {label}
    </button>
  )
}

function Checkbox({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={
        'flex w-full items-start gap-3 rounded-xl border-[1.5px] px-4 py-3 text-left text-[15px] transition-all ' +
        (checked ? 'border-sunset bg-sunset/10 text-ocean-deep' : 'border-ocean/15 bg-cream text-ink-soft hover:border-ocean-light')
      }
    >
      <span className={'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ' + (checked ? 'border-sunset bg-sunset text-cream' : 'border-ocean/30')}>
        {checked && '✓'}
      </span>
      {label}
    </button>
  )
}

function Line({ label, value }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>${value}</span>
    </div>
  )
}

function ErrorText({ children }) {
  return <span className="mt-1 block text-[13px] font-semibold text-sunset-deep">{children}</span>
}
