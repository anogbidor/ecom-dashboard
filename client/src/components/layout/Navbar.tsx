import { useEffect, useState } from 'react'
import { logout } from '../../utils/logout'
import ConfirmModal from '../common/ConfirmModal'

const Navbar = () => {
  const [showModal, setShowModal] = useState(false)
  const [user, setUser] = useState<{ name: string } | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <nav className='h-16 bg-white shadow px-6 flex items-center justify-between ml-64 relative z-10'>
      <h2 className='text-lg font-semibold'>
        Welcome back{user ? `, ${user.name}` : ''}!
      </h2>
      <div className='flex items-center space-x-4'>
        <span className='text-xl cursor-pointer'>🔔</span>

        {user && (
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-sm font-bold text-white'>
              {user.name.charAt(0)}
            </div>
            <span className='text-gray-700 text-sm font-medium'>
              {user.name}
            </span>
          </div>
        )}

        <button
          onClick={() => setShowModal(true)}
          className='bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 text-sm font-medium'
        >
          Logout
        </button>
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
