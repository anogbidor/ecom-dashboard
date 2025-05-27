import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiMail, FiMapPin, FiCalendar, FiX } from 'react-icons/fi'

interface CustomerData {
  name: string
  email: string
  location: string
  join_date: string
}

interface AddCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: () => void
  newCustomer: CustomerData
  setNewCustomer: (val: CustomerData) => void
}

const fieldConfig = [
  {
    key: 'name',
    label: 'Full Name',
    icon: FiUser,
    type: 'text',
    required: true,
  },
  {
    key: 'email',
    label: 'Email Address',
    icon: FiMail,
    type: 'email',
    required: true,
  },
  {
    key: 'location',
    label: 'Location',
    icon: FiMapPin,
    type: 'text',
    required: false,
  },
  {
    key: 'join_date',
    label: 'Join Date',
    icon: FiCalendar,
    type: 'date',
    required: false,
  },
] as const

const AddCustomerModal = ({
  isOpen,
  onClose,
  onAdd,
  newCustomer,
  setNewCustomer,
}: AddCustomerModalProps) => {
  const isFormValid = newCustomer.name && newCustomer.email

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 z-50 overflow-y-auto '
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className='fixed top-0 right-0 bottom-0 left-64  bg-transparent bg-opacity-40 backdrop-blur-md bg-opacity-30 flex items-center justify-center p-4'
            aria-hidden='true'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal container */}
          <div className='fixed inset-0 flex items-center justify-center p-4'>
            <motion.div
              className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className='flex justify-between items-start mb-6'>
                <motion.h2
                  className='text-2xl font-bold text-gray-900'
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Add New Customer
                </motion.h2>
                <motion.button
                  onClick={onClose}
                  className='text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100'
                  aria-label='Close'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiX className='h-5 w-5' />
                </motion.button>
              </div>

              <div className='space-y-5'>
                {fieldConfig.map(
                  ({ key, label, icon: Icon, type, required }, index) => (
                    <motion.div
                      key={key}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.15 + index * 0.05 }}
                    >
                      <label
                        htmlFor={key}
                        className='block text-sm font-medium text-gray-700 mb-1'
                      >
                        {label}
                        {required && (
                          <span className='text-red-500 ml-1'>*</span>
                        )}
                      </label>
                      <div className='relative rounded-md shadow-sm'>
                        <motion.div
                          className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'
                          whileHover={{ scale: 1.05 }}
                        >
                          <Icon className='h-5 w-5 text-gray-400' />
                        </motion.div>
                        <input
                          type={type}
                          id={key}
                          value={newCustomer[key]}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              [key]: e.target.value,
                            })
                          }
                          className={`block w-full pl-10 pr-3 py-2 border ${
                            required && !newCustomer[key]
                              ? 'border-red-300'
                              : 'border-gray-300'
                          } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          required={required}
                        />
                      </div>
                      {required && !newCustomer[key] && (
                        <motion.p
                          className='mt-1 text-sm text-red-600'
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          This field is required
                        </motion.p>
                      )}
                    </motion.div>
                  )
                )}
              </div>

              <motion.div
                className='mt-8 flex justify-end gap-3'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  type='button'
                  onClick={onClose}
                  className='px-4 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type='button'
                  onClick={onAdd}
                  disabled={!isFormValid}
                  className={`px-4 py-2.5 text-sm font-medium text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    !isFormValid
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  whileHover={
                    isFormValid ? { y: -2, backgroundColor: '#1d4ed8' } : {}
                  }
                  whileTap={{ scale: 0.98 }}
                >
                  Add Customer
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AddCustomerModal
