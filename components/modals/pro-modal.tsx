"use client"
import React from 'react'
import { Dialog, DialogContent } from '../ui/dialog'
import { useProModal } from '@/hooks/use-pro-modal'
import Image from 'next/image'
import { Button } from '../ui/button'
import { useAction } from '@/hooks/use-actions'
import { stripeRedirect } from '@/actions/stripe-redirect'
import { toast } from 'sonner'

const ProModal = () => {
    const proModal = useProModal()
    const {execute,isLoading} = useAction(stripeRedirect,{
        onSuccess:(data)=>{
            window.location.href = data
        },
        onError:(error)=>{
            toast.error(error)
        }
    })


    const onClick = () => {
        execute({})
    }

    return (
        <Dialog
            open={proModal.isOpen}
            onOpenChange={proModal.onClose}
        >
            <DialogContent className='max-w-md p-0 overflow-hidden'>
                <div className='aspect-video items-center flex relative justify-center'>
                    <Image src="/hero.jpg" className='object-cover' alt="Hero" fill />
                </div>
                <div className='text-neutral-700 mx-auto space-y-6 p-6'>
                        <h2 className='font-semibold text-xl'>
                                Upgrate to Taskify Prop Today!
                        </h2>
                        <p className='text-xs font-semibold text-neutral-600'>Explore the best of Taskify</p>
                            <div className="pl-3">
                                <ul className='text-sm list-dist'>
                                    <li>Unlimited boards</li>
                                    <li>Advenced checklist</li>
                                    <li>Admin and security features</li>
                                    <li>And more!</li>
                                </ul>
                            </div>
                            <Button onClick={onClick} disabled={isLoading} className='w-full' variant={"primary"}>
                                Upgrade
                            </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProModal
