"use client"
import { useState,useEffect } from 'react'
import { useMobileSidebar } from '@/hooks/use-mobile-sidebar'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import Sidebar from './sidebar'

const MobileSidebar = () => {
    const pathname = usePathname()
    const { isOpen, onClose, onOpen } = useMobileSidebar()
    const [isMounted, setisMounted] = useState(false)
    
    useEffect(() => {
        setisMounted(true)
    }, [])


    useEffect(() => {
      onClose();
    }, [pathname, onClose])
    

    if(!isMounted) return null
    

    return (
        <>
            <Button onClick={onOpen} className='black mr-2 md:hidden' variant="ghost" >
                <Menu  className='h-4 w-4' />
            </Button>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent side="left" className='p-2 pt-1'>
                <SheetTitle>Menu</SheetTitle>
                    <Sidebar storageKey='t-sidebar-mobile-state' />
                </SheetContent>
            </Sheet>
        </>
    )
}

export default MobileSidebar
