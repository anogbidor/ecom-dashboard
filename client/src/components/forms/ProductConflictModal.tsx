import { useState } from 'react'
import toast from 'react-hot-toast'

export interface Product {
  product_name: string
  sku: string
  price: number
  quantity_in_stock: number
  description?: string
  date_added?: string
}

export interface ProductConflictModalProps {
  product: Product
  onClose: () => void
  onUpdated: () => void
  userRole: string
}

const ProductConflictModal = ({
  product,
  onClose,
  onUpdated,
  userRole,
}: ProductConflictModalProps) => {
  const [quantity, setQuantity] = useState(1)
  const [isIncrement, setIsIncrement] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const calculateNewQuantity = () => {
    return isIncrement 
      ? product.quantity_in_stock + quantity 
      : Math.max(0, product.quantity_in_stock - quantity)
  }

  const handleUpdate = async () => {
    setUpdating(true)
    setIsLoading(true)
    try {
      const newQuantity = calculateNewQuantity()

      // Modern loading state with staggered skeleton animation
      await Promise.all([
        new Promise(resolve => setTimeout(resolve, 2000)),
        ...Array(3).fill(0).map((_, i) => 
          new Promise(resolve => setTimeout(resolve, i * 300))
        )
      ])

      const res = await fetch('/api/inventory/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: product.product_name,
          sku: product.sku,
          price: product.price,
          quantity_in_stock: newQuantity,
          description: product.description || '',
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update product')
      }

      toast.success(`Product ${isIncrement ? 'incremented' : 'decremented'} successfully`)
      onUpdated()
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('An unknown error occurred')
      }
    } finally {
      setUpdating(false)
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setIsLoading(true)
    try {
      // Modern loading with staggered effects
      await Promise.all([
        new Promise(resolve => setTimeout(resolve, 2000)),
        ...Array(4).fill(0).map((_, i) => 
          new Promise(resolve => setTimeout(resolve, i * 250))
        )
      ])

      const res = await fetch(
        `/api/inventory/${encodeURIComponent(product.product_name)}`,
        { method: 'DELETE' }
      )

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to delete product')
      }

      toast.success('Product deleted successfully')
      onUpdated()
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('An unknown error occurred')
      }
    } finally {
      setDeleting(false)
      setIsLoading(false)
    }
  }

  const renderSkeletonLoader = () => (
    <div className='absolute inset-0 bg-white bg-opacity-90 rounded-lg flex flex-col p-6'>
      <div className='flex justify-between mb-6'>
        <div className='h-8 w-40 bg-gray-200 rounded animate-pulse'></div>
        <div className='h-8 w-8 bg-gray-200 rounded-full animate-pulse'></div>
      </div>

      <div className='space-y-4 mb-6'>
        {[...Array(3)].map((_, i) => {
          const delay1 = { animationDelay: `${i * 0.1}s` }
          const delay2 = { animationDelay: `${i * 0.1 + 0.1}s` }
          return (
            <div key={i} className='space-y-2'>
              <div
                className='h-4 w-24 bg-gray-200 rounded animate-pulse'
                style={delay1}
                aria-hidden='true'
              ></div>
              <div
                className='h-4 w-full bg-gray-200 rounded animate-pulse'
                style={delay2}
                aria-hidden='true'
              ></div>
            </div>
          )
        })}
      </div>

      <div className='mt-auto flex justify-end space-x-3'>
        {[...Array(3)].map((_, i) => {
          const delay = { animationDelay: `${i * 0.15}s` }
          return (
            <div
              key={i}
              className='h-10 w-24 bg-gray-200 rounded animate-pulse'
              style={delay}
              aria-hidden='true'
            ></div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className='fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md relative min-h-[300px]'>
        {isLoading && renderSkeletonLoader()}
        
        <div className={`${isLoading ? 'opacity-30 pointer-events-none' : ''}`}>
          <div className='flex justify-between items-start mb-4'>
            <h2 className='text-xl font-semibold'>Inventory Adjustment</h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className='text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors'
            >
              &times;
            </button>
          </div>

          <div className='mb-6 space-y-3'>
            <div className='p-3 bg-gray-50 rounded-lg'>
              <p className='text-sm text-gray-500'>Product Name</p>
              <p className='font-medium'>{product.product_name}</p>
            </div>
            
            <div className='p-3 bg-gray-50 rounded-lg'>
              <p className='text-sm text-gray-500'>SKU</p>
              <p className='font-medium'>{product.sku}</p>
            </div>
            
            <div className='p-3 bg-gray-50 rounded-lg'>
              <p className='text-sm text-gray-500'>Current Quantity</p>
              <p className='font-medium'>{product.quantity_in_stock}</p>
            </div>
          </div>

          <div className='mb-6'>
            <div className="flex items-center mb-3 space-x-4">
              <button
                onClick={() => setIsIncrement(true)}
                className={`px-3 py-1 rounded-l-md transition-colors ${
                  isIncrement 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Increment
              </button>
              <button
                onClick={() => setIsIncrement(false)}
                className={`px-3 py-1 rounded-r-md transition-colors ${
                  !isIncrement 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Decrement
              </button>
            </div>
            
            <label htmlFor='quantity' className='block mb-2 text-sm font-medium text-gray-700'>
              Quantity to {isIncrement ? 'Add' : 'Remove'}
            </label>
            <div className="flex">
              <input
                type='number'
                id='quantity'
                min='1'
                max={!isIncrement ? product.quantity_in_stock : undefined}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)) || 1)}
                disabled={isLoading}
                className='w-full p-2 border rounded-l disabled:opacity-50'
              />
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                disabled={quantity <= 1 || isLoading}
                className="px-3 border-t border-b border-r disabled:opacity-50 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                -
              </button>
              <button 
                onClick={() => setQuantity(q => q + 1)} 
                disabled={(!isIncrement && quantity >= product.quantity_in_stock) || isLoading}
                className="px-3 border rounded-r disabled:opacity-50 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
            <p className='mt-2 text-sm text-gray-500'>
              New quantity will be: <span className="font-medium">{calculateNewQuantity()}</span>
            </p>
          </div>

          <div className='flex justify-end space-x-3'>
            {userRole === 'admin' && (
              <button
                onClick={handleDelete}
                disabled={deleting || isLoading}
                className={`px-4 py-2 rounded-md text-white flex items-center justify-center transition-all ${
                  deleting || isLoading
                    ? 'bg-red-400'
                    : 'bg-red-600 hover:bg-red-700 shadow-sm'
                }`}
              >
                {deleting ? (
                  <>
                    <svg
                      className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete Product'
                )}
              </button>
            )}
            <button
              onClick={handleUpdate}
              disabled={updating || isLoading || (!isIncrement && quantity > product.quantity_in_stock)}
              className={`px-4 py-2 rounded-md text-white flex items-center justify-center transition-all ${
                updating || isLoading
                  ? 'bg-blue-400'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
              }`}
            >
              {updating ? (
                <>
                  <svg
                    className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  {isIncrement ? 'Incrementing...' : 'Decrementing...'}
                </>
              ) : (
                `${isIncrement ? 'Increment' : 'Decrement'} Quantity`
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className='px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 transition-colors shadow-sm'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductConflictModal