import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertTriangle, FiX, FiTrash2 } from 'react-icons/fi'

interface DeleteCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  customerName?: string
}

const DeleteCustomerModal = ({
  isOpen,
  onClose,
  onDelete,
  customerName,
}: DeleteCustomerModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 z-50 overflow-y-auto'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className='fixed inset-0 bg-black/30 backdrop-blur-sm'
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
              <div className='flex justify-between items-start mb-4'>
                <div className='flex items-center gap-3'>
                  <motion.div
                    className='p-2 rounded-full bg-red-100 text-red-600'
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <FiAlertTriangle className='h-5 w-5' />
                  </motion.div>
                  <motion.h2
                    className='text-xl font-bold text-gray-900'
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    Confirm Deletion
                  </motion.h2>
                </div>
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

              <motion.div
                className='mt-4'
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className='text-gray-600'>
                  Are you sure you want to permanently delete{' '}
                  <span className='font-semibold text-gray-900'>
                    {customerName || 'this customer'}
                  </span>
                  ? This action cannot be undone and all associated data will be
                  lost.
                </p>
              </motion.div>

              <motion.div
                className='mt-8 flex justify-end gap-3'
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <motion.button
                  type='button'
                  onClick={onClose}
                  className='px-4 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type='button'
                  onClick={onDelete}
                  className='inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                  whileHover={{ y: -1, backgroundColor: '#b91c1c' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiTrash2 className='mr-2 h-4 w-4' />
                  Delete Permanently
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DeleteCustomerModal
