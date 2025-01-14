"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./scheme";
import { createAuditLog } from "@/lib/creatte-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { incrementAvaibleCount, hasAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    const canCreate = await hasAvailableCount();
    const isPro = await checkSubscription()
    if(!canCreate && !isPro){
        return {
            error:"You have reaced your limit of free boards please upgrade to create more."
        }
    }

    const { title, image } = data;

    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName
    ] = image.split("|")

    console.log({
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageLinkHTML,
        imageUserName,
        imageFullUrl
    }, 'fsdfsd')


    if (!imageId || !imageThumbUrl || !imageLinkHTML || !imageUserName) {
        return {
            error: "Missing fields for create error!"
        }
    }

    let board;

    try {

        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageLinkHTML,
                imageUserName,
                imageFullUrl
            }
        })


        if(!isPro){
            await incrementAvaibleCount()
        }


        await createAuditLog({
            entityTitle: board.title,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.CREATE,
            entityId: board.id
        })


    } catch (error) {
        console.log('error', error)
        return {
            error: "Failed to create board"
        }
    }

    revalidatePath(`"/board/"${board.id}`);

    return { data: board }

}

export const createBoard = createSafeAction(CreateBoard, handler)