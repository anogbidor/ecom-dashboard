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
import type { ChartData, ChartOptions } from 'chart.js'
import { FiTrendingUp } from 'react-icons/fi'

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
)

interface SalesData {
  date: string
  total: number
}

const SalesChart = () => {
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: 'Inter, sans-serif',
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleFont: {
          size: 16,
          family: 'Inter, sans-serif',
        },
        bodyFont: {
          size: 14,
          family: 'Inter, sans-serif',
        },
        padding: 12,
        usePointStyle: true,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
          },
        },
      },
      y: {
        grid: {
          color: '#E2E8F0',
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
          },
          callback: (value) => `$${value}`,
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: '#3B82F6',
      },
    },
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/sales/trends')

        if (!res.ok) {
          throw new Error('Failed to fetch sales data')
        }

        const salesData: SalesData[] = await res.json()

        const formatted: ChartData<'line'> = {
          labels: salesData.map((item) =>
            new Date(item.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })
          ),
          datasets: [
            {
              label: 'Sales ($)',
              data: salesData.map((item) => item.total),
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.3,
              borderWidth: 3,
              fill: true,
            },
          ],
        }

        setChartData(formatted)
      } catch (err) {
        console.error('Error loading chart data:', err)
        setError('Failed to load sales data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full h-[400px] flex items-center justify-center'>
        <div className='animate-pulse text-gray-500'>Loading sales data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full h-[400px] flex items-center justify-center'>
        <div className='text-red-500'>{error}</div>
      </div>
    )
  }

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full h-[500px]'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-semibold text-gray-800 flex items-center gap-3'>
          <span className='bg-blue-100 text-blue-600 p-2 rounded-lg'>
            <FiTrendingUp size={20} />
          </span>
          Sales Trends
        </h2>
        <div className='text-sm text-gray-500'>
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
      <div className='h-[calc(100%-60px)]'>
        {chartData && <Line data={chartData} options={options} />}
      </div>
    </div>
  )
}

export default SalesChart
