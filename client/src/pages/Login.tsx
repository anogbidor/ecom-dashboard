import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}

      if (!res.ok) {
        toast.error(data.error || 'Login failed')
        setError(data.error || 'Login failed')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      toast.success('🎉 Logged in successfully!')
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      toast.error('Network error. Please try again.')
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6 border border-white/20 transition-all hover:shadow-lg'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold text-gray-800'>Welcome Back</h1>
          <p className='text-gray-600 text-sm'>Admin Dashboard Login</p>
        </div>

        {error && (
          <div className='bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center border border-red-100 animate-[fadeIn_0.3s]'>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className='space-y-4'>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-gray-700'>Email</label>
            <input
              type='email'
              placeholder='admin@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
              required
            />
          </div>

          <div className='space-y-1'>
            <label className='text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              type='password'
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
              required
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-all ${
              isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-md'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className='text-xs text-center text-gray-400 pt-4 border-t border-gray-100'>
          © {new Date().getFullYear()} E-commerce Admin
        </p>
      </div>
    </div>
  )
}

export default Login
