import { useEffect, useState } from 'react'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import OtpPage from './pages/Otp'
import DashboardPage from './pages/Dashboard'
import './App.css'

const routes = {
  '#/login': LoginPage,
  '#/register': RegisterPage,
  '#/otp': OtpPage,
  '#/dashboard': DashboardPage,
}

function App() {
  const [hash, setHash] = useState(window.location.hash || '#/login')

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '#/login'
    }
    const handleChange = () => setHash(window.location.hash || '#/login')
    window.addEventListener('hashchange', handleChange)
    return () => window.removeEventListener('hashchange', handleChange)
  }, [])

  const Page = routes[hash] || LoginPage

  return <Page />
}

export default App
