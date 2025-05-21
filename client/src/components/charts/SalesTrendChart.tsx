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

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resSales = await fetch('/api/sales/trends')
        const resForecast = await fetch('http://localhost:5001/api/forecast')

        if (!resSales.ok || !resForecast.ok) {
          throw new Error('Failed to fetch data')
        }

        const actual = await resSales.json()
        const forecast = await resForecast.json()

        const allDates = [
          ...actual.map((item: any) =>
            new Date(item.date).toISOString().slice(0, 10)
          ),
          ...forecast.map((item: any) => item.date),
        ]

        const formatted: ChartData<'line'> = {
          labels: allDates,
          datasets: [
            {
              label: 'Actual Sales ($)',
              data: [
                ...actual.map((item: any) => item.total),
                ...new Array(forecast.length).fill(null),
              ],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              fill: true,
            },
            {
              label: 'Forecasted Sales ($)',
              data: [
                ...new Array(actual.length).fill(null),
                ...forecast.map((item: any) => item.forecast),
              ],
              borderColor: 'rgb(234, 179, 8)',
              backgroundColor: 'rgba(234, 179, 8, 0.1)',
              borderDash: [5, 5],
              tension: 0.4,
              fill: true,
            },
          ],
        }

        setChartData(formatted)
      } catch (err) {
        console.error('Error loading chart data:', err)
      }
    }

    fetchData()
  }, [])

  if (!chartData) return <p>Loading sales trends...</p>

  return (
    <div className='bg-white p-4 rounded shadow w-full h-[300px] sm:h-[400px] md:h-[500px]'>
      <h2 className='text-lg font-semibold mb-4'>📈 Sales Trends & Forecast</h2>
      <Line data={chartData} options={options} />
    </div>
  )
}

export default SalesTrendChart
