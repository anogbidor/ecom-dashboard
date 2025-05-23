import { useState } from 'react'
import toast from 'react-hot-toast'
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

  const [submitting, setSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const payload = {
      product_name: form.product_name.trim(),
      sku: form.sku.trim(),
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

      toast.success('✅ Product added successfully!')
      setForm({
        product_name: '',
        sku: '',
        price: '',
        quantity_in_stock: '',
        description: '',
      })
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('❌ Unknown error occurred')
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

        {/* FORM FIELDS */}
        <div className='space-y-5'>
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
              className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
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
              placeholder='Enter SKU'
              className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            />
            <p className='mt-1 text-xs text-gray-500'>Format: ABC-001</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Price ($) <span className='text-red-500'>*</span>
              </label>
              <input
                name='price'
                type='number'
                step='0.01'
                min='0'
                value={form.price}
                onChange={handleChange}
                required
                placeholder='0.00'
                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Quantity <span className='text-red-500'>*</span>
              </label>
              <input
                name='quantity_in_stock'
                type='number'
                min='0'
                value={form.quantity_in_stock}
                onChange={handleChange}
                required
                placeholder='0'
                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
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
              className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>

        {/* SUBMIT */}
        <div className='pt-2'>
          <motion.button
            type='submit'
            disabled={submitting}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
            className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              submitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? 'Adding Product...' : 'Add Product'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

export default AddProductForm
