import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Activities from './components/Activities.jsx'
import OurSpot from './components/OurSpot.jsx'
import Pricing from './components/Pricing.jsx'
import Parties from './components/Parties.jsx'
import ParentInfo from './components/ParentInfo.jsx'
import FAQ from './components/FAQ.jsx'
import FinalCTA from './components/FinalCTA.jsx'
import Footer from './components/Footer.jsx'
import { useScrollReveal } from './hooks/useScrollReveal.js'

// All "Register" CTAs link to the on-site form at /register
export const REGISTER_URL = '/register'

export default function App() {
  useScrollReveal()
  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Activities />
      <OurSpot />
      <Pricing />
      <Parties />
      <ParentInfo />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  )
}
