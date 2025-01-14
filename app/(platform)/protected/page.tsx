"use client"
import { useAuth, UserButton, useUser } from '@clerk/nextjs'
import React from 'react'

const Prot =  () => {
    const {userId} = useAuth()
    const {user} = useUser()
  return (
    <div>
        <UserButton />
    </div>
  )
}

export default Prot
