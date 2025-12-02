import { useState } from 'react'
import { authService } from '../services/auth'
import { Mail, Lock } from 'lucide-react'

export function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        const { user } = await authService.signUp(email, password)
        await authService.createUserProfile(user.id, email, fullName)
      } else {
        await authService.signIn(email, password)
      }
      onLoginSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '400px',
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#333',
          fontSize: '28px',
        }}>
          Mikrotik Manager
        </h1>

        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '12px',
            borderRadius: '5px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#333',
              }}>
                الاسم الكامل
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
                placeholder="أدخل اسمك"
              />
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#333',
            }}>
              البريد الإلكتروني
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #ddd',
              borderRadius: '5px',
              paddingLeft: '10px',
            }}>
              <Mail size={18} color="#999" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: '10px',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#333',
            }}>
              كلمة المرور
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #ddd',
              borderRadius: '5px',
              paddingLeft: '10px',
            }}>
              <Lock size={18} color="#999" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: '10px',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '14px',
                }}
                placeholder="أدخل كلمة المرور"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'جاري المعالجة...' : (isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول')}
          </button>
        </form>

        <button
          onClick={() => {
            setIsSignUp(!isSignUp)
            setError('')
          }}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '15px',
            background: 'transparent',
            color: '#667eea',
            border: '2px solid #667eea',
            borderRadius: '5px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          {isSignUp ? 'لديك حساب بالفعل؟ سجل الدخول' : 'ليس لديك حساب؟ إنشاء حساب'}
        </button>
      </div>
    </div>
  )
}
