import { useEffect, useState } from 'react'
import AddCustomerModal from '../common/AddCustomerModal'
import DeleteCustomerModal from '../common/DeleteCustomerModal'
import {
  FiPlus,
  FiTrash2,

  FiCalendar,
  FiMail,
  FiMapPin,
  FiUser,
} from 'react-icons/fi'

export type Customer = {
  id: number
  name: string
  email: string
  location: string
  join_date: string
}

const CustomerTable = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  )
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    location: '',
    join_date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/customers')
        const data = await res.json()
        setCustomers(data)
      } catch (error) {
        console.error('Failed to fetch customers:', error)
      }
    }

    fetchCustomers()
  }, [])

  const handleAddCustomer = async () => {
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      })
      const data = await res.json()
      setCustomers([...customers, data])
      setIsAddModalOpen(false)
      setNewCustomer({
        name: '',
        email: '',
        location: '',
        join_date: new Date().toISOString().split('T')[0],
      })
    } catch (error) {
      console.error('Error adding customer:', error)
    }
  }

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return

    try {
      await fetch(`/api/customers/${selectedCustomer.id}`, {
        method: 'DELETE',
      })
      setCustomers(customers.filter((c) => c.id !== selectedCustomer.id))
      setIsDeleteModalOpen(false)
      setSelectedCustomer(null)
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }

  return (
    <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-gray-800'>
            Customer Management
          </h2>
          <p className='text-gray-500 mt-1'>
            {customers.length}{' '}
            {customers.length === 1 ? 'customer' : 'customers'} registered
          </p>
        </div>
        <div className='flex flex-col xs:flex-row gap-2 w-full sm:w-auto'>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className='flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm'
          >
            <FiPlus className='text-lg' />
            Add Customer
          </button>
          
        </div>
      </div>

      {/* Modals */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        newCustomer={newCustomer}
        setNewCustomer={setNewCustomer}
        onAdd={handleAddCustomer}
      />

      <DeleteCustomerModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        customerName={selectedCustomer?.name}
        onDelete={handleDeleteCustomer}
      />

      {/* Desktop Table */}
      <div className='hidden md:block overflow-x-auto rounded-lg border border-gray-200'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Customer
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Contact
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Location
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Member Since
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className='hover:bg-gray-50 transition-colors'
              >
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600'>
                      <FiUser className='text-lg' />
                    </div>
                    <div className='ml-4'>
                      <div className='text-sm font-medium text-gray-900'>
                        {customer.name}
                      </div>
                      <div className='text-sm text-gray-500'>
                        ID: {customer.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center gap-2 text-sm text-gray-900'>
                    <FiMail className='text-gray-400' />
                    {customer.email}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center gap-2 text-sm text-gray-900'>
                    <FiMapPin className='text-gray-400' />
                    {customer.location}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center gap-2 text-sm text-gray-900'>
                    <FiCalendar className='text-gray-400' />
                    {new Date(customer.join_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <button
                    onClick={() => {
                      setSelectedCustomer(customer)
                      setIsDeleteModalOpen(true)
                    }}
                    className='text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50 transition-colors'
                    title='Delete customer'
                  >
                    <FiTrash2 className='text-lg' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className='md:hidden space-y-3'>
        {customers.map((customer) => (
          <div
            key={customer.id}
            className='border border-gray-200 rounded-lg p-4 shadow-xs hover:shadow-sm transition-shadow bg-white'
          >
            <div className='flex justify-between items-start'>
              <div className='flex items-center gap-3'>
                <div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600'>
                  <FiUser className='text-lg' />
                </div>
                <div>
                  <h3 className='font-medium text-gray-900'>{customer.name}</h3>
                  <p className='text-sm text-gray-500'>ID: {customer.id}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedCustomer(customer)
                  setIsDeleteModalOpen(true)
                }}
                className='text-red-600 hover:text-red-800 p-1.5'
                title='Delete customer'
              >
                <FiTrash2 className='text-lg' />
              </button>
            </div>

            <div className='mt-4 space-y-2 text-sm'>
              <div className='flex items-center gap-2 text-gray-700'>
                <FiMail className='text-gray-400 flex-shrink-0' />
                <span>{customer.email}</span>
              </div>
              <div className='flex items-center gap-2 text-gray-700'>
                <FiMapPin className='text-gray-400 flex-shrink-0' />
                <span>{customer.location}</span>
              </div>
              <div className='flex items-center gap-2 text-gray-700'>
                <FiCalendar className='text-gray-400 flex-shrink-0' />
                <span>
                  {new Date(customer.join_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {customers.length === 0 && (
        <div className='text-center py-12'>
          <div className='mx-auto h-24 w-24 text-gray-400 mb-4'>
            <FiUser className='w-full h-full' />
          </div>
          <h3 className='text-lg font-medium text-gray-900'>
            No customers found
          </h3>
          <p className='mt-1 text-gray-500'>
            Get started by adding a new customer
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className='mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none'
          >
            Add Customer
          </button>
        </div>
      )}
    </div>
  )
}

export default CustomerTable
