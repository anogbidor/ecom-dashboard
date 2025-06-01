import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
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
      <div className='bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6 border border-white/20 transition-all hover:shadow-lg hover:-translate-y-1'>
        <div className='text-center space-y-2'>
          {/* Enhanced logo with bounce animation - larger icon in same circle */}
          <div className='animate-[bounce_1s_ease-in-out_infinite] mx-auto mb-4 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md p-1'>
            <img
              src='/shoppora-icon.png'
              alt='Shoppora Logo'
              className='h-16 w-auto object-contain' // Larger icon with proper containment
            />
          </div>

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
            <label className='text-sm font-medium text-gray-700'>
              Username or Email
            </label>
            <input
              type='text'
              placeholder='Enter your username or email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition hover:border-gray-300'
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
              className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition hover:border-gray-300'
              required
            />
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                id='remember-me'
                name='remember-me'
                type='checkbox'
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className='h-4 w-4 bg-teal-600 text-teal-600 focus:ring-teal-500 border-gray-300 rounded '
              />
              <label
                htmlFor='remember-me'
                className='ml-2 block text-sm text-gray-700'
              >
                Remember me
              </label>
            </div>
            <a
              href='/forgot-password'
              className='text-sm text-teal-600 hover:underline hover:text-teal-700 transition-colors'
            >
              Forgot password?
            </a>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className={`w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg transition-all flex items-center justify-center ${
              isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-md'
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <p className='text-xs text-center text-gray-400 pt-4 border-t border-gray-100'>
          © {new Date().getFullYear()} E-commerce Admin •{' '}
          <a href='#' className='hover:underline'>
            Terms
          </a>{' '}
          •{' '}
          <a href='#' className='hover:underline'>
            Privacy
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
