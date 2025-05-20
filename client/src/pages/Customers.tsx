import CustomerTable from '../components/tables/CustomerTable'
import DashboardLayout from '../components/layout/DashboardLayout'
import CustomerLocationChart from '../components/charts/CustomerLocationChart'

const Customers = () => {
  return (
    <DashboardLayout>
      <CustomerLocationChart/>
      <CustomerTable />
    </DashboardLayout>
  )
}

export default Customers
