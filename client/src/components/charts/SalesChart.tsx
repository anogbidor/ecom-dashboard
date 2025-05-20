import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'
import type { ChartData } from 'chart.js'

// Register necessary Chart.js modules
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
)

type Sale = {
  id: number
  product_name: string
  quantity: number
  total_price: string
  sale_date: string
}

const SalesChart = () => {
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/sales')
      const data: Sale[] = await res.json()

      const labels = data.map((sale) => sale.sale_date)
      const totals = data.map((sale) => parseFloat(sale.total_price))

      const chartConfig: ChartData<'line'> = {
        labels,
        datasets: [
          {
            label: 'Total Sales ($)',
            data: totals,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.3,
          },
        ],
      }

      setChartData(chartConfig)
    }

    fetchData()
  }, [])

  if (!chartData) return <p>Loading chart...</p>

  return (
    <div className='bg-white rounded shadow p-4'>
      <h2 className='text-lg font-semibold mb-4'>Sales Over Time</h2>
      <Line data={chartData} />
    </div>
  )
}

export default SalesChart
