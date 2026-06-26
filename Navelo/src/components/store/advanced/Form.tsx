import * as React from "react"
import { cn } from "@/lib/utils"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  label?: string
  description?: string
  columns?: number
  children: React.ReactNode
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, label, description, columns = 1, children, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children).filter(React.isValidElement)
    const isOdd = childrenArray.length % 2 !== 0
    
    return (
      <form ref={ref} className={cn("flex flex-col w-full", className)} {...props}>
        {(label || description) && (
          <Stack gap={1} className="mb-5">
            {label && <Font variant="h3" text={label} />}
            {description && <Font variant="description" text={description} />}
          </Stack>
        )}
        <div 
          className={cn(
            "grid gap-5 w-full",
            columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          )}
        >
          {childrenArray.map((child, index) => {
            const isLastOdd = columns === 2 && isOdd && index === childrenArray.length - 1
            return (
              <div key={index} className={cn(isLastOdd && "md:col-span-2")}>
                {child}
              </div>
            )
          })}
        </div>
      </form>
    )
  }
)
Form.displayName = "Form"
