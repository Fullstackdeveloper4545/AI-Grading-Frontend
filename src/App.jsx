import { useEffect, useState } from 'react'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import OtpPage from './pages/Otp'
import DashboardPage from './pages/Dashboard'
import ProfilePage from './pages/Profile'
import ScanCardsPage from './pages/ScanCards'
import CollectionPage from './pages/Collection'
import CollectionDetailsPage from './pages/CollectionDetails'
import { isTokenExpired, refreshAuthTokens } from './api/auth'
import './App.css'

const routes = {
  '#/login': LoginPage,
  '#/register': RegisterPage,
  '#/otp': OtpPage,
  '#/dashboard': DashboardPage,
  '#/profile': ProfilePage,
  '#/scan': ScanCardsPage,
  '#/collection': CollectionPage,
  '#/collection-details': CollectionDetailsPage,
}

function App() {
  const [hash, setHash] = useState(window.location.hash || '#/login')

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
      window.location.hash = '#/login'
    }
    const handleChange = () => {
      const rawHash = window.location.hash || '#/login'
      setHash(rawHash.split('?')[0])
    }
    window.addEventListener('hashchange', handleChange)
    refreshIfNeeded()
    return () => window.removeEventListener('hashchange', handleChange)
  }, [])

  const Page = routes[hash] || LoginPage

  return <Page />
}

export default App
