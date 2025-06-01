import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FiPlusSquare } from 'react-icons/fi'
import ProductConflictModal from './ProductConflictModal' // Import the modal



export interface ConflictData {
  show: boolean
  product: Product | null
}


interface Product {
  product_name: string
  sku: string
  price: number
  quantity_in_stock: number
  description: string
}
const AddProductForm = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    product_name: '',
    sku: '',
    price: '',
    quantity_in_stock: '',
    description: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [conflictData, setConflictData] = useState({
    show: false,
    product: null as Product | null,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const payload = {
      product_name: form.product_name.trim(),
      sku: form.sku.trim(),
      price: parseFloat(form.price) || 0,
      quantity_in_stock: parseInt(form.quantity_in_stock) || 0,
      description: form.description.trim(),
    }

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409 && data.existingProduct) {
          // 🎯 Friendly field-specific error message
          if (data.conflictField === 'product_name') {
            toast.error('A product with this name already exists.', {
              position: 'top-center',
            })
          } else if (data.conflictField === 'sku') {
            toast.error(
              'This SKU is already in use. Please use a unique SKU.',
              {
                position: 'top-center',
              }
            )
          } else {
            toast.error('Product conflict detected.', {
              position: 'top-center',
            })
          }

          // Still trigger modal to let user update instead
          setConflictData({ show: true, product: data.existingProduct })
          return
        }

        // Catch all other errors
        throw new Error(data.error || 'Failed to add product')
      }

      toast.success('Product added successfully!', {
        position: 'top-center',
        duration: 1000,
      })

      setTimeout(() => navigate('/inventory'), 1200)
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message, { position: 'top-center' })
      } else {
        toast.error('Unknown error occurred', { position: 'top-center' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
    >
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200'
      >
        {/* Header */}
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-3'>
            <span className='bg-blue-100 text-blue-600 p-2 rounded-lg'>
              <FiPlusSquare size={20} />
            </span>
            Add New Product
          </h2>
          <p className='mt-2 text-sm text-gray-500'>
            Fill out the form below to add a new product to your inventory
          </p>
        </div>

        {/* Form Fields */}
        <div className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Product Name <span className='text-red-500'>*</span>
            </label>
            <input
              name='product_name'
              value={form.product_name}
              onChange={handleChange}
              required
              placeholder='Enter product name'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              SKU <span className='text-red-500'>*</span>
            </label>
            <input
              name='sku'
              value={form.sku}
              onChange={handleChange}
              required
              placeholder='Enter SKU (e.g., ABC-123)'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
            />
            <p className='mt-1 text-xs text-gray-500'>
              Unique product identifier
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Price ($) <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
                  $
                </span>
                <input
                  name='price'
                  type='text'
                  inputMode='decimal'
                  value={form.price}
                  onChange={handleNumberChange}
                  required
                  placeholder='0.00'
                  className='w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                />
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Quantity <span className='text-red-500'>*</span>
              </label>
              <input
                name='quantity_in_stock'
                type='text'
                inputMode='numeric'
                value={form.quantity_in_stock}
                onChange={handleNumberChange}
                required
                placeholder='0'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Description
            </label>
            <textarea
              name='description'
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder='Enter product description (optional)'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className='mt-8'>
          <motion.button
            type='submit'
            disabled={submitting}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
            className={`w-full bg-teal-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors ${
              submitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? (
              <span className='flex items-center justify-center'>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
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
                Processing...
              </span>
            ) : (
              'Add Product'
            )}
          </motion.button>
        </div>
      </form>

      {/* Add Conflict Modal */}
      {conflictData.show && conflictData.product && (
        <ProductConflictModal
          product={conflictData.product}
          onClose={() => setConflictData({ show: false, product: null })}
          onUpdated={() => {
            setConflictData({ show: false, product: null })
            navigate('/inventory')
          }}
          userRole={'admin'} // Replace with actual user role from your auth context
        />
      )}
    </motion.div>
  )
}

export default AddProductForm
