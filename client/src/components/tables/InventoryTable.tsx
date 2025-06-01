import { useEffect, useState } from 'react'
import {
  FiPrinter,
  FiSearch,
  FiChevronUp,
  FiChevronDown,
  FiAlertTriangle,
} from 'react-icons/fi'

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
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [minQty, setMinQty] = useState<number | ''>(0)
  const [maxQty, setMaxQty] = useState<number | ''>(500)
  const [sortKey, setSortKey] = useState<'quantity' | 'price' | 'date' | ''>('')
  const [sortAsc, setSortAsc] = useState(true)

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true)
        const res = await fetch('/api/inventory')
        const data = await res.json()
        setItems(data)
      } catch (error) {
        console.error('Error fetching inventory:', error)
      } finally {
        setIsLoading(false)
      }
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

  const handleQtyChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? '' : Number(value)
    if (numValue === '' || !isNaN(numValue as number)) {
      if (type === 'min') {
        setMinQty(numValue)
      } else {
        setMaxQty(numValue)
      }
    }
  }

  let filteredItems = items
    .filter((item) =>
      item.product_name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) => {
      const min = minQty === '' ? 0 : minQty
      const max = maxQty === '' ? Infinity : maxQty
      return item.quantity_in_stock >= min && item.quantity_in_stock <= max
    })

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

  const SortIcon = ({
    isActive,
    isAsc,
  }: {
    isActive: boolean
    isAsc: boolean
  }) => {
    if (!isActive) return null
    return isAsc ? (
      <FiChevronUp className='inline ml-1' />
    ) : (
      <FiChevronDown className='inline ml-1' />
    )
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-gray-800'>
            Inventory Overview
          </h2>
          <p className='text-sm text-gray-500'>
            {filteredItems.length}{' '}
            {filteredItems.length === 1 ? 'item' : 'items'} found
          </p>
        </div>
        <button
          type='button'
          onClick={handlePrint}
          className='flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors self-start sm:self-auto'
        >
          <FiPrinter /> Print Report
        </button>
      </div>

      {/* Filters */}
      <div className='flex flex-col md:flex-row gap-4 mb-6'>
        <div className='relative flex-grow'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <FiSearch className='text-gray-400' />
          </div>
          <input
            type='text'
            placeholder='Search products...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
          />
        </div>

        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
          <div className='flex items-center gap-2'>
            <label
              htmlFor='minQty'
              className='text-sm font-medium text-gray-700'
            >
              Min Qty:
            </label>
            <input
              id='minQty'
              type='number'
              min={0}
              value={minQty}
              onChange={(e) => handleQtyChange('min', e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-lg w-20 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
            />
          </div>

          <div className='flex items-center gap-2'>
            <label
              htmlFor='maxQty'
              className='text-sm font-medium text-gray-700'
            >
              Max Qty:
            </label>
            <input
              id='maxQty'
              type='number'
              min={0}
              value={maxQty}
              onChange={(e) => handleQtyChange('max', e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-lg w-20 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500'></div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className='hidden md:block overflow-x-auto rounded-lg border border-gray-200'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    Product
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    SKU
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600'
                    onClick={() => handleSort('quantity')}
                  >
                    <div className='flex items-center'>
                      Qty in Stock
                      <SortIcon
                        isActive={sortKey === 'quantity'}
                        isAsc={sortAsc}
                      />
                    </div>
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600'
                    onClick={() => handleSort('price')}
                  >
                    <div className='flex items-center'>
                      Price
                      <SortIcon
                        isActive={sortKey === 'price'}
                        isAsc={sortAsc}
                      />
                    </div>
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-teal-600'
                    onClick={() => handleSort('date')}
                  >
                    <div className='flex items-center'>
                      Last Restocked
                      <SortIcon isActive={sortKey === 'date'} isAsc={sortAsc} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap font-medium text-gray-900'>
                        {item.product_name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-gray-500'>
                        {item.sku}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {item.quantity_in_stock < 25 ? (
                          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                            <FiAlertTriangle className='mr-1' />
                            {item.quantity_in_stock} (Low)
                          </span>
                        ) : (
                          <span className='text-gray-900'>
                            {item.quantity_in_stock}
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-gray-900'>
                        ${Number(item.price).toFixed(2)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-gray-500'>
                        {new Date(item.date_added).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className='px-6 py-4 text-center text-gray-500'
                    >
                      No items found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className='md:hidden space-y-4'>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className='border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow'
                >
                  <div className='flex justify-between items-start'>
                    <h3 className='font-bold text-lg text-gray-800'>
                      {item.product_name}
                    </h3>
                    <span className='text-sm text-gray-500'>{item.sku}</span>
                  </div>
                  <div className='mt-3 grid grid-cols-2 gap-2'>
                    <div>
                      <p className='text-sm text-gray-500'>Quantity</p>
                      <p
                        className={
                          item.quantity_in_stock < 25
                            ? 'text-red-600 font-semibold'
                            : ''
                        }
                      >
                        {item.quantity_in_stock}
                        {item.quantity_in_stock < 25 && (
                          <span className='ml-1 text-xs'>(Low stock)</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-500'>Price</p>
                      <p>${Number(item.price).toFixed(2)}</p>
                    </div>
                    <div className='col-span-2'>
                      <p className='text-sm text-gray-500'>Last Restocked</p>
                      <p>{new Date(item.date_added).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-8 text-gray-500'>
                No items found matching your criteria
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default InventoryTable
