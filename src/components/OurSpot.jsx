const AMENITIES = [
  {
    icon: '🏀',
    title: 'Basketball courts',
    desc: 'For shooting games, knockout, and pickup hoops when it gets too hot for sand.',
  },
  {
    icon: '🌳',
    title: 'Grass field next door',
    desc: 'Right next to the courts — perfect for field-day games that don\'t work on sand.',
  },
  {
    icon: '⛱️',
    title: 'Gazebo for shade',
    desc: 'Snack breaks, arts & crafts, and a place to cool down out of the sun.',
  },
  {
    icon: '🚻',
    title: 'Bathroom on site',
    desc: 'Right next to the courts — no long walks, no waiting in line at the beach.',
  },
]

export default function OurSpot() {
  return (
    <section id="our-spot" className="bg-cream px-6 py-24">
      <div className="container-x">
        <div className="reveal text-center">
          <span className="section-eyebrow">Our spot on the beach</span>
          <h2 className="section-title mx-auto text-center">
            More than just <em>sand</em>.
          </h2>
          <p className="section-lede mx-auto text-center">
            We're not just a generic "we'll be at the beach" program. Our home base has courts, grass, shade, and a bathroom — everything we need to run a real day of activities, rain or shine, hot or cool.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AMENITIES.map((a) => (
            <div
              key={a.title}
              className="reveal relative overflow-hidden rounded-[20px] border border-ocean/10 p-7 transition-all hover:-translate-y-1 hover:border-ocean-light"
              style={{
                background: 'linear-gradient(180deg, #FAF0DA 0%, #FFF8EC 100%)',
              }}
              onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 16px 32px rgba(43, 107, 140, 0.15)')}
              onMouseOut={(e) => (e.currentTarget.style.boxShadow = '')}
            >
              <div
                className="mb-[18px] flex h-14 w-14 items-center justify-center rounded-[14px] text-[28px]"
                style={{ background: 'rgba(43, 107, 140, 0.12)' }}
              >
                {a.icon}
              </div>
              <h4 className="mb-2 text-[20px] text-ocean-deep">{a.title}</h4>
              <p className="text-[14px] leading-[1.5] text-ink-soft">{a.desc}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-[640px] text-center text-[15px] italic text-ink-soft">
          Sun too strong? We move to the gazebo. Sand too hot? We hit the courts or grass. We've got real options — not just a towel and a prayer.
        </p>
      </div>
    </section>
  )
}
