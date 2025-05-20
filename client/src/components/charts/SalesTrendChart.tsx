import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { ChartData } from 'chart.js'

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
)

const SalesTrendChart = () => {
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null)

  useEffect(() => {
    const fetchTrends = async () => {
      const res = await fetch('/api/sales/trends')
      const data = await res.json()

      const formatted: ChartData<'line'> = {
        labels: data.map((item: any) => item.date),
        datasets: [
          {
            label: 'Sales ($)',
            data: data.map((item: any) => item.total),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            tension: 0.3,
            fill: true,
          },
        ],
      }

      setChartData(formatted)
    }

    fetchTrends()
  }, [])

  if (!chartData) return <p>Loading sales trends...</p>

  return (
    <div className='bg-white p-4 rounded shadow'>
      <h2 className='text-lg font-semibold mb-4'>📈 Sales Trends</h2>
      <Line data={chartData} />
    </div>
  )
}

export default SalesTrendChart
