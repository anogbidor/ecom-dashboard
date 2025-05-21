import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

type InventoryItem = {
  product_name: string
  quantity_in_stock: number
}

const InventoryChart = () => {
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/inventory')
      const data: InventoryItem[] = await res.json()

      const formatted: ChartData<'bar'> = {
        labels: data.map((item) => item.product_name),
        datasets: [
          {
            label: 'Stock Level',
            data: data.map((item) => item.quantity_in_stock),
            backgroundColor: 'rgb(34, 197, 94)', // Tailwind green-500
          },
        ],
      }

      setChartData(formatted)
    }

    fetchData()
  }, [])

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw} items`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#6B7280',
          maxRotation: 45,
          minRotation: 0,
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
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
        },
      },
    },
  }

  if (!chartData) return <p>Loading chart...</p>

  return (
    <div className='bg-white p-4 rounded shadow w-full'>
      <h2 className='text-lg font-semibold mb-4'>📦 Inventory Stock Levels</h2>
      <div className='h-[300px] sm:h-[400px] md:h-[500px]'>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}

export default InventoryChart
