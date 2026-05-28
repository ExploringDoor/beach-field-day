import { REGISTER_URL } from '../App.jsx'

export default function Hero() {
  return (
    <section
      className="relative min-h-screen overflow-hidden px-6 pb-20 pt-[140px]"
      style={{
        background: 'linear-gradient(180deg, #FFE9C7 0%, #FAD9A8 35%, #F5C390 65%, #E87A4A 100%)',
      }}
    >
      <img
        src="/logo.png"
        alt="Beach Field Day logo"
        className="absolute right-4 top-24 h-[300px] w-[300px] animate-float object-contain drop-shadow-xl sm:right-12 sm:h-[360px] sm:w-[360px]"
      />
      <div
        className="absolute bottom-0 left-0 h-[120px] w-full"
        style={{
          background:
            'radial-gradient(ellipse at 20% 100%, rgba(43,107,140,0.25) 0%, transparent 50%), radial-gradient(ellipse at 70% 100%, rgba(26,74,102,0.2) 0%, transparent 50%)',
        }}
      />
      <div className="sand-strip absolute bottom-0 left-0 h-[50px] w-full bg-sand" />

      <div className="relative z-10 mx-auto max-w-[1200px]">
        <span
          className="mb-6 inline-block rounded-full border border-ocean/15 px-4 py-2 text-[13px] font-bold uppercase tracking-[0.06em] text-ocean-deep"
          style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}
        >
          ★ Longport, NJ ★ Summer 2026
        </span>
        <h1 className="mb-5 max-w-[900px] text-[clamp(48px,9vw,112px)] text-ocean-deep">
          The best mornings of your kid's <em className="font-display italic font-semibold text-sunset-deep">summer</em>.
        </h1>
        <p className="mb-9 max-w-[580px] text-[clamp(18px,2.2vw,22px)] font-medium text-ink">
          A drop-off beach camp for ages 4–9, run by two certified PE teachers. Sports, games, arts &amp; crafts, water games, and full-on field-day energy — on the sand, on the basketball courts, and on the field.
        </p>
        <div className="mb-12 flex flex-wrap gap-4">
          <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">Register Your Child →</a>
          <a href="#activities" className="btn-secondary">See What We Do</a>
        </div>
        <div className="flex max-w-[700px] flex-wrap gap-8 border-t border-ink/15 pt-8">
          <HeroInfo label="When" value="Sat & Sun · 9–Noon" />
          <HeroInfo label="Ages" value="4 to 9" />
          <HeroInfo label="Price" value="$80 / day" />
        </div>
      </div>
    </section>
  )
}

function HeroInfo({ label, value }) {
  return (
    <div>
      <div className="mb-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-ocean-deep">
        {label}
      </div>
      <div className="font-display text-[20px] font-bold text-ink">{value}</div>
    </div>
  )
}
