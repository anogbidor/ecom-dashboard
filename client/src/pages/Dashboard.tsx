import { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import SalesChart from '../components/charts/SalesChart'
import CustomerTable from '../components/tables/CustomerTable'
import InventoryTable from '../components/tables/InventoryTable'
import KpiStats from '../components/charts/KpiStats'
import AddUserModal from '../components/common/AddUserModal'
import { FiUserPlus } from 'react-icons/fi'

const Dashboard = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [role, setRole] = useState('')

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setRole(user?.role || '')
  }, [])

  return (
    <DashboardLayout>
      {/* ✅ Top Section with Add User Button */}
      <div className='flex justify-between items-center my-6'>
        <h2 className='text-xl font-bold text-gray-800'>Dashboard Overview</h2>

        {role === 'admin' && (
          <button
            aria-label='Add User'
            type='button'
            onClick={() => setShowAddUserModal(true)}
            className='bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 flex items-center gap-2'
          >
            <FiUserPlus /> Add User
          </button>
        )}
      </div>

      {/* 👤 Admin-only Modal */}
      {role === 'admin' && (
        <AddUserModal
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
        />
      )}

      {/* 📊 Real KPIs */}
      <div className='grid grid-cols-1 my-6'>
        <KpiStats />
      </div>

      {/* 📈 Sales Chart */}
      <div className='grid grid-cols-1'>
        <SalesChart />
      </div>

      {/* 👥 Customer Table */}
      <div className='my-6'>
        <div className='overflow-x-auto bg-white shadow rounded-lg p-4'>
          <CustomerTable />
        </div>
      </div>

      {/* 📦 Inventory Table */}
      <div className='my-6'>
        <div className='overflow-x-auto bg-white shadow rounded-lg p-4'>
          <InventoryTable />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
