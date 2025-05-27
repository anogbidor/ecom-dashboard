import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ConfirmModalProps = {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  dangerAction?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmModal = ({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  dangerAction = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <AnimatePresence>
      <div className='fixed inset-0 z-50 flex items-center justify-center'>
        {/* ⛱️ Blur and dim the background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black/10 backdrop-blur-md transition-opacity'
          onClick={onCancel}
        />

        {/* 📦 Modal card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className='relative z-10 mx-4 w-full max-w-md'
          role='dialog'
          aria-modal='true'
          aria-labelledby='modal-title'
          aria-describedby='modal-description'
        >
          <div className='bg-white/70 backdrop-blur-lg rounded-xl shadow-xl border border-white/30'>
            <div className='p-6 space-y-4'>
              <div className='text-center'>
                {dangerAction && (
                  <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 bg-opacity-80 mb-4'>
                    <svg
                      className='h-6 w-6 text-red-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                      />
                    </svg>
                  </div>
                )}
                <h3
                  id='modal-title'
                  className='text-lg font-semibold text-gray-900'
                >
                  {title}
                </h3>
                <p
                  id='modal-description'
                  className='text-gray-700 text-sm mt-2'
                >
                  {message}
                </p>
              </div>

              <div className='flex justify-center gap-3 mt-6'>
                <button
                  type='button'
                  onClick={onCancel}
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition'
                >
                  {cancelText}
                </button>
                <button
                  type='button'
                  onClick={onConfirm}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition ${
                    dangerAction
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ConfirmModal
