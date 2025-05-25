import { useEffect, useState, useRef, useContext, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../utils/logout'
import ConfirmModal from '../common/ConfirmModal'
import {
  FiChevronDown,
  FiLogOut,
  FiSettings,
  FiBell,
  FiCheckCircle,
  FiX,
  FiRefreshCw,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { NotificationContext } from '../../context/NotificationContext'
import type { Notification } from '../../types/Notification'

const Navbar = () => {
  const [showModal, setShowModal] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [loadingNotifs, setLoadingNotifs] = useState(false)
  const [user, setUser] = useState<{ name: string; email?: string } | null>(
    null
  )
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const context = useContext(NotificationContext)
  const notifications = context?.notifications || []
  const setNotifications = context?.setNotifications

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const fetchNotifications = useCallback(async () => {
    if (!setNotifications) return
    try {
      setLoadingNotifs(true)
      const token = localStorage.getItem('token')
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setNotifications(
        data.map((n: Notification) => ({ ...n, is_read: Boolean(n.is_read) }))
      )
    } catch {
      console.error('Failed to load notifications')
    } finally {
      setLoadingNotifs(false)
    }
  }, [setNotifications])

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) setUser(JSON.parse(storedUser))

    fetchNotifications()

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
        setNotifOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [fetchNotifications])

  const markAsRead = async (id: number) => {
    if (!setNotifications) return
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      )
    } catch {
      console.error('Failed to mark as read')
    }
  }

  const markAllAsRead = async () => {
    if (!setNotifications) return
    try {
      const token = localStorage.getItem('token')
      await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    } catch {
      console.error('Failed to mark all as read')
    }
  }

  if (!context) return null

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
        <button
          title='Notifications'
          type='button'
          onClick={() => setNotifOpen((prev) => !prev)}
          className={`relative p-2 rounded-full transition-colors ${
            notifOpen ? 'bg-gray-100' : 'hover:bg-gray-100'
          }`}
        >
          <FiBell className='text-gray-600 text-xl' />
          {unreadCount > 0 && (
            <span className='absolute top-1.5 right-1.5 w-4 h-4 text-[10px] flex items-center justify-center font-semibold bg-red-500 text-white rounded-full'>
              {unreadCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className='absolute right-16 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-20 max-h-[70vh] overflow-hidden flex flex-col'
            >
              <div className='p-3 border-b flex justify-between items-center bg-gray-50'>
                <div className='font-semibold text-gray-800'>Notifications</div>
                <div className='flex space-x-2'>
                  <button
                    onClick={fetchNotifications}
                    disabled={loadingNotifs}
                    className='p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-200'
                    title='Refresh'
                  >
                    <FiRefreshCw
                      className={`w-4 h-4 ${
                        loadingNotifs ? 'animate-spin' : ''
                      }`}
                    />
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className='p-1 text-blue-500 hover:text-blue-700 rounded hover:bg-blue-50 text-xs'
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    type='button'
                    title='Close'
                    onClick={() => setNotifOpen(false)}
                    className='p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-200'
                  >
                    <FiX className='w-4 h-4' />
                  </button>
                </div>
              </div>

              <div className='overflow-y-auto flex-1'>
                {loadingNotifs ? (
                  <div className='p-4 flex justify-center'>
                    <FiRefreshCw className='animate-spin text-gray-400' />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className='p-4 text-center text-gray-500 text-sm'>
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 text-sm border-b flex items-start gap-3 hover:bg-gray-50 ${
                        n.is_read ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex-shrink-0 ${
                          n.is_read ? 'text-gray-300' : 'text-green-500'
                        }`}
                      >
                        <FiCheckCircle />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p
                          className={`truncate ${
                            n.is_read ? 'text-gray-600' : 'font-medium'
                          }`}
                        >
                          {n.message}
                        </p>
                        <div className='flex justify-between items-center mt-1'>
                          <span className='text-xs text-gray-400'>
                            {new Date(n.created_at).toLocaleTimeString()}
                          </span>
                          {!n.is_read && (
                            <button
                              title='Mark as read'
                              type='button'
                              onClick={() => markAsRead(n.id)}
                              className='text-xs text-blue-500 hover:text-blue-700 hover:underline'
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile */}
        {user && (
          <button
            type='button'
            onClick={() => setDropdownOpen((prev) => !prev)}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${
              dropdownOpen ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
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
              className='absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden'
            >
              <div className='px-4 py-3 border-b border-gray-100 bg-gray-50'>
                <p className='text-sm font-medium text-gray-900 truncate'>
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
                  className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                >
                  <FiSettings className='text-gray-500 flex-shrink-0' />
                  <span>Account Settings</span>
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setShowModal(true)
                    setDropdownOpen(false)
                  }}
                  className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors'
                >
                  <FiLogOut className='text-red-500 flex-shrink-0' />
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
