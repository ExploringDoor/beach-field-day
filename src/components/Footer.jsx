export default function Footer() {
  return (
    <footer className="bg-ocean-deep px-6 pb-8 pt-12 text-center text-sand-light">
      <div className="mx-auto max-w-[1200px]">
        <img
          src="/logo.png"
          alt="Field Day Adventures logo"
          className="mx-auto mb-4 h-28 w-28 object-contain"
        />
        <div className="mb-3 font-display text-2xl font-black text-cream">
          Field Day Adventures
        </div>
        <div className="mb-6 text-sm opacity-70">
          Longport, NJ · Mon, Fri, Sat &amp; Sun · Summer 2026
        </div>
        <div className="mb-8 flex flex-wrap justify-center gap-6 text-[15px]">
          <a href="mailto:hello@fielddayadventures.com" className="text-sand-light transition-colors hover:text-coral">
            hello@fielddayadventures.com
          </a>
          <span className="opacity-40">·</span>
          <a href="tel:6108049222" className="text-sand-light transition-colors hover:text-coral">
            (610) 804-9222
          </a>
        </div>
        <div className="border-t border-sand-light/15 pt-6 text-xs opacity-50">
          © 2026 Field Day Adventures LLC. All rights reserved. Run with love by two PE teachers.
        </div>
      </div>
    </footer>
  )
}
