import { useEffect } from 'react'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import Segments from '@/components/landing/Segments'
import Benefits from '@/components/landing/Benefits'
import Testimonials from '@/components/landing/Testimonials'
import Plans from '@/components/landing/Plans'
import FAQ from '@/components/landing/FAQ'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'
import { trackPageView } from '@/lib/analytics'

export default function LandingPage() {
  useEffect(() => {
    trackPageView('/')
  }, [])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Segments />
        <Benefits />
        <Testimonials />
        <Plans />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
