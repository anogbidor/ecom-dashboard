import { Link } from 'react-router-dom'
import {
  FiHome,
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiBarChart2,
  FiPlusSquare,
} from 'react-icons/fi'

const Sidebar = () => {
  return (
    <aside className='w-64 h-screen bg-gray-800 text-white p-6 fixed'>
      <h1 className='text-2xl font-bold mb-8 flex items-center gap-2'>
        <FiPackage className='text-teal-400' />
        <span>Dashboard</span>
      </h1>

      <ul className='space-y-2'>
        {[
          { to: '/dashboard', icon: <FiHome />, text: 'Overview' },
          { to: '/sales', icon: <FiDollarSign />, text: 'Sales' },
          { to: '/customers', icon: <FiUsers />, text: 'Customers' },
          { to: '/inventory', icon: <FiPackage />, text: 'Inventory' },
          { to: '/analytics', icon: <FiBarChart2 />, text: 'Analytics' },
          { to: '/add-product', icon: <FiPlusSquare />, text: 'Add Product' },
        ].map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 hover:text-teal-400 transition-colors'
            >
              <span className='text-lg'>{item.icon}</span>
              <span>{item.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
