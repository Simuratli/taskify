"use client"

import { FormSubmit } from "@/components/form/form-submit"
import { FormTextarea } from "@/components/form/form-textarea"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CardWithList } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import { AlignLeft } from "lucide-react"
import { useParams } from "next/navigation"
import { useRef, useState } from "react"
import { useEventListener, useOnClickOutside } from "usehooks-ts"
import { useAction } from "@/hooks/use-actions"
import { updateCard } from "@/actions/update-card"
import { toast } from "sonner"

interface DescriptionPropTypes {
    data: CardWithList
}

export const Description = ({ data }: DescriptionPropTypes) => {
    const {execute,fieldErrors} = useAction(updateCard,{
        onSuccess:(data)=>{
            queryClient.invalidateQueries({
                queryKey:['card',data.id]
            })
            queryClient.invalidateQueries({
                queryKey:["card-logs",data.id]
            })
            toast.success(`Card ${data.title} updated`)
            disableEditing()
        },
        onError:(error)=>{
            toast.error(error)
        }
    })
    const queryClient = useQueryClient()
    const [isEditing, setIsEditing] = useState(false)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const formRef = useRef<HTMLFormElement>(null as unknown as HTMLFormElement);
    const params = useParams()


    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textAreaRef.current?.focus()
            textAreaRef.current?.select()
        });
    }


    const disableEditing = () => {
        setIsEditing(false)
    }


    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            disableEditing()
        }
    };

    useEventListener("keydown", onKeyDown)
    useOnClickOutside(formRef, disableEditing)


    const onSubmit = (formData: FormData) => {
        const description = formData.get('description') as string;
        const boardId = params.boardId as string;
        execute({description,boardId,id:data.id})
    }

    return (
        <div className="flex items-start gap-x-3 w-full">
            <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
            <div className="w-full">
                <p className="font-semibold  text-neutral-700 mb-2">Description</p>
                {
                    isEditing ? (
                        <form  ref={formRef} className="space-y-2" action={onSubmit}>
                            <FormTextarea
                                id="description"
                                errors={fieldErrors}
                                className="w-full mt-2"
                                defaultValue={data.description || undefined}
                                placeholder="Add a more detailed description..."
                            />
                            <div className="flex items-center gap-x-2">
                                <FormSubmit >
                                    Save
                                </FormSubmit>
                                <Button type="button" onClick={disableEditing} size="sm" variant="ghost">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div
                            role="button"
                            onClick={enableEditing}
                            className="min-h-[78px] bg-neutral-200 font-medium py-3 px-3.5 rounded-md"
                        >
                            {data.description || "Add a more detailed description.."}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

Description.Skeleton = function DescriptionSkeleton() {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className="h-6 w-6 bg-neutral-200" />
            <div className="w-full">
                <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
                <Skeleton className="w-full h-[78px] bg-neutral-200" />
            </div>
        </div>
    )
}