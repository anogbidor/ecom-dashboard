import { useEffect, useState } from 'react'

type Customer = {
  id: number
  name: string
  email: string
  location: string
  join_date: string
}

const CustomerTable = () => {
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await fetch('/api/customers')
      const data = await res.json()
      setCustomers(data)
    }

    fetchCustomers()
  }, [])

  return (
    <div className='bg-white p-4 rounded-lg shadow'>
      <h2 className='text-lg font-semibold mb-4'>Recent Customers</h2>

      {/* ✅ Desktop Table */}
      <div className='hidden md:block overflow-x-auto'>
        <table className='min-w-full text-sm text-left'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='py-2 px-4'>Name</th>
              <th className='py-2 px-4'>Email</th>
              <th className='py-2 px-4'>Location</th>
              <th className='py-2 px-4'>Join Date</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className='border-b hover:bg-gray-50'>
                <td className='py-2 px-4'>{customer.name}</td>
                <td className='py-2 px-4'>{customer.email}</td>
                <td className='py-2 px-4'>{customer.location}</td>
                <td className='py-2 px-4'>
                  {new Date(customer.join_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile Card Layout */}
      <div className='md:hidden space-y-4'>
        {customers.map((customer) => (
          <div
            key={customer.id}
            className='border border-gray-200 rounded-lg p-4 shadow-sm'
          >
            <p>
              <span className='font-semibold'>Name:</span> {customer.name}
            </p>
            <p>
              <span className='font-semibold'>Email:</span> {customer.email}
            </p>
            <p>
              <span className='font-semibold'>Location:</span>{' '}
              {customer.location}
            </p>
            <p>
              <span className='font-semibold'>Join Date:</span>{' '}
              {new Date(customer.join_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomerTable
