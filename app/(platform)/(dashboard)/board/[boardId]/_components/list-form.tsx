"use client"
import React, { RefObject } from 'react'
import ListWrapper from './list-wrapper'
import {  Plus, X } from 'lucide-react'
import { useState, useRef } from 'react'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'
import { FormInput } from '@/components/form/form-input'
import { useParams, useRouter } from 'next/navigation'
import { FormSubmit } from '@/components/form/form-submit'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/use-actions'
import { createList } from '@/actions/create-list'
import { toast } from 'sonner'
import { revalidatePath } from 'next/cache'

const ListForm = () => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef<HTMLFormElement>(null) as RefObject<HTMLFormElement>;
    const inputRef = useRef<HTMLInputElement>(null);
    const {execute,fieldErrors} = useAction(createList,{
        onSuccess: (data) => {
            toast.success(`List "${data.title}" successfully!`)
            disableEditing();
        },
        onError: (error) => {
            toast.error(error)
        }
    });
    const params = useParams();


    const onSubmit = (formData: FormData) => {
        const title = formData.get('title') as string;
        const boardId = formData.get('boardId') as string;
        execute({title,boardId})
    }

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
        });
    }


    const disableEditing = () => {
        setIsEditing(false)
    }


    const onKeyDown = (e: KeyboardEvent) => {
        if(e.key === 'Escape'){
            disableEditing()
        }
    }

    useEventListener('keydown', onKeyDown);
    useOnClickOutside(formRef, disableEditing);

    if(isEditing){
        return(
            <ListWrapper>
                <form 
                    action={onSubmit}
                    ref={formRef}
                    className='w-full p-3 rounded-md bg-white space-y-4 shadow-md'
                >
                    <FormInput
                        ref={inputRef}
                        errors={fieldErrors}
                        id='title'
                        placeholder='Enter list title...'
                        className='text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition'
                    />
                    <input hidden value={params.boardId} name="boardId" />
                    <div className='flex items-center gap-x-1'>
                        <FormSubmit>
                            Add List
                        </FormSubmit>
                        <Button onClick={disableEditing} size="sm" variant='ghost'>
                                <X className='h-5 w-5'/>
                        </Button>
                    </div>
                </form>
            </ListWrapper>
        )
    }

    return (
        <ListWrapper>
            <form className='w-full p-0 rounded-md bg-white space-y-4 shadow-md'>
                <button onClick={enableEditing} className='w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm'>
                    <Plus className='h-4 w-4 mr-2' />
                    Add a list
                </button>
            </form>
        </ListWrapper>
    )
}

export default ListForm
