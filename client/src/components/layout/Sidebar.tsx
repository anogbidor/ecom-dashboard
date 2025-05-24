import { NavLink } from 'react-router-dom'
import {
  FiShoppingBag,
  FiHome,
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiBarChart2,
  FiPlusSquare,
} from 'react-icons/fi'

const Sidebar = () => {
  const navItems = [
    { to: '/dashboard', icon: <FiHome />, text: 'Overview' },
    { to: '/sales', icon: <FiDollarSign />, text: 'Sales' },
    { to: '/customers', icon: <FiUsers />, text: 'Customers' },
    { to: '/inventory', icon: <FiPackage />, text: 'Inventory' },
    { to: '/analytics', icon: <FiBarChart2 />, text: 'Analytics' },
    { to: '/add-product', icon: <FiPlusSquare />, text: 'Add Product' },
    { to: '/add-sale', icon: <FiDollarSign />, text: 'Add Sale' }, // ✅ Added
  ]

  return (
    <aside className='w-64 h-screen bg-gray-800 text-white p-6 fixed'>
      <h1 className='text-2xl font-bold mb-8 flex items-center gap-2'>
        <FiShoppingBag className='text-teal-400' />
        <span>Dashboard</span>
      </h1>

      <ul className='space-y-2'>
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-700 text-teal-400'
                    : 'hover:bg-gray-700 hover:text-teal-400'
                }`
              }
            >
              <span className='text-lg'>{item.icon}</span>
              <span>{item.text}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
