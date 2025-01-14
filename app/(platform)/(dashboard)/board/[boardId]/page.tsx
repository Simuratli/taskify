import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import ListContainer from './_components/list-container'

interface BoardIdPageProps {
  params: { boardId: string }
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const boardId = (await params)?.boardId
  const { orgId } = await auth()

  if(!orgId){
    redirect('/select-org')
  }


  const lists = await db.list.findMany({
    where:{
      boardId:boardId,
      board:{
        orgId
      }
    },
    include:{
      cards:{
        orderBy:{
          order:'asc'
        }
      }
    },
    orderBy:{
      order:'asc'
    }
  })

  const listsWithCards = lists.map(list => ({
    ...list,
    card: list.cards
  }));

  return (
    <div className='p-4 h-full overflow-x-auto'>
      <ListContainer
        boardId={boardId}
        data={listsWithCards}
      />
    </div>
  )
}

export default BoardIdPage
