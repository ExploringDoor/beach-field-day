import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Activities from './components/Activities.jsx'
import OurSpot from './components/OurSpot.jsx'
import Pricing from './components/Pricing.jsx'
import ParentInfo from './components/ParentInfo.jsx'
import FAQ from './components/FAQ.jsx'
import FinalCTA from './components/FinalCTA.jsx'
import Footer from './components/Footer.jsx'
import { useScrollReveal } from './hooks/useScrollReveal.js'

export const REGISTER_URL = 'https://forms.gle/444r2yJTPbciPXXk7'

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
      <ParentInfo />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  )
}
