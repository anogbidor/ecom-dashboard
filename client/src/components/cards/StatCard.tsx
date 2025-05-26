type StatCardProps = {
  title: string
  value: string
  icon?: React.ReactNode
}

const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <div className='bg-white rounded-lg shadow p-4 sm:p-6 flex items-center gap-3 sm:gap-5 w-full'>
      {icon && (
        <div className='text-xl sm:text-2xl text-gray-600' aria-hidden='true'>
          {icon}
        </div>
      )}
      <div className='flex-1 min-w-0'>
        <p className='text-gray-500 text-sm sm:text-base truncate'>{title}</p>
        <h3 className='text-base sm:text-lg font-bold text-gray-800 truncate'>
          {value}
        </h3>
      </div>
    </div>
  )
}

export default StatCard
