import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FiDollarSign } from 'react-icons/fi'

interface InventoryItem {
  id: number
  product_name: string
  sku: string
  quantity_in_stock: number
  price: number
  date_added: string
}

const AddSaleForm = () => {
  const [products, setProducts] = useState<InventoryItem[]>([])
  const [form, setForm] = useState({
    product_name: '',
    quantity: '',
    total_price: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/inventory')
        const data = await res.json()
        setProducts(data)
      } catch {
        toast.error('Failed to fetch products')
      }
    }
    fetchProducts()
  }, [])

  // Auto-calculate total_price
  useEffect(() => {
    const selected = products.find((p) => p.product_name === form.product_name)
    const qty = parseInt(form.quantity)
    if (selected && !isNaN(qty)) {
      const total = (selected.price * qty).toFixed(2)
      setForm((prev) => ({ ...prev, total_price: total }))
    } else {
      setForm((prev) => ({ ...prev, total_price: '' }))
    }
  }, [form.product_name, form.quantity, products])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const payload = {
      product_name: form.product_name.trim(),
      quantity: parseInt(form.quantity),
      total_price: parseFloat(form.total_price),
    }

    if (
      !payload.product_name ||
      isNaN(payload.quantity) ||
      isNaN(payload.total_price)
    ) {
      setError('Please fill out all fields correctly.')
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const text = await res.text()
      const data = text ? JSON.parse(text) : {}

      if (!res.ok) throw new Error(data.error || 'Failed to record sale')

      toast.success(' Sale recorded successfully!')
      setForm({ product_name: '', quantity: '', total_price: '' })
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Unknown error occurred')
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
          <h2 className='text-2xl font-semibold text-gray-900 flex items-center gap-2'>
            <span className='bg-blue-100 text-blue-600 p-2 rounded-lg'>
              <FiDollarSign />
            </span>
            Record New Sale
          </h2>
          <p className='mt-2 text-sm text-gray-500'>
            Fill out the form below to record a new sale
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className='p-3 bg-red-50 text-red-700 rounded-lg'
          >
            {error}
          </motion.div>
        )}

        <div className='space-y-4'>
          <div>
            <label
              htmlFor='product_name'
              className='block text-sm font-medium text-gray-700'
            >
              Product
            </label>
            <select
              id='product_name'
              name='product_name'
              value={form.product_name}
              onChange={handleChange}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>-- Select a product --</option>
              {products.map((item) => (
                <option key={item.id} value={item.product_name}>
                  {item.product_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor='quantity'
              className='block text-sm font-medium text-gray-700'
            >
              Quantity
            </label>
            <input
              id='quantity'
              name='quantity'
              type='number'
              min='1'
              value={form.quantity}
              onChange={handleChange}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label
              htmlFor='total_price'
              className='block text-sm font-medium text-gray-700'
            >
              Total Price ($)
            </label>
            <input
              id='total_price'
              name='total_price'
              type='number'
              step='0.01'
              value={form.total_price}
              readOnly
              className='w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed'
            />
          </div>
        </div>

        <motion.button
          type='submit'
          whileTap={{ scale: 0.97 }}
          disabled={submitting}
          className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            submitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {submitting ? 'Submitting...' : 'Add Sale'}
        </motion.button>
      </form>
    </motion.div>
  )
}

export default AddSaleForm
