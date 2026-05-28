const ACTIVITIES = [
  { icon: '🏐', title: 'Beach Sports', desc: 'Volleyball, soccer, wiffle ball, kickball, capture the flag, ultimate — all sand-friendly versions.' },
  { icon: '🏆', title: 'Field Day Games', desc: 'Relay races, tug-of-war, sack races, water balloon toss, and the classics that never get old.' },
  { icon: '⏱️', title: 'Minute to Win It', desc: 'Fast, silly, do-it-in-60-seconds challenges that get everyone laughing and competing.' },
  { icon: '🎨', title: 'Arts & Crafts', desc: 'Beach-themed projects, shell art, tie-dye, painting — in the gazebo, between active games.' },
  { icon: '🏃', title: 'Obstacle Courses', desc: 'Custom-built sand courses that test agility, balance, and teamwork. Every day a new layout.' },
  { icon: '💦', title: 'Water Games', desc: 'Sprinklers, water balloons, soaker games — cooling off without ever going in the ocean.' },
  { icon: '🏀', title: 'Basketball', desc: 'On-site courts for shooting games, knockout, and pickup hoops when it gets too hot for sand.' },
  { icon: '🍎', title: 'Daily Snack', desc: 'A healthy snack break midway through, in the gazebo — fuel for the next round of activities.' },
]

export default function Activities() {
  return (
    <section
      id="activities"
      className="px-6 py-24"
      style={{ background: 'linear-gradient(180deg, #FFF8EC 0%, #FAF0DA 100%)' }}
    >
      <div className="container-x">
        <div className="reveal">
          <span className="section-eyebrow">What they'll do</span>
          <h2 className="section-title">
            Every morning is <em>different</em>. Every kid leaves smiling.
          </h2>
          <p className="section-lede">
            We mix it up every session so kids never get bored — and so siblings or repeat campers always get something new.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIVITIES.map((a) => (
            <div
              key={a.title}
              className="reveal group relative overflow-hidden rounded-[20px] border border-ocean/10 bg-cream p-7 transition-all hover:-translate-y-1 hover:border-sunset"
              style={{ transitionProperty: 'transform, border-color, box-shadow' }}
              onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 16px 32px rgba(232, 122, 74, 0.15)')}
              onMouseOut={(e) => (e.currentTarget.style.boxShadow = '')}
            >
              <div className="mb-[18px] flex h-14 w-14 items-center justify-center rounded-[14px] bg-sand text-[28px]">
                {a.icon}
              </div>
              <h4 className="mb-2 text-[20px] text-ocean-deep">{a.title}</h4>
              <p className="text-[14px] leading-[1.5] text-ink-soft">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
