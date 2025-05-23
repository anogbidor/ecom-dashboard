import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlusSquare } from 'react-icons/fi'

const AddProductForm = () => {
  const [form, setForm] = useState({
    product_name: '',
    sku: '',
    price: '',
    quantity_in_stock: '',
    description: '',
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setSubmitting(true)

    const payload = {
      product_name: form.product_name.trim(),
      sku:
        form.sku ,
        
      price: parseFloat(form.price),
      quantity_in_stock: parseInt(form.quantity_in_stock),
      description: form.description.trim(),
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}

      if (!res.ok) throw new Error(data.error || 'Failed to add product')

      setMessage('✅ Product added successfully!')
      setForm({
        product_name: '',
        sku: '',
        price: '',
        quantity_in_stock: '',
        description: '',
      })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Unknown error occurred')
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
      className='max-w-2xl mx-auto'
    >
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-xl shadow-lg space-y-6 border border-gray-100'
      >
        <div className='border-b border-gray-200 pb-5'>
          <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
            <span className='bg-blue-100 text-blue-600 p-2 rounded-lg'>
              <FiPlusSquare />
            </span>
            Add New Product
          </h2>
          <p className='mt-2 text-sm text-gray-500'>
            Fill out the form below to add a new product to your inventory
          </p>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className='p-3 bg-green-50 text-green-700 rounded-lg flex items-start gap-2'
          >
            <svg
              className='w-5 h-5 mt-0.5 flex-shrink-0'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
            <span>{message}</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className='p-3 bg-red-50 text-red-700 rounded-lg flex items-start gap-2'
          >
            <svg
              className='w-5 h-5 mt-0.5 flex-shrink-0'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                clipRule='evenodd'
              />
            </svg>
            <span>{error}</span>
          </motion.div>
        )}

        <div className='space-y-5'>
          <div>
            <label
              htmlFor='product_name'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Product Name <span className='text-red-500'>*</span>
            </label>
            <input
              id='product_name'
              name='product_name'
              value={form.product_name}
              onChange={handleChange}
              required
              className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
              placeholder='Enter product name'
            />
          </div>

          <div>
            <label
              htmlFor='sku'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              SKU
            </label>
            <input
              id='sku'
              name='sku'
              value={form.sku}
              onChange={handleChange}
              placeholder='Enter sku'
              required
              className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
            />
            <p className='mt-1 text-xs text-gray-500'>Format: ABC-001</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div>
              <label
                htmlFor='price'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Price ($) <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                  $
                </span>
                <input
                  id='price'
                  name='price'
                  type='number'
                  step='0.01'
                  min='0'
                  value={form.price}
                  onChange={handleChange}
                  required
                  className='w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                  placeholder='0.00'
                />
              </div>
            </div>
            <div>
              <label
                htmlFor='quantity_in_stock'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Quantity <span className='text-red-500'>*</span>
              </label>
              <input
                id='quantity_in_stock'
                name='quantity_in_stock'
                type='number'
                min='0'
                value={form.quantity_in_stock}
                onChange={handleChange}
                required
                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                placeholder='0'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Description
            </label>
            <textarea
              id='description'
              name='description'
              value={form.description}
              onChange={handleChange}
              rows={4}
              className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
              placeholder='Enter product description (optional)'
            />
          </div>
        </div>

        <div className='pt-2'>
          <motion.button
            type='submit'
            disabled={submitting}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
            className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              submitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? (
              <span className='flex items-center justify-center gap-2'>
                <svg
                  className='w-5 h-5 animate-spin'
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
                Adding Product...
              </span>
            ) : (
              'Add Product'
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

export default AddProductForm
