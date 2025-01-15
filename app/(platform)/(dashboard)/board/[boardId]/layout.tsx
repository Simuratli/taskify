import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import BoardNavbar from '../../_components/board-navbar'

const BoardLayout = async ({
    children,
    params
}: {
    children: React.ReactNode,
    params: { boardId: string }
}) => {
    const { boardId } = params;  // Remove the await here
    const { orgId } = await auth();

    if (!orgId) {
        redirect("/select-org");
    }

    const board = await db.board.findUnique({
        where: {
            id: boardId,
            orgId
        }
    });

    if (!board) {
        notFound();
    }

    return (
        <div 
            className='relative h-full bg-no-repeat bg-cover bg-center'
            style={{ backgroundImage: `url(${board.imageFullUrl})` }}
        >
            <BoardNavbar data={board} />
            <div className='absolute inset-0 bg-black/10' />
            <main className='relative pt-28 h-full'>
                {children}
            </main>
        </div>
    )
}

export default BoardLayout