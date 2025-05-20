import { useEffect, useState } from 'react'

// Sale type definition
type Sale = {
  id: number
  product_name: string
  quantity: number
  total_price: number
  sale_date: string
}

const SalesTable = () => {
  const [sales, setSales] = useState<Sale[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<'quantity' | 'price' | 'date' | ''>('')
  const [sortAsc, setSortAsc] = useState(true)

  useEffect(() => {
    const fetchSales = async () => {
      const res = await fetch('/api/sales')
      const data = await res.json()
      setSales(data)
    }

    fetchSales()
  }, [])

  const handleSort = (key: 'quantity' | 'price' | 'date') => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  let filteredSales = sales
    .filter((sale) => {
      const saleTime = new Date(sale.sale_date).getTime()
      const startTime = startDate ? new Date(startDate).getTime() : 0
      const endTime = endDate ? new Date(endDate).getTime() : Infinity
      return saleTime >= startTime && saleTime <= endTime
    })
    .filter((sale) =>
      sale.product_name.toLowerCase().includes(search.toLowerCase())
    )

  if (sortKey) {
    filteredSales = filteredSales.sort((a, b) => {
      const valA =
        sortKey === 'quantity'
          ? a.quantity
          : sortKey === 'price'
          ? a.total_price
          : new Date(a.sale_date).getTime()

      const valB =
        sortKey === 'quantity'
          ? b.quantity
          : sortKey === 'price'
          ? b.total_price
          : new Date(b.sale_date).getTime()

      return sortAsc ? valA - valB : valB - valA
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const totalRevenue = filteredSales.reduce(
    (sum, sale) => sum + Number(sale.total_price || 0),
    0
  )

  return (
    <div className='bg-white p-4 rounded-lg shadow overflow-x-auto'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-semibold'>Sales Records</h2>
        <button
          type='button'
          onClick={handlePrint}
          className='bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700'
        >
          Print
        </button>
      </div>

      {/* Filters */}
      <div className='flex flex-col md:flex-row gap-4 mb-4'>
        <div>
          <label className='block text-sm font-medium'>Start Date</label>
      <input
       title='Start Date'
            type='date'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded'
          />
        </div>

        <div>
          <label className='block text-sm font-medium'>End Date</label>
      <input
       title='End Date'
            type='date'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded'
          />
        </div>

        <div>
          <label className='block text-sm font-medium'>Product Name</label>
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search product...'
            className='px-3 py-2 border border-gray-300 rounded'
          />
        </div>
      </div>

      <table className='min-w-full text-sm text-left print:text-xs'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='py-2 px-4'>Product</th>
            <th
              className='py-2 px-4 cursor-pointer hover:text-teal-600'
              onClick={() => handleSort('quantity')}
            >
              Quantity {sortKey === 'quantity' && (sortAsc ? '⬆️' : '⬇️')}
            </th>
            <th
              className='py-2 px-4 cursor-pointer hover:text-teal-600'
              onClick={() => handleSort('price')}
            >
              Total Price ($) {sortKey === 'price' && (sortAsc ? '⬆️' : '⬇️')}
            </th>
            <th
              className='py-2 px-4 cursor-pointer hover:text-teal-600'
              onClick={() => handleSort('date')}
            >
              Sale Date {sortKey === 'date' && (sortAsc ? '⬆️' : '⬇️')}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale) => (
            <tr key={sale.id} className='border-b hover:bg-gray-50'>
              <td className='py-2 px-4'>{sale.product_name}</td>
              <td className='py-2 px-4'>{sale.quantity}</td>
              <td className='py-2 px-4'>
                ${Number(sale.total_price).toFixed(2)}
              </td>
              <td className='py-2 px-4'>
                {new Date(sale.sale_date).toISOString().slice(0, 10)}
              </td>
            </tr>
          ))}
          <tr className='bg-gray-100 font-semibold'>
            <td className='py-2 px-4'>Total Revenue</td>
            <td className='py-2 px-4' colSpan={3}>
              ${totalRevenue.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default SalesTable
