import { useEffect } from 'react'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import Journey from '@/components/landing/Journey'
import Principles from '@/components/landing/Principles'
import Architecture from '@/components/landing/Architecture'
import Stats from '@/components/landing/Stats'
import Jornada from '@/components/landing/Jornada'
import Footer from '@/components/landing/Footer'
import { trackPageView } from '@/lib/analytics'

export default function LandingPage() {
  useEffect(() => {
    trackPageView('/')
  }, [])

  return (
    <div className="bg-[#0B0A0F] min-h-screen text-white selection:bg-violet-500/30 selection:text-white">
      <Header />
      <main role="main">
        <Hero />
        <Journey />
        <Principles />
        <Architecture />
        <Stats />
        <Jornada />
      </main>
      <Footer />
    </div>
  )
}
