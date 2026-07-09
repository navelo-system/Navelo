import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          className={cn(
            "h-5 w-5 rounded border border-border bg-white text-brand-primary focus:ring-brand-primary accent-brand-primary disabled:opacity-50 disabled:cursor-not-allowed",
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
Checkbox.displayName = "Checkbox"
