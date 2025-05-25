import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../utils/logout'
import ConfirmModal from '../common/ConfirmModal'
import { FiChevronDown, FiLogOut, FiSettings, FiBell } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [showModal, setShowModal] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email?: string } | null>(
    null
  )
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLDivElement).contains(
          e.target as Node | null
        )
      ) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className='h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between ml-64 relative z-30'>
      <motion.h2
        className='text-lg font-semibold text-gray-800'
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        Welcome back{user ? `, ${user.name}` : ''}!
      </motion.h2>

      <div className='flex items-center space-x-4 relative' ref={dropdownRef}>
        <button  type='button' title='Notifications' className='relative p-2 rounded-full hover:bg-gray-100 transition-colors'>
          <FiBell className='text-gray-600 text-xl' />
          <span className='absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full'></span>
        </button>

        {user && (
          <button
            type='button'
            onClick={() => setDropdownOpen((prev) => !prev)}
            className='flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-50 transition-all'
          >
            <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white'>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className='text-left hidden md:block'>
              <span className='text-gray-800 text-sm font-medium block'>
                {user.name}
              </span>
              {user.email && (
                <span className='text-gray-500 text-xs block truncate max-w-[120px]'>
                  {user.email}
                </span>
              )}
            </div>
            <FiChevronDown
              className={`text-gray-500 transition-transform ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className='absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden'
            >
              <div className='px-4 py-3 border-b border-gray-100'>
                <p className='text-sm font-medium text-gray-900'>
                  {user?.name}
                </p>
                {user?.email && (
                  <p className='text-xs text-gray-500 truncate'>{user.email}</p>
                )}
              </div>
              <div className='py-1'>
                <button
                  type='button'
                  onClick={() => {
                    navigate('/account-settings')
                    setDropdownOpen(false)
                  }}
                  className='w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                >
                  <FiSettings className='text-gray-500' />
                  <span>Account Settings</span>
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setShowModal(true)
                    setDropdownOpen(false)
                  }}
                  className='w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors'
                >
                  <FiLogOut className='text-red-500' />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showModal && (
        <ConfirmModal
          title='Confirm Logout'
          message='Are you sure you want to log out?'
          onConfirm={logout}
          onCancel={() => setShowModal(false)}
        />
      )}
    </nav>
  )
}

export default Navbar
