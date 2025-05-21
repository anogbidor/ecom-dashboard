

const Navbar = () => {
  return (
    <nav className='h-16 bg-white shadow px-4 sm:px-6 flex items-center justify-between lg:ml-64 sticky top-0 z-10'>
      <h2 className='text-base sm:text-lg font-semibold text-gray-700'>
        Welcome back, Admin!
      </h2>
      <div className='flex items-center gap-3 text-xl'>
        <span role='img' aria-label='notifications'>
          🔔
        </span>
        <span role='img' aria-label='user'>
          👤
        </span>
      </div>
    </nav>
  )
}

export default Navbar
