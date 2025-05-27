import { useState, useRef, useEffect } from 'react'
import { FiX, FiUser, FiMail, FiLock, FiChevronDown } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

type AddUserModalProps = {
  isOpen: boolean
  onClose: () => void
}

const AddUserModal = ({ isOpen, onClose }: AddUserModalProps) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'staff',
  })
  const [loading, setLoading] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Failed to add user')
        return
      }

      toast.success('🎉 New user added successfully!')
      onClose()
      setForm({ username: '', email: '', password: '', role: 'staff' })
    } catch {
      toast.error('Server error. Try again later.')
    } finally {
      setLoading(false)
    }
  }

  // 🚀 Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed top-0 right-0 bottom-0 left-64 z-50 bg-transparent bg-opacity-30 backdrop-blur-md bg-opacity-30 flex items-center justify-center p-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
      <motion.div
            ref={modalRef}
            className='bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 sm:mx-0 relative'
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <button
              type='button'
              title='Close'
              onClick={onClose}
              className='absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors'
            >
              <FiX className='w-5 h-5' />
            </button>

            <div className='p-6'>
              <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
                Add New User
              </h2>

              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400'>
                    <FiUser className='w-5 h-5' />
                  </div>
                  <input
                    type='text'
                    name='username'
                    placeholder='Username'
                    value={form.username}
                    onChange={handleChange}
                    required
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition'
                  />
                </div>

                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400'>
                    <FiMail className='w-5 h-5' />
                  </div>
                  <input
                    type='email'
                    name='email'
                    placeholder='Email'
                    value={form.email}
                    onChange={handleChange}
                    required
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition'
                  />
                </div>

                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400'>
                    <FiLock className='w-5 h-5' />
                  </div>
                  <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition'
                  />
                </div>

                <div className='relative'>
                  <select
                    title='Role'
                    name='role'
                    value={form.role}
                    onChange={handleChange}
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition'
                  >
                    <option value='staff'>Staff</option>
                    <option value='admin'>Admin</option>
                  </select>
                  <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400'>
                    <FiChevronDown className='w-5 h-5' />
                  </div>
                </div>

                <button
                  type='submit'
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {loading ? (
                    <span className='flex items-center justify-center'>
                      <svg
                        className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
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
                      Adding User...
                    </span>
                  ) : (
                    'Add User'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AddUserModal
