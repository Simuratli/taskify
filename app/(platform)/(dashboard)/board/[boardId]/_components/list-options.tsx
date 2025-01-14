import { List } from '@prisma/client'
import React, { useRef } from 'react'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { MoreHorizontal, X } from 'lucide-react'
import { FormSubmit } from '@/components/form/form-submit'
import { Separator } from '@/components/ui/separator'
import { useAction } from '@/hooks/use-actions'
import { deleteList } from '@/actions/delete-list'
import { toast } from 'sonner'
import { copyList } from '@/actions/copy-list'

interface ListOptionsProps {
    data: List,
    onAddCard: () => void,
}



const ListOptions = ({ data, onAddCard }: ListOptionsProps) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    const {execute:executeDeleteList} = useAction(deleteList, {
        onSuccess: (data) => {
            closeRef.current?.click();
            toast.success(`List "${data.title}" successfully`);
        }
    })

    const {execute:executeCopyList} = useAction(copyList, {
        onSuccess: (data) => {
            closeRef.current?.click();
            toast.success(`List "${data.title}" copied`);
        }
    })
    
    
    const onDelete = (formData: FormData) => {
        const id = formData.get('id') as string;
        const boardId = formData.get('boardId') as string;
        executeDeleteList({id, boardId})
    }

    const onCopy = (formData: FormData) => {
        const id = formData.get('id') as string;
        const boardId = formData.get('boardId') as string;
        executeCopyList({id, boardId})
    }


    
    return (
        <Popover>
            <PopoverTrigger>
                <Button asChild className='h-auto w-auto p-2' variant="ghost">
                    <MoreHorizontal className='h-4 w-4' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='px-0 pt-3 pb-3 ' align='start' side='bottom'>
                <div className='text-sm font-medium text-center text-neutral-600 pb-4'>
                    List Actions
                </div>
                <PopoverClose ref={closeRef} asChild>
                    <Button variant="ghost" className='h-auto w-auto p-2 absolute top-2 right-2'>
                        <X className='h-4 w-4' />
                    </Button>
                </PopoverClose>
                <Button
                    onClick={() => { }}
                    variant="ghost"
                    className='rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm'
                >
                    Add Card...
                </Button>
                <form action={onCopy}>
                    <input hidden name="id" id="id" value={data.id} />
                    <input hidden name="boardId" id="boardId" value={data.boardId} />
                    <FormSubmit variant='ghost' className='rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm'>
                        Copy List...
                    </FormSubmit>
                </form>
                <Separator />
                <form action={onDelete}>
                    <input hidden name="id" id="id" value={data.id} />
                    <input hidden name="boardId" id="boardId" value={data.boardId} />
                    <FormSubmit variant='ghost' className='rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm'>
                        Delete List...
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}

export default ListOptions
