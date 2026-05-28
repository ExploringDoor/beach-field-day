import { REGISTER_URL } from '../App.jsx'

export default function FinalCTA() {
  return (
    <section
      id="register"
      className="relative overflow-hidden px-6 py-24 text-center text-cream"
      style={{
        background: 'linear-gradient(135deg, #1A4A66 0%, #2B6B8C 60%, #E87A4A 130%)',
      }}
    >
      <div
        className="pointer-events-none absolute right-[10%] top-10 h-[200px] w-[200px] opacity-40"
        style={{ background: 'radial-gradient(circle, #F4A776 0%, transparent 70%)' }}
      />
      <h2 className="relative z-10 mb-4 text-[clamp(36px,6vw,64px)] text-cream">
        Ready for the <em className="font-display italic font-semibold text-coral">best morning</em>
        <br />
        of the weekend?
      </h2>
      <p className="relative z-10 mb-9 text-[19px] opacity-90">
        Click below to register. Spots are limited per session.
      </p>
      <a
        href={REGISTER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 inline-flex items-center gap-2 rounded-full bg-cream px-10 py-5 text-[18px] font-bold text-ocean-deep transition-all hover:-translate-y-0.5 hover:bg-sand-light"
      >
        Register on Google Form →
      </a>
    </section>
  )
}
