const BLOCKS = [
  {
    title: '✓ What to do at home',
    items: [
      'Apply sunscreen before drop-off — we cannot apply sunscreen on arrival',
      'Have your child use the bathroom before leaving the house',
      'Dress in athletic clothing & closed-toe sneakers (no flip flops)',
      'Pack a swimsuit underneath for water-game days',
      'Bring a labeled water bottle — every child, every day',
      'Pack a hat and a towel',
    ],
  },
  {
    title: '✓ Drop-off & pick-up',
    items: [
      'This is a drop-off program. Parents do not need to stay on site',
      'Arrive on time so sessions can begin promptly at 9am',
      'Pick-up is at Noon (or 1pm if you added the extended-stay option). Late pick-up fee applies 15 minutes after your scheduled pick-up time',
      'Only authorized adults (listed at registration) may pick up your child',
      'Running late or can\'t make it? Text us right away',
    ],
  },
  {
    title: '✓ Weather policy',
    items: [
      'All sessions are weather permitting',
      'In case of inclement weather, parents receive a text at least 2 hours before session',
      'Any missed session due to weather will be rescheduled',
      'Light rain or overcast days = we still play. We\'ll let you know if it\'s a no-go',
    ],
  },
  {
    title: '✓ Safety promises',
    items: [
      'We never go in the ocean. Ever. All activities stay on the sand or court',
      'Both lead staff are certified Health & PE teachers, CPR & First Aid certified',
      'Allergy and medical info is collected at registration and reviewed daily',
      'Sign-in / sign-out procedure with ID check for every drop-off',
    ],
  },
  {
    title: '✓ Cancellation & refunds',
    items: [
      'Cancel 7+ days before a session for a full refund',
      'Cancel 2–6 days before for a credit toward any other day this summer',
      'Within 48 hours or no-show: non-refundable (the spot was held)',
      'Sick child? Let us know before the session and we\'ll credit you toward another day',
      'If we cancel for weather, the session is rescheduled at no cost',
    ],
  },
]

export default function ParentInfo() {
  return (
    <section
      id="info"
      className="px-6 py-24"
      style={{ background: 'linear-gradient(180deg, #FAF0DA 0%, #FFF8EC 100%)' }}
    >
      <div className="container-x">
        <div className="reveal">
          <span className="section-eyebrow">Before you drop off</span>
          <h2 className="section-title">
            Everything parents need to <em>know</em>.
          </h2>
          <p className="section-lede">
            Read these carefully before your child's first session. A little prep at home makes for a great morning at the beach.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {BLOCKS.map((b) => (
            <div
              key={b.title}
              className="reveal rounded-[20px] border border-ocean/10 bg-cream p-8"
            >
              <h4 className="mb-[18px] flex items-center gap-2.5 text-[22px] text-ocean-deep">
                {b.title}
              </h4>
              <ul className="list-none p-0">
                {b.items.map((item, i) => (
                  <li
                    key={i}
                    className="relative border-b border-ink/[0.06] py-2.5 pl-7 text-[15px] leading-[1.5] text-ink-soft last:border-b-0"
                  >
                    <span
                      className="absolute left-0 top-[18px] h-[14px] w-[14px] rounded-full bg-sunset"
                      style={{ boxShadow: '0 0 0 3px #FAF0DA' }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
