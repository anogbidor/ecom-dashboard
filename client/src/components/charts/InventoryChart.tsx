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
import type { ChartData } from 'chart.js'

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

  if (!chartData) return <p>Loading chart...</p>

  return (
    <div className='bg-white p-4 rounded shadow'>
      <h2 className='text-lg font-semibold mb-4'>Inventory Stock Levels</h2>
      <Bar data={chartData} />
    </div>
  )
}

export default InventoryChart
