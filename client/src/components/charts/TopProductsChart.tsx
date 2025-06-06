import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'
import { FiTrendingUp } from 'react-icons/fi'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

// ✅ Define the structure of the response
interface TopProduct {
  product_name: string
  total_revenue: number
  total_quantity: number
}

const TopProductsChart = () => {
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null)

  useEffect(() => {
    const fetchTopProducts = async () => {
      const res = await fetch('/api/sales/top-products')
      const data: TopProduct[] = await res.json()

      const formatted: ChartData<'bar'> = {
        labels: data.map((item) => item.product_name),
        datasets: [
          {
            label: 'Revenue ($)',
            data: data.map((item) => item.total_revenue),
            backgroundColor: 'rgba(34, 197, 94, 0.6)', // green
          },
          {
            label: 'Units Sold',
            data: data.map((item) => item.total_quantity),
            backgroundColor: 'rgba(59, 130, 246, 0.6)', // blue
            yAxisID: 'y1',
          },
        ],
      }

      setChartData(formatted)
    }

    fetchTopProducts()
  }, [])

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue ($)',
        },
        ticks: {
          color: '#6B7280',
          font: { size: 12 },
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
        },
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        title: {
          display: true,
          text: 'Units Sold',
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#6B7280',
          font: { size: 12 },
        },
      },
      x: {
        ticks: {
          color: '#6B7280',
          font: { size: 12 },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
  }

  if (!chartData) return <p>Loading top products...</p>

  return (
    <div className='bg-white p-4 rounded shadow w-full'>
      <h2 className='text-xl font-bold text-gray-900 flex items-center mb-3 mt-3 gap-2'>
        <span className='bg-blue-100 text-blue-600 p-2 rounded-lg'>
          <FiTrendingUp />
        </span>
        Top-Selling Products
      </h2>
      <div className='h-[300px] sm:h-[400px] md:h-[500px]'>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}

export default TopProductsChart
