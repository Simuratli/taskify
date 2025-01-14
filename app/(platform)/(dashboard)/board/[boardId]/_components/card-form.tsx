import { FormSubmit } from '@/components/form/form-submit'
import { FormTextarea } from '@/components/form/form-textarea'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { useAction } from '@/hooks/use-actions'
import { createCard } from '@/actions/create-card'
import React, { forwardRef, KeyboardEventHandler, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'
import { toast } from 'sonner'

interface CardFormProps {
    listId: string,
    enableEditing: () => void,
    disableEditing: () => void,
    isEditing: boolean,
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(({ disableEditing, enableEditing, isEditing, listId }, ref) => {

    const params = useParams();
    const formRef = useRef<HTMLFormElement>(null as unknown as HTMLFormElement)

    const { execute, fieldErrors } = useAction(createCard, {
        onSuccess: (data) => {
            toast.success(`Card ${data.title} created!`);
            formRef.current.reset();
        },
        onError:(error)=>{
            toast.error(error)
        }
    })


    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            disableEditing()
        }
    }


    useOnClickOutside(formRef, disableEditing)
    useEventListener("keydown", onKeyDown);

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit()
        }
    }

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const listId = formData.get("listId") as string;
        const boardId = formData.get("boardId") as string;
        console.log({title,listId,boardId})
        execute({ title, listId, boardId })
    }

    if (isEditing) {
        return (
            <form action={onSubmit} ref={formRef} className='m-1 py-0.5 px-1 space-y-4'>
                <FormTextarea
                    id='title'
                    onKeyDown={onTextareaKeyDown}
                    ref={ref}
                    errors={fieldErrors}
                    placeholder='Enter a title for this card...'
                />
                <input hidden id="boardId" name="boardId" value={params.boardId} />
                <input hidden id="listId" name="listId" value={listId} />
                <div className='flex items-center gap-x-1'>
                    <FormSubmit>
                        Add Card
                    </FormSubmit>
                    <Button onClick={disableEditing} size="sm" variant="ghost">
                        <X className='h-5 w-5' />
                    </Button>
                </div>
            </form>
        )
    }

    return (
        <div className='pt-2 px-2'>
            <Button
                onClick={enableEditing}
                variant="ghost"
                className='h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm'

            >
                <Plus className='h-4 w-4' />
                Add a card
            </Button>
        </div>
    )
})

CardForm.displayName = 'CardForm'
