import { NavLink } from 'react-router-dom'
import {
  FiShoppingBag,
  FiHome,
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiBarChart2,
  FiPlusSquare,
  FiChevronRight,
  FiLock,
} from 'react-icons/fi'

interface SidebarProps {
  className?: string
}

const Sidebar = ({ className = '' }: SidebarProps) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const initials = user?.name?.charAt(0)?.toUpperCase() || 'U'
  const role = user?.role || 'guest'

  const navItems = [
    {
      to: '/dashboard',
      icon: <FiHome />,
      text: 'Overview',
      roles: ['admin', 'staff'],
    },
    { to: '/sales', icon: <FiDollarSign />, text: 'Sales', roles: ['admin'] },
    {
      to: '/customers',
      icon: <FiUsers />,
      text: 'Customers',
      roles: ['admin'],
    },
    {
      to: '/inventory',
      icon: <FiPackage />,
      text: 'Inventory',
      roles: ['admin', 'staff'],
    },
    {
      to: '/analytics',
      icon: <FiBarChart2 />,
      text: 'Analytics',
      roles: ['admin'],
    },
    {
      to: '/add-product',
      icon: <FiPlusSquare />,
      text: 'Add Product',
      roles: ['admin', 'staff'],
    },
    {
      to: '/add-sale',
      icon: <FiDollarSign />,
      text: 'Add Sale',
      roles: ['admin', 'staff'],
    },
  ]

  return (
    <aside
      className={`w-64 h-screen bg-gray-800 text-white p-6 fixed transition-all duration-300 ease-in-out z-40 ${className}`}
    >
      {/* Logo */}
      <div className='flex items-center gap-3 mb-10 pl-2'>
        <div className='p-2 bg-teal-500 rounded-lg shadow-md'>
          <FiShoppingBag className='text-white text-xl' />
        </div>
        <h1 className='text-2xl font-bold bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent'>
          Dashboard
        </h1>
      </div>

      {/* Navigation */}
      <nav>
        <ul className='space-y-3'>
          {navItems.map((item) => {
            const hasAccess = item.roles.includes(role)

            return (
              <li key={item.to}>
                {hasAccess ? (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center justify-between gap-3 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-teal-400 shadow-md'
                          : 'hover:bg-gray-700 hover:text-teal-300'
                      }`
                    }
                  >
                    <div className='flex items-center gap-3'>
                      <span className='text-lg bg-gray-700 p-2 rounded-lg'>
                        {item.icon}
                      </span>
                      <span className='font-medium'>{item.text}</span>
                    </div>
                    <FiChevronRight className='opacity-0 group-hover:opacity-100 transition-opacity' />
                  </NavLink>
                ) : (
                  <div
                    className='flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-700 bg-opacity-50 text-gray-500 cursor-not-allowed'
                    title='Restricted'
                  >
                    <div className='flex items-center gap-3'>
                      <span className='text-lg bg-gray-800 p-2 rounded-lg'>
                        {item.icon}
                      </span>
                      <span className='font-medium flex items-center gap-1'>
                        {item.text} <FiLock className='text-xs' />
                      </span>
                    </div>
                    <FiChevronRight className='opacity-30' />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className='absolute bottom-6 left-6 right-6 border-t border-gray-700 pt-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center'>
            <span className='text-sm font-semibold'>{initials}</span>
          </div>
          <div>
            <p className='font-medium truncate max-w-[130px]'>
              {user?.name || 'User'}
            </p>
            <p className='text-xs text-gray-400 truncate max-w-[130px]'>
              {role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
