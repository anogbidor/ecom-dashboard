import DashboardLayout from '../components/layout/DashboardLayout'
import SalesChart from '../components/charts/SalesChart'
import SalesTable from '../components/tables/SalesTable'

const Sales = () => {
  return (
    <DashboardLayout>
      <h2 className='text-xl font-semibold mb-4'>Sales Overview</h2>
      <SalesChart />
      <SalesTable />
    </DashboardLayout>
  )
}

export default Sales
