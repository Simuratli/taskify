"use client"
import React, { ElementRef, useRef } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose
} from "@/components/ui/popover"
import { useAction } from '@/hooks/use-actions'
import { createBoard } from '@/actions/create-board'
import { FormInput } from './form-input'
import { FormSubmit } from './form-submit'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import FormPicker from './form-picker'
import { useRouter } from 'next/navigation'
import { useProModal } from '@/hooks/use-pro-modal'


interface FormPopoverProps {
    children: React.ReactNode,
    side?: 'top' | 'bottom' | 'left' | 'right',
    align?: 'start' | 'center' | 'end',
    sideOffset?: number,
}

const FormPopover = ({ children, align, side = "bottom", sideOffset = 0 }: FormPopoverProps) => {
    const closeRef = useRef<ElementRef<"button">>(null);
    const router = useRouter();
    const proModal = useProModal()
    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => { closeRef.current?.click(), toast.success('Board created'), router.push(`/board/${data.id}`) },
        onError: (error) => { toast.error(error), proModal.onOpen()}
    })


    const onSubmit = (formData: FormData) => {
        const title = formData.get('title') as string;
        const image = formData.get('image') as string;
        execute({ title, image });

    }
    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent side={side} align={align} sideOffset={sideOffset} className='w-80 pt-3'>
                <div className='text-sm font-medium text-center text-neutral-600 pb-4'>
                    Create Board
                </div>
                <PopoverClose ref={closeRef} asChild>
                    <Button variant="ghost" className=' h-auto w-auto p-2 absolute top-2 right-2'>
                        <X className='h-4 w-4' />
                    </Button>
                </PopoverClose>

                <form className='space-y-4' action={onSubmit}>
                    <div className='space-y-4'>
                        <FormPicker
                            id='image'
                            errors={fieldErrors}
                        />
                        <FormInput
                            id='title'
                            label="Board title"
                            type="text"
                            errors={fieldErrors}
                        />
                        <FormSubmit className='w-full'>
                            Create
                        </FormSubmit>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    )
}

export default FormPopover
