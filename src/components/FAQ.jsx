const FAQS = [
  {
    q: 'Do you go in the ocean?',
    a: 'No. Beach Field Day is a sand-and-court program only. We never take children into the ocean under any circumstances. All water games use sprinklers, water balloons, and similar gear — never the surf.',
  },
  {
    q: 'What if it rains?',
    a: 'If weather forces cancellation, parents will receive a text at least 2 hours before the session. Any missed day is rescheduled at no extra cost.',
  },
  {
    q: 'Where exactly do you meet?',
    a: 'We meet at the Longport basketball courts. From there we use the courts, the adjacent grass field, the gazebo for shade, and the beach itself. Specific meet-up details are sent to all registered families before each session.',
  },
  {
    q: 'Is there shade and a bathroom on site?',
    a: 'Yes — we have a gazebo for shade and snack breaks, plus a bathroom right next to the courts. No long walks, no parents needed for bathroom trips.',
  },
  {
    q: 'Can my 4-year-old handle drop-off?',
    a: 'Most can, especially with older siblings or friends. If your child has never done a drop-off program before, talk to us — we\'ll help you make the call. With two certified PE teachers on staff, we\'re equipped for the full age range.',
  },
  {
    q: 'What does my child need to bring?',
    a: 'A labeled water bottle, hat, towel, sunscreen (applied at home), closed-toe sneakers, and a swimsuit on water-game days. Skip the toys, electronics, and valuables.',
  },
  {
    q: 'Is lunch provided?',
    a: 'No — standard sessions end at noon, and a daily snack is provided mid-session in the gazebo. If you add the 1pm option (+$30/day), pack a small lunch so your child has something to eat during the extra hour.',
  },
  {
    q: 'How do I pay?',
    a: 'Registration is done through our Google Form. Payment is accepted via Venmo or Zelle, with details sent after registration is confirmed.',
  },
  {
    q: 'Are weekday sessions coming?',
    a: 'Yes — we\'re starting with Saturdays & Sundays and plan to add Monday–Friday sessions later in the summer based on demand.',
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="bg-cream px-6 py-24">
      <div className="container-x">
        <div className="reveal text-center">
          <span className="section-eyebrow">FAQ</span>
          <h2 className="section-title mx-auto text-center">
            Common <em>questions</em>.
          </h2>
        </div>
        <div className="mx-auto max-w-[800px]">
          {FAQS.map((item, i) => (
            <details
              key={i}
              className="reveal group border-b-[1.5px] border-ocean/[0.12] py-6"
            >
              <summary className="faq-q flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[20px] font-bold text-ocean-deep">
                {item.q}
                <span className="shrink-0 text-[28px] font-normal text-sunset transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
