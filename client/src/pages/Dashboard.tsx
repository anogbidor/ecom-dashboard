import DashboardLayout from '../components/layout/DashboardLayout'
import SalesChart from '../components/charts/SalesChart'
import CustomerTable from '../components/tables/CustomerTable'
import InventoryTable from '../components/tables/InventoryTable'
import KpiStats from '../components/charts/KpiStats'

const Dashboard = () => {
  return (
    <DashboardLayout>
      {/* ✅ Real KPIs at the top */}
      <div className='grid grid-cols-1 my-6'>
        <KpiStats />
      </div>

      {/* 📈 Sales Chart */}
      <div className='grid grid-cols-1'>
        <SalesChart />
      </div>

      {/* 👥 Customer Table (Responsive Wrapper) */}
      <div className='my-6'>
        <div className='overflow-x-auto bg-white shadow rounded-lg p-4'>
          <CustomerTable />
        </div>
      </div>

      {/* 📦 Inventory Table (Responsive Wrapper) */}
      <div className='my-6'>
        <div className='overflow-x-auto bg-white shadow rounded-lg p-4'>
          <InventoryTable />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
