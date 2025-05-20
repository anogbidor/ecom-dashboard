type StatCardProps = {
  title: string
  value: string
  icon?: React.ReactNode
}

const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <div className='bg-white rounded-lg shadow p-4 flex items-center space-x-4'>
      {icon && <div className='text-3xl'>{icon}</div>}
      <div>
        <p className='text-gray-500 text-sm'>{title}</p>
        <h3 className='text-xl font-bold'>{value}</h3>
      </div>
    </div>
  )
}

export default StatCard
