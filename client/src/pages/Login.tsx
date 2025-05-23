import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Network error. Please try again.')
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4'>
      <div className='bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-md space-y-6 border border-white/40'>
        <h2 className='text-2xl font-bold text-center text-gray-800'>
          E-commerce Admin Login
        </h2>

        {error && (
          <div className='bg-red-100 text-red-700 text-sm p-2 rounded text-center animate-pulse'>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <input
              title='Email'
              type='email'
              placeholder='admin@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/70'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <input
              title='Password'
              type='password'
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/70'
              required
            />
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition text-sm font-medium shadow-sm'
          >
            Log In
          </button>
        </form>

        <p className='text-xs text-center text-gray-500'>
          © {new Date().getFullYear()} E-commerce Admin Panel
        </p>
      </div>
    </div>
  )
}

export default Login
