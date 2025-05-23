import DashboardLayout from '../components/layout/DashboardLayout'
import SalesTrendChart from '../components/charts/SalesTrendChart'
import TopProductsChart from '../components/charts/TopProductsChart'
import LowStockTable from '../components/tables/LowStockTable'
import KpiStats from '../components/charts/KpiStats'
import { FiBarChart2, FiTrendingDown } from 'react-icons/fi'

const Analytics = () => {
  return (
    <DashboardLayout>
      <h2 className='text-2xl font-bold text-gray-900 flex items-center mb-4 gap-2'>
        <span className='bg-blue-100 text-blue-600 p-2 rounded-lg'>
          <FiBarChart2 />
        </span>
        Analytics Overview
      </h2>

      {/* KPIs section (optional) */}
      <KpiStats />

      {/* Sales Trends */}
      <div className='mb-8'>
        <SalesTrendChart />
      </div>

      {/* Top-Selling Products */}
      <div className='mb-8'>
        <TopProductsChart />
      </div>

      {/* Low Stock Items */}
      <div className='mb-8'>
        <h2 className='text-xl font-bold text-gray-900 flex items-center mb-4 gap-2'>
          <span className='bg-blue-100 text-blue-600 p-2 rounded-lg'>
            <FiTrendingDown />
          </span>
          Low Stock Items
        </h2>
        <LowStockTable />
      </div>
    </DashboardLayout>
  )
}

export default Analytics
