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
import type { ChartData, ChartOptions } from 'chart.js'
import { FiDollarSign } from 'react-icons/fi'

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

      const labels = data.map((sale) =>
        new Date(sale.sale_date).toISOString().slice(0, 10)
      )
      const totals = data.map((sale) => parseFloat(sale.total_price))

      const chartConfig: ChartData<'line'> = {
        labels,
        datasets: [
          {
            label: 'Total Sales ($)',
            data: totals,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.3,
            fill: true,
            pointRadius: 3,
          },
        ],
      }

      setChartData(chartConfig)
    }

    fetchData()
  }, [])

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#6B7280',
          maxRotation: 45,
          font: { size: 12 },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6B7280',
          font: { size: 12 },
        },
        grid: { color: 'rgba(229, 231, 235, 0.5)' },
      },
    },
  }

  if (!chartData) return <p>Loading chart...</p>

  return (
    <div className='bg-white rounded shadow p-4 w-full'>
       <h2 className='text-2xl font-bold text-gray-900 flex items-center mb-3 gap-2'>
                             <span className='bg-blue-100 text-blue-600  p-2 rounded-lg'>
                               <FiDollarSign />
                             </span>
                             Sales Over Time
                           </h2>
      <div className='h-[300px] sm:h-[400px] md:h-[500px]'>
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}

export default SalesChart
