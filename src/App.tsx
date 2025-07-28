import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Login from './pages/Login'
import ProfilePage from './pages/Profile'

export default function App() {
  const [token, setToken] = useState<string | null>(null)
  const [route, setRoute] = useState(window.location.pathname)

  useEffect(() => {
    const saved = localStorage.getItem('access_token')
    if (saved) {
      setToken(saved)
      axios.defaults.headers.common['Authorization'] = `Bearer ${saved}`
    }
    const onPop = () => setRoute(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setRoute(path)
  }

  const handleLoginSuccess = (tok: string) => {
    setToken(tok)
    navigate('/')
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    delete axios.defaults.headers.common['Authorization']
    setToken(null)
    navigate('/login')
  }

  useEffect(() => {
    if (!token && route !== '/login') {
      navigate('/login')
    }
  }, [token, route])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      {!token ? (
        <Login onSuccess={handleLoginSuccess} />
      ) : (
        <ProfilePage onLogout={handleLogout} />
      )}
    </div>
  )
}
