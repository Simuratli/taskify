"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCard } from "./schema";
import { createAuditLog } from "@/lib/creatte-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";


const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = await auth();


    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { id, boardId, ...values } = data;
    let card;

    try {
        card = await db.card.update({
            where: {
                id,
                list: {
                    board: {
                        orgId
                    }
                }
            },
            data: {
                ...values
            }
        })

        await createAuditLog({
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.UPDATE,
            entityId: card.id
        })

    } catch (error) {
        return {
            error: "Faild to update!"
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {
        data: card
    }
}

export const updateCard = createSafeAction(UpdateCard, handler);
