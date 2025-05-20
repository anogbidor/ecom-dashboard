import React from 'react'

const Navbar = () => {
  return (
    <nav className='h-16 bg-white shadow px-6 flex items-center justify-between ml-64'>
      <h2 className='text-lg font-semibold'>Welcome back, Admin!</h2>
      <div className='flex items-center space-x-4'>
        <span>🔔</span>
        <span>👤</span>
      </div>
    </nav>
  )
}

export default Navbar
