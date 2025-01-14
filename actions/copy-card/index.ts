"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyCard } from "./schema";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/creatte-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";


const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = await auth();


    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { id, boardId } = data;
    let card;

    try {
        const cartToCopy = await db.card.findUnique({
            where: {
                id,
                list: {
                    board: {
                        orgId
                    }
                }
            }
        })

        if(!cartToCopy){
            return {error:"Card not found"}
        }

        const lastCard = await db.card.findFirst({
            where:{listId:cartToCopy.listId},
            orderBy:{order:"desc"},
            select:{order:true}
        })

        const newOrder  = lastCard ? lastCard.order + 1 : 1;

        card = await db.card.create({
            data:{
                title:`${cartToCopy.title} - copy`,
                description:cartToCopy.description,
                order:newOrder,
                listId:cartToCopy.listId
            }
        })

        await createAuditLog({
            entityTitle:card.title,
            entityType:ENTITY_TYPE.CARD,
            action:ACTION.CREATE,
            entityId:card.id
        })

    } catch (error) {
        return {
            error: "Faild to copy!"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {
        data: card
    }
}

export const copyCard = createSafeAction(CopyCard, handler);
