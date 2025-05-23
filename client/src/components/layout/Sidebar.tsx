
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className='w-64 h-screen bg-gray-800 text-white p-6 fixed'>
      <h1 className='text-2xl font-bold mb-8'>🛍️ Dashboard</h1>
      <ul className='space-y-4'>
        <li>
          <Link to='/dashboard' className='hover:text-teal-400 block'>
            Overview
          </Link>
        </li>
        <li>
          <Link to='/sales' className='hover:text-teal-400 block'>
            Sales
          </Link>
        </li>
        <li>
          <Link to='/customers' className='hover:text-teal-400 block'>
            Customers
          </Link>
        </li>
        <li>
          <Link to='/inventory' className='hover:text-teal-400 block'>
            Inventory
          </Link>
        </li>
        <li>
          <Link to='/analytics' className='hover:text-teal-400 block'>
            Analytics
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
