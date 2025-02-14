import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import localFont from 'next/font/local'
import { cn } from '@/lib/utils'


const headingFont = localFont({
    src:"../public/fonts/CalSans-SemiBold.woff2"
})

const Logo = () => {
  return (
    <Link href='/'>
        <div className='hover:opacity-75 transition items-center gap-x-2 hidden md:flex'>
            <Image
                src="/images/logo.svg"
                alt='Logo'
                height={30}
                width={30}
            />
            <p className={cn('text-lg pt-1 text-neutral-700 ',headingFont.className)}>
                Taskify
            </p>
        </div>
    </Link>
  )
}

export default Logo
