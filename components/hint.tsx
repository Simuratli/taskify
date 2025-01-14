import React from 'react'
import {Tooltip,TooltipContent,TooltipProvider,TooltipTrigger}  from '@/components/ui/tooltip'


interface HintProps{
    children:React.ReactNode,
    description:string,
    side?:'top' | 'bottom' | 'left' | 'right', 
    sideOffset?:number,
}


const Hint = ({children,description,side="bottom",sideOffset=0}:HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
            <TooltipTrigger>
                {children}
            </TooltipTrigger>
            <TooltipContent className='text-xs max-w-[220px] break-words' sideOffset={sideOffset} side={side}>
                {description}
            </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Hint
