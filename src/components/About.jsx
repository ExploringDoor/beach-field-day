export default function About() {
  return (
    <section id="about" className="bg-cream px-6 py-24">
      <div className="container-x">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_1fr]">
          <div className="reveal">
            <span className="section-eyebrow">Who's running it</span>
            <h2 className="section-title">
              Two PE teachers. One <em>perfect</em> beach morning.
            </h2>
            <p className="section-lede">
              Field Day Adventures is run by certified Health &amp; Physical Education teachers with years of experience working with elementary-age kids. We bring real lesson-planning, real safety standards, and a real love for what we do — to the beach every morning all summer.
            </p>
            <p className="text-[17px] leading-relaxed text-ink-soft">
              No screens. No standing around. No ocean. Just three hours of activities designed to wear your kid out in the best possible way — so you can have your summer mornings back.
            </p>
          </div>
          <div
            className="reveal relative overflow-hidden rounded-3xl p-12 text-cream"
            style={{
              background: 'linear-gradient(135deg, #1A4A66 0%, #2B6B8C 100%)',
            }}
          >
            <div
              className="pointer-events-none absolute -right-12 -top-12 h-[200px] w-[200px] opacity-30"
              style={{ background: 'radial-gradient(circle, #E87A4A 0%, transparent 70%)' }}
            />
            <h3 className="relative z-10 mb-4 text-[28px]">Why parents trust us</h3>
            <p className="relative z-10 text-base leading-[1.7] opacity-95">
              We're the same people teaching your kids in school all year. Drop-off means drop-off — you don't need to stay. We've got it from here.
            </p>
            <div className="relative z-10 mt-8 grid grid-cols-2 gap-6">
              <Stat num="2" label="Certified PE teachers on site" />
              <Stat num="4–9" label="Age range, all welcome" />
              <Stat num="3 hrs" label="Of pure activity" />
              <Stat num="0" label="Trips in the ocean. Ever." />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ num, label }) {
  return (
    <div>
      <div className="font-display text-[40px] font-black leading-none text-coral">{num}</div>
      <div className="mt-1 text-[13px] opacity-85">{label}</div>
    </div>
  )
}
