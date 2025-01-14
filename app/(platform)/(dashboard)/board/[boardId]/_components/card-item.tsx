import { Card } from '@prisma/client'
import { Draggable } from '@hello-pangea/dnd'
import React from 'react'
import { useCardModal } from '@/hooks/use-card-modal'

interface CardItemPropTypes {
    data: Card,
    index: number
}
const CardItem = ({ data, index }: CardItemPropTypes) => {
    const cardModal = useCardModal()
    return (
        <Draggable draggableId={data.id} index={index}>
            {
                (provided) => (
                    <div 
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps} 
                    ref={provided.innerRef} 
                    role='button' 
                    onClick={()=>cardModal.onOpen(data.id)}
                    className='truncate bg-white border-2 border-transparent hover:border-black py-2 px-3 text-sm rounded-md shadow-sm'>
                        {
                            data.title
                        }
                    </div>
                )
            }
        </Draggable>
    )
}

export default CardItem
