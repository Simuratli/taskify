import {z} from 'zod';

export type FieldErrors<T> = {
    [K in keyof T]?: string[];
};

export type ActionState<TInput, TOutput> = {
    fieldErrors?: FieldErrors<TInput>;
    error?:string | null;
    data?: TOutput;
}

export const createSafeAction = <TInput, TOutput>(
    schema:z.Schema<TInput>,
    handler:(validatedData:TInput) => Promise<ActionState<TInput, TOutput>>
)=> {
    return async (data:TInput):Promise<ActionState<TInput, TOutput>> => {
        const validateionResult = schema.safeParse(data);
        if(!validateionResult.success){
            return {
                fieldErrors: validateionResult.error.flatten().fieldErrors as FieldErrors<TInput>
            };
        }

        return handler(validateionResult.data);
    }
}