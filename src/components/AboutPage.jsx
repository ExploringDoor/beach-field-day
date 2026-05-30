import { Link } from 'react-router-dom'
import { REGISTER_URL } from '../App.jsx'
import { CONTACT_EMAIL } from '../config.js'
import Footer from './Footer.jsx'

// ── EDIT YOUR TEAM HERE ──────────────────────────────────────────────────────
// Drop headshots into /public (e.g. public/coach-adam.jpg) and set `photo` below.
// Leave photo as '' to show initials instead.
const TEAM = [
  {
    name: 'Adam Miller', // <- confirm your name
    role: 'Co-Founder & Lead Coach',
    photo: '', // e.g. '/coach-adam.jpg'
    creds: ['Certified Health & PE Teacher', 'CPR & First Aid Certified'],
    bio: 'Adam is a certified Health & Physical Education teacher who spends the school year doing exactly what he loves — getting kids moving, laughing, and trying new things. He started Field Day Adventures to bring that same energy to summer mornings on the beach: no screens, no standing around, just games, sports, and the kind of all-out fun that sends kids home happily worn out. He runs every session with a teacher\'s eye for safety and a coach\'s love for the game.',
  },
  {
    name: 'Martin Sullivan',
    role: 'Lead Coach',
    photo: '', // e.g. '/coach-martin.jpg'
    creds: ['M.Ed. Health & Physical Education', '10+ Years Teaching K–8', 'School Athletic Director', 'CPR & First Aid Certified'],
    bio: 'Martin holds a Master\'s degree in Health & Physical Education and has been teaching K–8 for over a decade. As his school\'s Athletic Director, he coaches football, basketball, and volleyball — and he brings that same energy, structure, and team spirit to the beach every session. Most importantly, Martin\'s a dad to a little girl, so he knows exactly what parents want: a safe, active, genuinely fun morning where every kid feels included and leaves smiling.',
  },
]

function initials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Simple page header with back-to-home */}
      <header
        className="fixed inset-x-0 top-0 z-50 border-b border-ink/10"
        style={{ background: 'rgba(255,248,236,0.9)', backdropFilter: 'blur(12px)' }}
      >
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-[19px] font-black text-ocean-deep">
            <img src="/logo.png" alt="Field Day Adventures logo" className="h-9 w-9 object-contain" />
            Field Day Adventures
          </Link>
          <div className="flex items-center gap-4 text-[14px] font-medium">
            <Link to="/" className="text-ink-soft transition-colors hover:text-ocean-deep">Home</Link>
            <Link to={REGISTER_URL} className="rounded-full bg-sunset px-4 py-2 font-bold text-cream transition-all hover:-translate-y-px hover:bg-sunset-deep">
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="px-6 pb-16 pt-32 text-center"
        style={{ background: 'linear-gradient(180deg, #FFE9C7 0%, #FFF8EC 100%)' }}
      >
        <span className="section-eyebrow">Meet the team</span>
        <h1 className="mx-auto max-w-[800px] text-[clamp(34px,6vw,56px)] text-ocean-deep">
          The <em className="font-display italic font-semibold text-sunset-deep">certified teachers</em> behind every morning
        </h1>
        <p className="mx-auto mt-4 max-w-[600px] text-[17px] text-ink-soft">
          Field Day Adventures is run by certified Health &amp; Physical Education teachers who do this for a living — real
          experience with elementary-age kids, real safety standards, and a real love for keeping kids active.
        </p>
      </section>

      {/* Team cards */}
      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-[900px] gap-8 sm:grid-cols-2">
          {TEAM.map((m) => (
            <div key={m.name} className="rounded-3xl border border-ocean/10 bg-white/60 p-7 text-center">
              {m.photo ? (
                <img src={m.photo} alt={m.name} className="mx-auto mb-5 h-40 w-40 rounded-full object-cover" />
              ) : (
                <div className="mx-auto mb-5 flex h-40 w-40 items-center justify-center rounded-full bg-ocean-deep font-display text-[48px] font-black text-cream">
                  {initials(m.name)}
                </div>
              )}
              <h2 className="font-display text-[26px] font-bold text-ocean-deep">{m.name}</h2>
              <p className="mt-1 text-[15px] font-semibold text-sunset-deep">{m.role}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {m.creds.map((c) => (
                  <span key={c} className="rounded-full bg-sand-light px-3 py-1 text-[12px] font-bold text-ocean-deep">
                    {c}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust band */}
      <section className="bg-cream px-6 pb-20">
        <div className="mx-auto max-w-[760px] rounded-3xl bg-ocean-deep p-10 text-center text-cream">
          <h3 className="font-display text-[26px] font-bold">Why parents trust us</h3>
          <p className="mx-auto mt-3 max-w-[560px] text-[16px] opacity-90">
            We're the same kind of people teaching your kids in school all year — and we run our mornings with the same
            care. Drop-off means drop-off; we've got it from here.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to={REGISTER_URL} className="btn-primary !bg-cream !text-ocean-deep">Register your child →</Link>
            <a href={`mailto:${CONTACT_EMAIL}`} className="btn-secondary !border-cream !text-cream">Email us</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
