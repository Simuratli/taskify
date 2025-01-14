"use client"
import { FormInput } from '@/components/form/form-input'
import { useAction } from '@/hooks/use-actions'
import { List } from '@prisma/client'
import React, { RefObject, useRef, useState } from 'react'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'
import { updateList } from '@/actions/update-list'
import { toast } from 'sonner'
import ListOptions from './list-options'
interface ListHeaderProps {
    data: List,
    onAddCard: () => void,
}

const ListHeader = ({ data , onAddCard }: ListHeaderProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null) as RefObject<HTMLFormElement>;

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(data.title)


    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select()
        });
    }

    const disableEditing = () => {
        setIsEditing(false)
    }


    const { execute, fieldErrors } = useAction(updateList, {
        onSuccess: (data) => {
            toast.success(`Renamed to ${data.title}`)
            setTitle(data.title);
            disableEditing()
        },
        onError: (error) => {
            toast.error(error)
        }
    })


    const handleSubmit = (formData: FormData) => {
        const title = formData.get('title') as string;
        const id = formData.get('id') as string;
        const boardId = formData.get('boardId') as string;

        if (title === data.title) {
            return disableEditing()
        }
        execute({ title, id, boardId })
    }

    const onBlur = () => {
        formRef.current?.requestSubmit();
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            formRef.current?.requestSubmit();
        }
    }

    useEventListener('keydown', onKeyDown)
    // useOnClickOutside(formRef, disableEditing)


    return (
        <div className='pt-2 px-2 text-sm font-semibold flex justify-between gap-x-2'>
            {
                isEditing ? (
                    <form
                        className='flex-1 px-[2px]'
                        action={handleSubmit}
                    >
                        <input hidden id="id" name='id' value={data.id} />
                        <input hidden id="boardId" name='boardId' value={data.boardId} />
                        <FormInput
                            ref={inputRef}
                            errors={fieldErrors}
                            onBlur={onBlur}
                            id="title"
                            placeholder='Enter list title...'
                            defaultValue='title'
                            className='text-sm px-[7px] py-1 font-medium bg-transparent focus:bg-white border-transparent hover:border-input focus:border-input transition truncate'
                        />
                        <button  type='submit' hidden />
                    </form>
                ) : (
                    <div onClick={enableEditing} className='w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent'>
                        {title}
                    </div>
                )
            }

            <ListOptions
                data={data}
                onAddCard={onAddCard}
            />

        </div>
    )
}

export default ListHeader
