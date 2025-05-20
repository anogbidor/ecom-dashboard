import { useEffect, useState } from 'react'
import StatCard from '../cards/StatCard'
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react'

const KPIStats = () => {
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [avgOrderValue, setAvgOrderValue] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch('/api/kpis')
      const data = await res.json()
      setTotalRevenue(data.totalRevenue)
      setTotalOrders(data.totalOrders)
      setTotalCustomers(data.totalCustomers)
      setAvgOrderValue(data.avgOrderValue)
    }

    fetchStats()
  }, [])

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
      <StatCard
        title='Total Revenue'
        value={`$${totalRevenue.toFixed(2)}`}
        icon={<DollarSign />}
      />
      <StatCard
        title='Total Orders'
        value={String(totalOrders)}
        icon={<ShoppingCart />}
      />
      <StatCard
        title='Total Customers'
        value={String(totalCustomers)}
        icon={<Users />}
      />
      <StatCard
        title='Avg. Order Value'
        value={`$${avgOrderValue.toFixed(2)}`}
        icon={<TrendingUp />}
      />
    </div>
  )
}

export default KPIStats
