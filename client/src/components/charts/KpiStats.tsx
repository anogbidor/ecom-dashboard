import { useEffect, useState } from 'react'
import StatCard from '../cards/StatCard'
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react'

const KPIStats = () => {
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null)
  const [totalOrders, setTotalOrders] = useState<number | null>(null)
  const [totalCustomers, setTotalCustomers] = useState<number | null>(null)
  const [avgOrderValue, setAvgOrderValue] = useState<number | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/kpis')
        const data = await res.json()
        setTotalRevenue(data.totalRevenue)
        setTotalOrders(data.totalOrders)
        setTotalCustomers(data.totalCustomers)
        setAvgOrderValue(data.avgOrderValue)
      } catch (err) {
        console.error('Failed to fetch KPI stats:', err)
      }
    }

    fetchStats()
  }, [])

  const isLoading =
    totalRevenue === null ||
    totalOrders === null ||
    totalCustomers === null ||
    avgOrderValue === null

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
      {isLoading ? (
        <div className='col-span-full text-center text-gray-400 py-8'>
          Loading KPI stats...
        </div>
      ) : (
        <>
          <StatCard
            title='Total Revenue'
            value={`$${totalRevenue?.toFixed(2)}`}
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
            value={`$${avgOrderValue?.toFixed(2)}`}
            icon={<TrendingUp />}
          />
        </>
      )}
    </div>
  )
}

export default KPIStats
