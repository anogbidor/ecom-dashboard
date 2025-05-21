import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import type { ChartOptions } from 'chart.js'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'
import type { ChartData } from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title)

type Stat = {
  location: string
  count: number
}

const CustomerLocationChart = () => {
  const [chartData, setChartData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch('/api/customers/locations')
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`)
        }

        const stats: Stat[] = await res.json()
        const sortedStats = [...stats].sort((a, b) => b.count - a.count)

        const formatted: ChartData<'bar'> = {
          labels: sortedStats.map((item) => item.location),
          datasets: [
            {
              label: 'Number of Customers',
              data: sortedStats.map((item) => item.count),
              backgroundColor: 'rgba(59, 130, 246, 0.7)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1,
              borderRadius: 4,
              hoverBackgroundColor: 'rgba(59, 130, 246, 0.9)',
            },
          ],
        }

        setChartData(formatted)
      } catch (err) {
        console.error('Error fetching customer locations:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Customer Distribution by Location',
        font: {
          size: 16,
          weight: 500,
        },
        padding: {
          bottom: 20,
          top: 10,
        },
        color: '#374151',
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: {
          size: 14,
          weight: 500,
        },
        bodyFont: {
          size: 12,
        },
        padding: 12,
        cornerRadius: 4,
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          label: (context) => `${context.raw} customers`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#6B7280',
          maxRotation: 45,
          minRotation: 0,
          font: { size: 12 },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6B7280',
          precision: 0,
          font: { size: 12 },
        },
        grid: { color: 'rgba(229, 231, 235, 0.5)' },
        border: { dash: [4, 4] },
      },
    },
  }

  if (loading) {
    return (
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-96 flex items-center justify-center'>
        <div className='text-center space-y-3'>
          <div className='inline-block h-8 w-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin'></div>
          <p className='text-gray-500 font-medium'>Loading customer data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-64 flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <div className='mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 text-red-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <p className='text-gray-700 font-medium'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition text-sm font-medium'
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100 w-full'>
      <div className='h-[300px] sm:h-[400px] md:h-[500px]'>
        <Bar
          data={chartData}
          options={chartOptions}
          aria-label='Customer distribution by location chart'
        />
      </div>
      <div className='mt-3 text-xs text-gray-400 text-center'>
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  )
}

export default CustomerLocationChart
