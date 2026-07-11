import { CONTACT_EMAIL, CONTACT_PHONE } from '../config.js'

export default function Parties() {
  const telHref = 'tel:' + CONTACT_PHONE.replace(/[^0-9]/g, '')
  return (
    <section id="parties" className="bg-cream px-6 py-24">
      <div className="container-x">
        <div
          className="relative overflow-hidden rounded-[32px] px-6 py-14 text-center sm:px-12"
          style={{ background: 'linear-gradient(135deg, #1A4A66 0%, #2B6B8C 60%, #E87A4A 130%)' }}
        >
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-[220px] w-[220px] opacity-40"
            style={{ background: 'radial-gradient(circle, #F4A776 0%, transparent 70%)' }}
          />
          <span className="relative z-10 mb-3 inline-block text-[13px] font-bold uppercase tracking-[0.1em] text-coral">
            Now booking
          </span>
          <h2 className="relative z-10 mx-auto max-w-[720px] text-[clamp(30px,5vw,48px)] text-cream">
            We host <em className="font-display italic font-semibold text-coral">birthday parties</em>! 🎉
          </h2>
          <p className="relative z-10 mx-auto mt-4 max-w-[560px] text-[17px] text-cream/90">
            Give your kid a birthday they'll never forget. We bring the sports, games, and field-day fun —
            run by two certified PE teachers. Perfect for ages 4–9, at the beach, a park, or your spot.
          </p>
          <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Birthday%20Party%20Inquiry`}
              className="inline-flex items-center gap-2 rounded-full bg-cream px-8 py-4 font-bold text-ocean-deep transition-all hover:-translate-y-0.5 hover:bg-sand-light"
            >
              Book a party →
            </a>
            <a
              href={telHref}
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-cream px-8 py-4 font-bold text-cream transition-all hover:bg-cream/10"
            >
              Text {CONTACT_PHONE}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
