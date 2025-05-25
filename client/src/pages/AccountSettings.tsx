import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import {
  FiUser,
  FiLock,
  FiCheck,
  FiLoader,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi'

const AccountSettings = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [username, setUsername] = useState(user.name || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loadingUsername, setLoadingUsername] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleUsernameUpdate = async () => {
    if (!username.trim()) return toast.error('Username cannot be empty')
    setLoadingUsername(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/auth/update-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      })

      const data = await res.json()

      if (!res.ok) return toast.error(data.error || 'Update failed')

      localStorage.setItem('user', JSON.stringify({ ...user, name: username }))
      toast.success('✅ Username updated successfully!')
    } catch {
      toast.error('Server error. Try again.')
    } finally {
      setLoadingUsername(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (!currentPassword) return toast.error('Current password is required')
    if (!newPassword || newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters')
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords don't match")
    }

    setLoadingPassword(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) return toast.error(data.error || 'Password update failed')

      toast.success('🔐 Password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      toast.error('Server error. Try again.')
    } finally {
      setLoadingPassword(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto'>
        <Link
          to='/dashboard'
          className='inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6'
        >
          <FiArrowLeft className='mr-2' />
          <span className='font-medium'>Back to Dashboard</span>
        </Link>

        <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white'>
            <div className='flex items-center'>
              <div className='w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold mr-4 border-2 border-white/30'>
                {user.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <h2 className='text-2xl font-bold'>Account Settings</h2>
                <p className='text-blue-100'>
                  {user.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>

          <div className='p-6 md:p-8 space-y-8'>
            <div className='space-y-6'>
              <div className='flex items-center'>
                <div className='p-2 rounded-full bg-blue-100 text-blue-600 mr-3'>
                  <FiUser className='w-5 h-5' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800'>
                  Username
                </h3>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Change your username
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
                      <FiUser />
                    </div>
                    <input
                      type='text'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                      placeholder='Enter new username'
                    />
                  </div>
                </div>

                <button
                  onClick={handleUsernameUpdate}
                  disabled={loadingUsername || username === user.name}
                  className={`w-full flex justify-center items-center py-3 px-4 rounded-lg transition-all ${
                    loadingUsername || username === user.name
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
                  }`}
                >
                  {loadingUsername ? (
                    <>
                      <FiLoader className='animate-spin mr-2' />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiCheck className='mr-2' />
                      {username === user.name
                        ? 'Current Username'
                        : 'Update Username'}
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className='space-y-6'>
              <div className='flex items-center'>
                <div className='p-2 rounded-full bg-green-100 text-green-600 mr-3'>
                  <FiLock className='w-5 h-5' />
                </div>
                <h3 className='text-lg font-semibold text-gray-800'>
                  Password
                </h3>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Current Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className='block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition'
                    placeholder='Enter current password'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    New Password
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
                      <FiLock />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className='block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition'
                      placeholder='Enter new password'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Confirm Password
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
                      <FiLock />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className='block w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition'
                      placeholder='Confirm new password'
                    />
                  </div>
                </div>

                <div className='flex items-center'>
                  <input
                    id='show-passwords'
                    type='checkbox'
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
                  />
                  <label
                    htmlFor='show-passwords'
                    className='ml-2 block text-sm text-gray-700'
                  >
                    Show passwords
                  </label>
                </div>

                <button
                  onClick={handlePasswordUpdate}
                  disabled={
                    loadingPassword ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  className={`w-full flex justify-center items-center py-3 px-4 rounded-lg transition-all ${
                    loadingPassword ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-md'
                  }`}
                >
                  {loadingPassword ? (
                    <>
                      <FiLoader className='animate-spin mr-2' />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiCheck className='mr-2' />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings
