import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Sidebar />
      <div className='ml-64'>
        <Navbar />
        <main className='p-6'>{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
