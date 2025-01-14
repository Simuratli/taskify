import { XCircleIcon } from "lucide-react";
interface FormErrorsProps {
    id:string;
    errors?:Record<string,string[]  | undefined>;
}

export const FormErrors =({
    id,
    errors
}:FormErrorsProps) => {
    if(!errors){
        return null
    }


    return <div
        id={`${id}-error`}
        className="mt-2 text-xs text-rose-500"
        aria-live="polite"
    >
        {
            errors[id]?.map((error, index) => {
                return <div key={error} className="flex items-center font-medium p-2 border border-rose-500 bg-rose-500/10 rounded-sm">
                    <XCircleIcon className="w-4 h-4 mr-2" />
                    {error}
                </div>
            })
        }

    </div>
}