# Beach Field Day — Claude Code Starter Prompt

## Project Overview

Build a marketing/registration website for **Beach Field Day**, a drop-off beach camp for kids ages 4–9 in Margate / Longport, NJ. Run by two certified Health & Physical Education teachers. Saturdays & Sundays, 9am–Noon, $80/day. Weekday sessions to be added later in summer.

**Primary audience:** Local Margate/Longport summer families (year-round residents + summer-rental families).

**Goal of the site:** Get parents to register via a Google Form. No on-site payment processing in v1.

## Tech Stack

Match the existing Mainline Web Design pattern:
- **React + Vite**
- **Tailwind CSS** for styling (use the custom CSS variables below as Tailwind theme extensions)
- **Vercel** for hosting
- **Supabase** NOT needed in v1 — registrations flow through Google Forms, no DB yet
- Single-page marketing site with anchor-link navigation

## Brand & Visual Direction

**Aesthetic:** Beach colors — sand, ocean blue, sunset orange. Warm, inviting, family-friendly. NOT the cinematic navy/gold sports-poster look — this is a kids' camp, it should feel playful and welcoming.

**Color palette (CSS variables):**
```
--sand: #F5E6C8
--sand-light: #FAF0DA
--sand-deep: #E8D2A0
--ocean: #2B6B8C
--ocean-deep: #1A4A66
--ocean-light: #6FA8C2
--sunset: #E87A4A
--sunset-deep: #C95A2E
--coral: #F4A776
--cream: #FFF8EC
--ink: #1F2D38
--ink-soft: #4A5763
```

**Typography:**
- Display / headlines: **Fraunces** (serif, expressive, used for h1-h4)
- Body: **DM Sans** (clean sans-serif)
- Both from Google Fonts

**Key visual elements that worked in the prototype:**
- Hero with animated sun (radial gradient, gentle float animation)
- Wavy sand-strip clip-path at bottom of hero
- Cards with hover lift + sunset-colored shadow
- Italic serif emphasis in headlines (e.g. "best mornings of your kid's *summer*")
- Bullet lists with sunset-colored dot bullets (with sand-colored halo)
- Scroll-reveal fade-up animations using IntersectionObserver

## Site Structure (Single Page)

1. **Sticky nav** — logo (with sun icon), nav links, primary CTA button
2. **Hero** — headline, subheadline, two CTAs (Register / See Activities), info row (when/ages/price)
3. **About / Who's Running It** — two-column layout, "Two PE teachers" credibility, dark ocean stat card with 4 stats
4. **Activities** — grid of cards (8 activities, see below). Each card: emoji icon, title, 1-sentence description
5. **Our Spot on the Beach** *(NEW — see below)* — highlight the amenities
6. **Schedule & Pricing** — centered sand-gradient pricing card, $80/day, three info chips (days, time, location)
7. **Parent Info** — 4 info blocks in 2x2 grid (Before drop-off / Drop-off & pickup / Weather / Safety)
8. **FAQ** — accordion of 8+ common questions
9. **Final CTA** — ocean-to-sunset gradient section, big "Register" button linking to Google Form
10. **Footer** — logo, contact (email + phone), copyright

## NEW SECTION: "Our Spot on the Beach"

This is a major selling point — add it between Activities and Pricing. Frame it as why this location is better than generic "we go to the beach."

Headline angle: *"More than just sand."* or *"A real home base."*

**Amenities to highlight (visual icon + short blurb each):**
- 🏀 **Basketball courts** — for shooting games, knockout, pickup hoops when it's too hot for sand
- 🌳 **Grass field next to the courts** — perfect for field-day games that don't work on sand
- ⛱️ **Gazebo for shade** — snack breaks, arts & crafts, a place to cool down out of the sun
- 🚻 **Bathroom on site** — right next to the courts, no long walks needed

Layout suggestion: 4-card grid (2x2 on mobile, 4-across on desktop) with each amenity as a card. OR a single hero image/illustration of the spot with labeled callouts.

This addresses real parent concerns (sun exposure, bathrooms, "what do you do when it's too hot") and differentiates from a generic "we'll be at the beach" pitch.

## The 8 Activity Cards

