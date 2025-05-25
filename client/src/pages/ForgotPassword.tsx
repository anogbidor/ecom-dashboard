import { useState } from 'react'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Error sending reset token')
      return
    }

    setMessage('Reset link sent (check console for now)')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6 border border-white/20 transition-all hover:shadow-lg hover:-translate-y-1'>
        <div className='text-center space-y-2'>
          <div className='animate-[pulse_2s_ease-in-out_infinite]'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-12 w-12 mx-auto text-blue-600'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={1.5}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-gray-800'>
            Reset Your Password
          </h2>
          <p className='text-gray-600 text-sm'>
            Enter your email to receive a password reset link
          </p>
        </div>

        {message && (
          <div className='bg-green-50 text-green-600 text-sm p-3 rounded-lg text-center border border-green-100 animate-[fadeIn_0.3s]'>
            {message}
          </div>
        )}

        {error && (
          <div className='bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center border border-red-100 animate-[fadeIn_0.3s]'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-gray-700'>
              Email Address
            </label>
            <input
              type='email'
              placeholder='your@email.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition hover:border-gray-300'
            />
          </div>

          <button
            type='submit'
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-all hover:shadow-md flex items-center justify-center gap-2`}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
              />
            </svg>
            Send Reset Link
          </button>
        </form>

        <p className='text-sm text-center text-gray-500'>
          Remember your password?{' '}
          <a
            href='/login'
            className='text-blue-600 hover:underline hover:text-blue-700 transition-colors'
          >
            Sign in
          </a>
        </p>

        <p className='text-xs text-center text-gray-400 pt-4 border-t border-gray-100'>
          © {new Date().getFullYear()} E-commerce Admin •{' '}
          <a href='#' className='hover:underline'>
            Security
          </a>{' '}
          •{' '}
          <a href='#' className='hover:underline'>
            Help
          </a>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
