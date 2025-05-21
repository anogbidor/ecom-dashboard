type StatCardProps = {
  title: string
  value: string
  icon?: React.ReactNode
}

const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <div className='bg-white rounded-lg shadow p-4 sm:p-6 flex items-center gap-4 sm:gap-6'>
      {icon && (
        <div className='text-2xl sm:text-3xl text-gray-600' aria-hidden='true'>
          {icon}
        </div>
      )}
      <div className='flex-1'>
        <p className='text-gray-500 text-sm sm:text-base'>{title}</p>
        <h3 className='text-lg sm:text-xl font-bold text-gray-800'>{value}</h3>
      </div>
    </div>
  )
}

export default StatCard
