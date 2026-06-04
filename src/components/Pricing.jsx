import { Link } from 'react-router-dom'
import { REGISTER_URL } from '../App.jsx'

export default function Pricing() {
  return (
    <section id="pricing" className="bg-cream px-6 py-24">
      <div className="container-x">
        <div className="reveal text-center">
          <span className="section-eyebrow">Schedule &amp; pricing</span>
          <h2 className="section-title mx-auto text-center">
            Simple. <em>Flexible.</em> No commitment.
          </h2>
          <p className="section-lede mx-auto text-center">
            Sign up for any day. Saturdays &amp; Sundays run June 27 – August 30, and Mondays &amp; Fridays run June 29 – August 21. All sessions 9am – Noon.
          </p>
        </div>
        <div
          className="reveal relative mx-auto max-w-[640px] overflow-hidden rounded-[32px] border-[1.5px] border-sand-deep p-14 text-center"
          style={{ background: 'linear-gradient(135deg, #FAF0DA 0%, #F5E6C8 100%)' }}
        >
          <div
            className="pointer-events-none absolute -left-10 -top-10 h-[160px] w-[160px] rounded-full opacity-15"
            style={{ background: '#E87A4A' }}
          />
          <div
            className="pointer-events-none absolute -bottom-16 -right-16 h-[200px] w-[200px] rounded-full opacity-[0.12]"
            style={{ background: '#2B6B8C' }}
          />
          <span className="section-eyebrow">Per child, per day</span>
          <div className="relative z-10 my-2 font-display text-[88px] font-black leading-none text-ocean-deep">
            $100
          </div>
          <div className="relative z-10 mb-8 text-[18px] text-ink-soft">
            Sign up for one day or the whole summer.
          </div>
          <div className="relative z-10 my-8 grid gap-4 sm:grid-cols-3">
            <Chip top="Days" bottom="Mon/Fri/Sat/Sun" />
            <Chip top="Time" bottom="9am – Noon" />
            <Chip top="Location" bottom="Longport, NJ" />
          </div>
          <div className="relative z-10 mb-8 rounded-2xl border border-ocean/20 bg-cream/70 p-5 text-left">
            <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-ocean">
              Multi-day discount
            </div>
            <div className="font-display text-[18px] font-bold text-ocean-deep">
              5+ days → <span className="text-ocean">$90/day</span> · 10+ days → <span className="text-ocean">$85/day</span>
            </div>
            <p className="mt-1 text-[14px] text-ink-soft">The more days you book, the more you save.</p>
          </div>
          <div
            className="relative z-10 mb-8 rounded-2xl border border-sunset/30 bg-cream/70 p-5 text-left"
          >
            <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-sunset-deep">
              Optional add-on
            </div>
            <div className="font-display text-[18px] font-bold text-ocean-deep">
              Stay until 1pm — <span className="text-sunset-deep">+$35/day</span>
            </div>
            <p className="mt-1 text-[14px] text-ink-soft">
              Need a longer morning? Add an extra hour at registration and we'll keep the games going until 1pm.
            </p>
          </div>
          <Link to={REGISTER_URL} className="btn-primary relative z-10">Register Now →</Link>
        </div>
      </div>
    </section>
  )
}

function Chip({ top, bottom }) {
  return (
    <div
      className="rounded-[14px] border border-ocean/10 px-3 py-4"
      style={{ background: 'rgba(255, 248, 236, 0.7)' }}
    >
      <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-sunset-deep">
        {top}
      </div>
      <div className="font-display text-base font-bold text-ocean-deep">{bottom}</div>
    </div>
  )
}
