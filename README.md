# Beach Field Day

Marketing + registration site for **Beach Field Day** — a drop-off beach camp for kids ages 4–9 in Margate / Longport, NJ. Saturdays & Sundays, 9am–Noon, $80/day.

## Stack

- React + Vite
- Tailwind CSS
- Deployed on Vercel

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Configuration

Set the Google Form URL in `src/App.jsx`:

```js
export const REGISTER_URL = 'https://docs.google.com/forms/...'
```

All "Register" buttons across the site link to this URL.

## Structure

```
src/
  components/
    Nav.jsx
    Hero.jsx
    About.jsx
    Activities.jsx
    OurSpot.jsx
    Pricing.jsx
    ParentInfo.jsx
    FAQ.jsx
    FinalCTA.jsx
    Footer.jsx
  hooks/
    useScrollReveal.js
  App.jsx
  main.jsx
  index.css
reference/
  beach-field-day.html               (HTML prototype)
  beach-field-day-claude-code-prompt.md  (original spec)
```

## Deployment

Push to GitHub → import in Vercel → Vercel auto-detects Vite, no extra config needed.
