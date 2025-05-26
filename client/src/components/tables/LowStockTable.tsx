import { useEffect, useState } from 'react'

type InventoryItem = {
  id: number
  product_name: string
  sku: string
  quantity_in_stock: number
  price: number
  date_added: string
}

const LowStockTable = () => {
  const [items, setItems] = useState<InventoryItem[]>([])

  useEffect(() => {
    const fetchInventory = async () => {
      const res = await fetch('/api/inventory')
      const data = await res.json()
      const lowStockItems = data.filter(
        (item: InventoryItem) => item.quantity_in_stock < 25
      )
      setItems(lowStockItems)
    }

    fetchInventory()
  }, [])

  if (!items.length)
    return <p className='text-sm text-gray-500'>No low stock items 🎉</p>

  return (
    <div className='bg-white p-4 rounded-lg shadow'>
      {/* ✅ Table view for desktop */}
      <div className='hidden md:block overflow-x-auto'>
        <table className='min-w-full text-sm text-left'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='py-2 px-4'>Product</th>
              <th className='py-2 px-4'>SKU</th>
              <th className='py-2 px-4'>Qty In Stock</th>
              <th className='py-2 px-4'>Last Restocked</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className='border-b hover:bg-gray-50'>
                <td className='py-2 px-4'>{item.product_name}</td>
                <td className='py-2 px-4'>{item.sku}</td>
                <td className='py-2 px-4 text-red-600 font-semibold'>
                  {item.quantity_in_stock} ⚠️
                </td>
                <td className='py-2 px-4'>
                  {new Date(item.date_added).toISOString().slice(0, 10)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Card view for mobile */}
      <div className='md:hidden space-y-4'>
        {items.map((item) => (
          <div
            key={item.id}
            className='border border-red-100 bg-red-50 rounded-lg p-4 shadow-sm'
          >
            <p>
              <span className='font-semibold'>Product:</span>{' '}
              {item.product_name}
            </p>
            <p>
              <span className='font-semibold'>SKU:</span> {item.sku}
            </p>
            <p>
              <span className='font-semibold'>Qty In Stock:</span>{' '}
              <span className='text-red-600 font-semibold'>
                {item.quantity_in_stock} ⚠️
              </span>
            </p>
            <p>
              <span className='font-semibold'>Last Restocked:</span>{' '}
              {new Date(item.date_added).toISOString().slice(0, 10)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LowStockTable
