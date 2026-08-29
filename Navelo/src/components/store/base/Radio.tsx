import * as React from "react"
import { cn } from "@/lib/utils"

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="radio"
          className={cn(
            "h-5 w-5 border border-border bg-white text-brand-primary focus:ring-brand-primary accent-brand-primary disabled:opacity-50 disabled:cursor-not-allowed shrink-0",
            className
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <span className="text-sm font-medium text-text-primary peer-disabled:opacity-50 select-none">
            {label}
          </span>
        )}
      </label>
    )
  }
)
Radio.displayName = "Radio"
