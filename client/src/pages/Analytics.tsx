import DashboardLayout from '../components/layout/DashboardLayout'
import SalesTrendChart from '../components/charts/SalesTrendChart'
import TopProductsChart from '../components/charts/TopProductsChart'
import LowStockTable from '../components/tables/LowStockTable'
import KpiStats from '../components/charts/KpiStats'

const Analytics = () => {
  return (
    <DashboardLayout>
      <h1 className='text-2xl font-bold mb-6'>📊 Analytics Overview</h1>

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
        <h2 className='text-lg font-semibold mb-2'>🔻 Low Stock Alerts</h2>
        <LowStockTable />
      </div>
    </DashboardLayout>
  )
}

export default Analytics
