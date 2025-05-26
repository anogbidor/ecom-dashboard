import { useEffect, useState } from 'react'

type InventoryItem = {
  id: number
  product_name: string
  sku: string
  quantity_in_stock: number
  price: number
  date_added: string
}

const InventoryTable = () => {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [search, setSearch] = useState('')
  const [minQty, setMinQty] = useState(0)
  const [maxQty, setMaxQty] = useState(1000)
  const [sortKey, setSortKey] = useState<'quantity' | 'price' | 'date' | ''>('')
  const [sortAsc, setSortAsc] = useState(true)

  useEffect(() => {
    const fetchInventory = async () => {
      const res = await fetch('/api/inventory')
      const data = await res.json()
      setItems(data)
    }

    fetchInventory()
  }, [])

  const handleSort = (key: 'quantity' | 'price' | 'date') => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  let filteredItems = items
    .filter((item) =>
      item.product_name.toLowerCase().includes(search.toLowerCase())
    )
    .filter(
      (item) =>
        item.quantity_in_stock >= minQty && item.quantity_in_stock <= maxQty
    )

  if (sortKey) {
    filteredItems = filteredItems.sort((a, b) => {
      const valA =
        sortKey === 'quantity'
          ? a.quantity_in_stock
          : sortKey === 'price'
          ? a.price
          : new Date(a.date_added).getTime()

      const valB =
        sortKey === 'quantity'
          ? b.quantity_in_stock
          : sortKey === 'price'
          ? b.price
          : new Date(b.date_added).getTime()

      return sortAsc ? valA - valB : valB - valA
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className='bg-white p-4 rounded-lg shadow'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2'>
        <h2 className='text-lg font-semibold'>Inventory Overview</h2>
        <button
          type='button'
          onClick={handlePrint}
          className='bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 self-end sm:self-auto'
        >
          Print
        </button>
      </div>

      {/* Filters */}
      <div className='flex flex-col md:flex-row gap-4 mb-4'>
        <input
          type='text'
          placeholder='Search product name...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='px-3 py-2 border border-gray-300 rounded w-full md:max-w-xs'
        />

        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
          <label htmlFor='minQty'>Min Qty:</label>
          <input
            id='minQty'
            type='number'
            min={0}
            value={minQty}
            onChange={(e) => setMinQty(Number(e.target.value))}
            className='px-2 py-1 border border-gray-300 rounded w-20'
          />

          <label htmlFor='maxQty'>Max Qty:</label>
          <input
            id='maxQty'
            type='number'
            min={0}
            value={maxQty}
            onChange={(e) => setMaxQty(Number(e.target.value))}
            className='px-2 py-1 border border-gray-300 rounded w-20'
          />
        </div>
      </div>

      {/* ✅ Desktop Table */}
      <div className='hidden md:block overflow-x-auto'>
        <table className='min-w-full text-sm text-left'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='py-2 px-4'>Product</th>
              <th className='py-2 px-4'>SKU</th>
              <th
                className='py-2 px-4 cursor-pointer hover:text-teal-600'
                onClick={() => handleSort('quantity')}
              >
                Qty in Stock {sortKey === 'quantity' && (sortAsc ? '⬆️' : '⬇️')}
              </th>
              <th
                className='py-2 px-4 cursor-pointer hover:text-teal-600'
                onClick={() => handleSort('price')}
              >
                Price ($) {sortKey === 'price' && (sortAsc ? '⬆️' : '⬇️')}
              </th>
              <th
                className='py-2 px-4 cursor-pointer hover:text-teal-600'
                onClick={() => handleSort('date')}
              >
                Last Restocked {sortKey === 'date' && (sortAsc ? '⬆️' : '⬇️')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className='border-b hover:bg-gray-50'>
                <td className='py-2 px-4'>{item.product_name}</td>
                <td className='py-2 px-4'>{item.sku}</td>
                <td className='py-2 px-4'>
                  {item.quantity_in_stock < 25 ? (
                    <span className='text-red-600 font-semibold'>
                      {item.quantity_in_stock} ⚠️ Low
                    </span>
                  ) : (
                    item.quantity_in_stock
                  )}
                </td>
                <td className='py-2 px-4'>${Number(item.price).toFixed(2)}</td>
                <td className='py-2 px-4'>
                  {new Date(item.date_added).toISOString().slice(0, 10)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Card Layout */}
      <div className='md:hidden space-y-4'>
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className='border border-gray-200 rounded-lg p-4 shadow-sm'
          >
            <p>
              <span className='font-semibold'>Product:</span>{' '}
              {item.product_name}
            </p>
            <p>
              <span className='font-semibold'>SKU:</span> {item.sku}
            </p>
            <p>
              <span className='font-semibold'>Qty:</span>{' '}
              {item.quantity_in_stock < 25 ? (
                <span className='text-red-600 font-semibold'>
                  {item.quantity_in_stock} ⚠️ Low
                </span>
              ) : (
                item.quantity_in_stock
              )}
            </p>
            <p>
              <span className='font-semibold'>Price:</span> $
              {Number(item.price).toFixed(2)}
            </p>
            <p>
              <span className='font-semibold'>Date:</span>{' '}
              {new Date(item.date_added).toISOString().slice(0, 10)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InventoryTable
