import DashboardLayout from '../components/layout/DashboardLayout'
import SalesChart from '../components/charts/SalesChart'
import SalesTable from '../components/tables/SalesTable'

const Sales = () => {
  return (
    <DashboardLayout>
      <SalesChart />
      <SalesTable />
    </DashboardLayout>
  )
}

export default Sales
