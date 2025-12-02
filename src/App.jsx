import { useState, useEffect } from 'react'
import { authService } from './services/auth'
import { Login } from './components/Login'
import { Dashboard } from './components/Dashboard'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (err) {
      console.error('Auth error:', err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSuccess = () => {
    checkAuthStatus()
  }

  const handleLogout = async () => {
    try {
      await authService.signOut()
      setUser(null)
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '20px',
      }}>
        جاري التحميل...
      </div>
    )
  }

  return user ? (
    <Dashboard user={user} onLogout={handleLogout} />
  ) : (
    <Login onLoginSuccess={handleLoginSuccess} />
  )
}

export default App
