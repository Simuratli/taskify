"use client";
import { ListWithCards } from '@/types';
import { List } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import ListForm from './list-form';
import ListItem from './list-item';
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { useAction } from '@/hooks/use-actions';
import { updateListOrder } from '@/actions/update-list-order';
import { updateCardOrder } from '@/actions/update-card-order';
import { toast } from 'sonner';

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

const ListContainer = ({ boardId, data }: ListContainerProps) => {
  const {execute:executeUpdateListOrder} = useAction(updateListOrder,{
    onSuccess:(data)=>{
      toast.success("List reordered")
    },
    onError:(error)=>{
      toast.error(error)
    }
  })

  const {execute:executeUpdateCardOrder} = useAction(updateCardOrder,{
    onSuccess:(data)=>{
      toast.success("Card reordered")
    },
    onError:(error)=>{
      toast.error(error)
    }
  })
  const [orderedData, setOrderedData] = useState<ListWithCards[]>([])

  useEffect(() => {
    setOrderedData(data)
  }, [data])


  function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed)

    return result;
  }



  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if(!destination) {
      return
    }


    //if dropped in same position
    if(destination.droppableId === source.droppableId && destination.index === source.index){
      return 
    }

    // user move list
    if(type === "list"){
      const items = reorder(orderedData,source.index,destination.index).map((item,index)=>({...item,order:index}))
    
      setOrderedData(items);
      executeUpdateListOrder({items,boardId});
    }


    // if user move card 
    if(type==="card"){
      let newOrderedData = [...orderedData];

      const sourceList = newOrderedData.find(list=>list.id === source.droppableId);
      const destList = newOrderedData.find(list=>list.id === destination.droppableId);

      if(!sourceList || !destList){
        return
      }

      //check if card exist in sourcelist
      if(!sourceList.cards){
        sourceList.cards = []
      }

      // check if cards exist on destinatio list
      if(!destList.cards){
        destList.cards = []
      }


      // moving the card in tghe same list

      if(source.droppableId === destination.droppableId){
        const reorderCards = reorder(sourceList.cards,source.index,destination.index);
        

        reorderCards.forEach((card,idx)=>{
          card.order = idx;
        })

        sourceList.cards = reorderCards;
     
        setOrderedData(newOrderedData);
        executeUpdateCardOrder({boardId:boardId,items:reorderCards})
        // user moves to caard to another list
      }else{
        // remove card from source list 
        const [movedCard] = sourceList.cards.splice(source.index,1);

        // assign new list id to new  CARD
        movedCard.listId = destination.droppableId;
        // add card to destination liost
        destList.cards.splice(destination.index,0,movedCard);
        
        sourceList.cards.forEach((card,idx)=>{
            card.order = idx
        })

        // update order for eact card ion destination list

        destList.cards.forEach((card,idx)=>{
          card.order = idx;
          
        })
        setOrderedData(newOrderedData)
        executeUpdateCardOrder({boardId:boardId,items:destList.cards})
        
      }


    }


  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='lists' type='list' direction='horizontal'>
        {
          (provided) => (
            <ol
              {...provided.droppableProps}
              ref={provided.innerRef}
              className='flex gap-x-3 h-full'
            >
              {
                orderedData && orderedData.map((list, index) => {
                  return <ListItem
                    key={list.id}
                    data={list}
                    index={index}

                  />
                })
              }
              {provided.placeholder}
              <ListForm />
              <div className='flex-shrink-0 w-1'></div>
            </ol>
          )
        }

      </Droppable>
    </DragDropContext>

  )
}

export default ListContainer
