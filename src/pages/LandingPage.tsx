import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import Journey from '@/components/landing/Journey'
import Principles from '@/components/landing/Principles'
import Architecture from '@/components/landing/Architecture'
import Stats from '@/components/landing/Stats'
import Jornada from '@/components/landing/Jornada'
import Footer from '@/components/landing/Footer'
import LoginModal from '@/components/landing/LoginModal'
import { trackPageView } from '@/lib/analytics'
import { useAuth } from '@/features/auth/use-auth'

export default function LandingPage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [loginOpen, setLoginOpen] = useState(() => searchParams.get('login') === 'true')

  useEffect(() => {
    trackPageView('/')
  }, [])

  const openLogin = () => setLoginOpen(true)

  const closeLogin = () => {
    setLoginOpen(false)
    // Remove ?login=true from URL without page reload
    if (searchParams.has('login')) {
      setSearchParams(
        (prev) => {
          prev.delete('login')
          return prev
        },
        { replace: true },
      )
    }
  }

  return (
    <div className="bg-[#0B0A0F] min-h-screen text-white selection:bg-violet-500/30 selection:text-white">
      <Header onLoginClick={openLogin} />
      <main role="main">
        <Hero onLoginClick={openLogin} />

        {user && (
          <>
            <Journey />
            <Principles />
            <Architecture />
            <Stats />
            <Jornada />
          </>
        )}
      </main>
      <Footer />

      <LoginModal open={loginOpen} onClose={closeLogin} />
    </div>
  )
}