1. **🏐 Beach Sports** — Volleyball, soccer, wiffle ball, kickball, capture the flag, ultimate
2. **🏆 Field Day Games** — Relay races, tug-of-war, sack races, water balloon toss
3. **⏱️ Minute to Win It** — Fast, silly, 60-second challenges
4. **🎨 Arts & Crafts** — Beach-themed projects, shell art, tie-dye, painting (in the gazebo)
5. **🏃 Obstacle Courses** — Sand courses that test agility, balance, teamwork
6. **💦 Water Games** — Sprinklers, water balloons, soaker games (NEVER ocean)
7. **🏀 Basketball** — Shooting games, knockout, pickup on the on-site courts
8. **🍎 Daily Snack** — Healthy mid-session break in the gazebo

## Parent Info Content

**Block 1 — What to do at home:**
- Apply sunscreen before drop-off (we cannot apply on arrival)
- Have child use the bathroom before leaving
- Athletic clothing + closed-toe sneakers (no flip flops)
- Swimsuit underneath on water-game days
- Labeled water bottle — every child, every day
- Hat and a towel

**Block 2 — Drop-off & pick-up:**
- Drop-off program — parents don't need to stay
- Arrive on time, sessions begin promptly at 9am
- Pick-up at Noon, late fee after 12:15
- Only authorized adults (listed at registration) may pick up
- Text us if running late or canceling

**Block 3 — Weather policy:**
- All sessions weather permitting
- Text alert at least 2 hours before if cancelled
- Missed sessions rescheduled
- Light rain / overcast = still on

**Block 4 — Safety promises:**
- NEVER go in the ocean
- Both leads are certified PE teachers, CPR & First Aid certified
- Allergies & medical info collected at registration
- Sign-in / sign-out with ID check

## FAQ Questions

1. Do you go in the ocean? *(answer: never)*
2. What if it rains?
3. Where exactly do you meet? *(point to the basketball court / gazebo area)*
4. Can my 4-year-old handle drop-off?
5. What does my child need to bring?
6. Is lunch provided? *(no, end at noon, snack provided)*
7. How do I pay? *(Google Form, Venmo or Zelle after)*
8. Are weekday sessions coming? *(yes, later in summer)*
9. *(NEW)* Is there shade / bathrooms on site? *(yes — gazebo + on-site bathroom by the courts)*

## Final CTA → Google Form

The "Register Now" buttons should all point to a Google Form URL (placeholder for now: `#register`).

The Form (built separately in Google Forms) will collect:
- Child's name, age, grade entering Fall 2026
- Parent name(s), phone, email
- Emergency contact (different from parent)
- Authorized pickup names
- Allergies / medical conditions / medications
- Days requested (checkbox list of available dates)
- T-shirt size
- Photo/video consent checkbox
- Liability waiver acknowledgment checkbox
- "How did you hear about us"

## Out of Scope for v1

- No payment processing on site (Venmo/Zelle handled outside)
- No member login / accounts
- No Supabase / DB
- No automated calendar booking
- No live availability counter

## Build Plan / Suggested File Structure

```
/src
  /components
    Nav.jsx
    Hero.jsx
    About.jsx
    Activities.jsx
    OurSpot.jsx          ← NEW
    Pricing.jsx
    ParentInfo.jsx
    FAQ.jsx
    FinalCTA.jsx
    Footer.jsx
  /hooks
    useScrollReveal.js   ← IntersectionObserver hook
  App.jsx
  main.jsx
  index.css              ← Tailwind + CSS variables
tailwind.config.js
vite.config.js
```

## Reference

I have a working single-file HTML prototype at `/path/to/beach-field-day.html` — use it as visual reference for the design, then port to React + Tailwind. Keep the same vibe but improve where possible. The prototype is missing the new "Our Spot on the Beach" section; build that fresh based on the spec above.

## SEO Basics

- Page title: "Beach Field Day | Margate & Longport Kids' Beach Camp"
- Meta description: Drop-off beach camp for kids 4–9 in Margate & Longport, NJ. Run by certified PE teachers. Sports, games, arts & crafts. Saturdays & Sundays, 9am–Noon. $80/day.
- Open Graph image (placeholder for now)
- Local SEO keywords: Margate kids camp, Longport kids camp, Downbeach summer camp, kids beach camp NJ, drop-off beach camp

## Deploy

- GitHub repo
- Vercel project linked to repo
- Custom domain when secured (likely `beachfieldday.com` or `downbeachfieldday.com`)
