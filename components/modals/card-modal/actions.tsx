"use client"
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CardWithList } from '@/types'
import { Copy, Trash } from 'lucide-react'
import React from 'react'
import { useAction } from '@/hooks/use-actions';
import { deleteCard } from '@/actions/delete-card'
import { copyCard } from '@/actions/copy-card'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'
import { useCardModal } from '@/hooks/use-card-modal'
interface ActionPropTypes {
    data: CardWithList
}

export const Actions = ({ data }: ActionPropTypes) => {
    const cardModal = useCardModal()
    const params = useParams()

    const { execute: executeCopyCard,isLoading:isLoadingCopy } = useAction(copyCard, {
        onSuccess: (data) => {
            toast.success(`Card "${data.title}" copied.`)
            cardModal.onClose()
        },
        onError: (error) => {
            toast.error(error)
            cardModal.onClose()
        }
    })

    const { execute: executeDeleteCard,isLoading:isLoadingDelete} = useAction(deleteCard, {
        onSuccess: (data) => {
            toast.success(`Card "${data.title}" deleted. `)
            cardModal.onClose()
        },
        onError: (error) => {
            toast.error(error)
            cardModal.onClose()
        }
    })


    const onCopy = () => {
        const boardId = params.boardId as string;
        executeCopyCard({boardId,id:data.id})
    }

    
    const onDelete = () => {
        const boardId = params.boardId as string;
        executeDeleteCard({boardId,id:data.id})
    }

    return (
        <div className='space-y-2 mt-2'>
            <p className='text-sm font-semibold'>Actions</p>
            <Button disabled={isLoadingCopy} onClick={onCopy} size={"inline"} variant="gray" className='w-full justify-start'>
                Copy <Copy className='h-4 w-4 mr-2' />
            </Button>
            <Button onClick={onDelete} disabled={isLoadingDelete} size={"inline"} variant="gray" className='w-full justify-start'>
                Delete <Trash className='h-4 w-4 mr-2' />
            </Button>
        </div>
    )
}

Actions.Skeleton = function ActionSkeleton() {
    return (
        <div className='space-y-2 mt-2 '>
            <Skeleton className='w-20 h-4 bg-neutral-200' />
            <Skeleton className='w-full h-8 bg-neutral-200' />
            <Skeleton className='w-full h-8 bg-neutral-200' />
        </div>
    )
}