import Navbar from './_components/navbar'
import React from 'react'

const OrganizationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-full'>
      <Navbar />
      {children}
    </div>
  )
}

export default OrganizationLayout
