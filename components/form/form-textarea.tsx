"use client"
import React, { forwardRef, KeyboardEventHandler } from 'react'
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';
import { FormErrors } from './form-errors';
import { useFormStatus } from 'react-dom';

interface FormTextareaProps {
    id: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: Record<string, string[] | undefined>;
    className?: string;
    onBlur?: () => void;
    onClick?: () => void;
    onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
    defaultValue?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({ id, onClick, className, defaultValue, disabled, errors, label, onBlur, onKeyDown, placeholder, required }, ref) => {
    const {pending} = useFormStatus()
    
    return (
        <div className='space-y-2 w-full'>
            <div className='space-y-1 w-full'>
                {
                    label ? (
                        <Label htmlFor={id} className='text-xs font-semibold text-neutral-700'>
                            {label}
                        </Label>
                    ) : null
                }

                <Textarea
                    onKeyDown={onKeyDown}
                    onBlur={onBlur}
                    ref={ref}
                    id={id}
                    name={id}
                    onClick={onClick}
                    className={cn("resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm",className)}
                    defaultValue={defaultValue}
                    disabled={pending || disabled}
                    aria-describedby={`${id}-error`}
                    placeholder={placeholder}
                    required={required}
                />
                <FormErrors 
                    errors={errors}
                    id={id}
                />
            </div>
        </div>
    )
})

FormTextarea.displayName = "FormTextarea"
