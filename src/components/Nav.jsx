import { REGISTER_URL } from '../App.jsx'

export default function Nav() {
  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 border-b border-ink/10"
      style={{
        background: 'rgba(255, 248, 236, 0.85)',
        WebkitBackdropFilter: 'blur(12px)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2.5 font-display text-[22px] font-black tracking-tight text-ocean-deep">
          <img
            src="/logo.png"
            alt="Beach Field Day logo"
            className="h-11 w-11 object-contain"
          />
          Beach Field Day
        </a>
        <div className="hidden gap-8 text-[15px] font-medium md:flex">
          <a href="#activities" className="text-ink-soft transition-colors hover:text-ocean-deep">Activities</a>
          <a href="#our-spot" className="text-ink-soft transition-colors hover:text-ocean-deep">Our Spot</a>
          <a href="#pricing" className="text-ink-soft transition-colors hover:text-ocean-deep">Schedule</a>
          <a href="#info" className="text-ink-soft transition-colors hover:text-ocean-deep">Parent Info</a>
          <a href="#faq" className="text-ink-soft transition-colors hover:text-ocean-deep">FAQ</a>
        </div>
        <a
          href={REGISTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-sunset px-5 py-2.5 text-sm font-bold text-cream transition-all hover:-translate-y-px hover:bg-sunset-deep"
        >
          Register
        </a>
      </div>
    </nav>
  )
}
