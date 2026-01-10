import { useEffect, useState } from 'react'
import LoginPage from './pages/Login'
import LandingPage from './pages/Landing'
import GalleryPage from './pages/Gallery'
import BuyCreditsPage from './pages/BuyCredits'
import FaqPage from './pages/Faq'
import RegisterPage from './pages/Register'
import OtpPage from './pages/Otp'
import DashboardPage from './pages/Dashboard'
import ProfilePage from './pages/Profile'
import ScanCardsPage from './pages/ScanCards'
import CollectionPage from './pages/Collection'
import CollectionDetailsPage from './pages/CollectionDetails'
import { isTokenExpired, refreshAuthTokens } from './api/auth'
import { ROUTES, normalizeHash } from './routes'
import './App.css'

const routes = {
  [ROUTES.landing]: LandingPage,
  [ROUTES.gallery]: GalleryPage,
  [ROUTES.buyCredits]: BuyCreditsPage,
  [ROUTES.faq]: FaqPage,
  [ROUTES.login]: LoginPage,
  [ROUTES.register]: RegisterPage,
  [ROUTES.otp]: OtpPage,
  [ROUTES.dashboard]: DashboardPage,
  [ROUTES.profile]: ProfilePage,
  [ROUTES.scan]: ScanCardsPage,
  [ROUTES.collection]: CollectionPage,
  [ROUTES.collectionDetails]: CollectionDetailsPage,
}

function App() {
  const [hash, setHash] = useState(normalizeHash(window.location.hash))

  useEffect(() => {
    const refreshIfNeeded = async () => {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        return
      }
      const accessToken = localStorage.getItem('access_token')
      if (!accessToken || isTokenExpired(accessToken)) {
        await refreshAuthTokens()
      }
    }

    if (!window.location.hash) {
      window.location.hash = ROUTES.landing
    }
    const handleChange = () => {
      setHash(normalizeHash(window.location.hash))
    }
    window.addEventListener('hashchange', handleChange)
    refreshIfNeeded()
    return () => window.removeEventListener('hashchange', handleChange)
  }, [])

  const Page = routes[hash] || LoginPage

  return <Page />
}

export default App
