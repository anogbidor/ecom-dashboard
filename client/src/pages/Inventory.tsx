import InventoryTable from '../components/tables/InventoryTable'
import InventoryChart from '../components/charts/InventoryChart'
import DashboardLayout from '../components/layout/DashboardLayout'

const Inventory = () => {
  return (
    <DashboardLayout>
      <InventoryChart />
      <InventoryTable />
    </DashboardLayout>
  )
}

export default Inventory
