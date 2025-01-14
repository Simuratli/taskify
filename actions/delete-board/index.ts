"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/creatte-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { decreaseAvaibleCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = await auth();
    const isPro = checkSubscription()

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const { id } = data;
    let board;

    try {
        board = await db.board.delete({
            where: {
                id,
                orgId
            },
        })

        if (!isPro) {
            await decreaseAvaibleCount()
        }
        await createAuditLog({
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.DELETE,
            entityId: board.id
        })

    } catch (error) {
        return {
            error: "Faild to update!"
        }
    }

    revalidatePath(`/organization/${orgId}`)
    redirect(`/organization/${orgId}`)
}

export const deleteBoard = createSafeAction(DeleteBoard, handler);
