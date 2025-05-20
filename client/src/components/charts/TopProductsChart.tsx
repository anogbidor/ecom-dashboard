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
import type { ChartData } from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const TopProductsChart = () => {
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null)

  useEffect(() => {
    const fetchTopProducts = async () => {
      const res = await fetch('/api/sales/top-products')
      const data = await res.json()

      const formatted: ChartData<'bar'> = {
        labels: data.map((item: any) => item.product_name),
        datasets: [
          {
            label: 'Revenue ($)',
            data: data.map((item: any) => item.total_revenue),
            backgroundColor: 'rgba(34, 197, 94, 0.6)',
          },
          {
            label: 'Units Sold',
            data: data.map((item: any) => item.total_quantity),
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            yAxisID: 'y1',
          },
        ],
      }

      setChartData(formatted)
    }

    fetchTopProducts()
  }, [])

 if (!chartData) return <p>Loading top products...</p>
 
 const options = {
   responsive: true,
   scales: {
     y: {
       beginAtZero: true,
       title: { display: true, text: 'Revenue ($)' },
     },
     y1: {
       beginAtZero: true,
       position: 'right' as const,
       title: { display: true, text: 'Units Sold' },
       grid: { drawOnChartArea: false },
     },
   },
 }

  return (
    <div className='bg-white p-4 rounded shadow'>
      <h2 className='text-lg font-semibold mb-4'>🏆 Top-Selling Products</h2>
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default TopProductsChart
