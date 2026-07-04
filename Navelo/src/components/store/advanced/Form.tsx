import * as React from "react"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Box } from "../base/Box"
import { Grid } from "../base/Grid"

export interface FormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "children"> {
  label?: string
  description?: string
  columns?: 1 | 2
  children: React.ReactNode
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ label, description, columns = 1, children, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children).filter(React.isValidElement)
    const isOdd = childrenArray.length % 2 !== 0
    
    return (
      <Box as="form" ref={ref} display="flex" direction="col" w="full" {...props}>
        {(label || description) && (
          <Box paddingY={5}>
            <Stack gap={1}>
              {label && <Font variant="h3" text={label} />}
              {description && <Font variant="description" text={description} />}
            </Stack>
          </Box>
        )}
        <Grid cols={columns} gap={5}>
          {childrenArray.map((child, index) => {
            const isLastOdd = columns === 2 && isOdd && index === childrenArray.length - 1
            return (
              <Box key={index} {...(isLastOdd ? { className: "md:col-span-2" } : {})}>
                {child}
              </Box>
            )
          })}
        </Grid>
      </Box>
    )
  }
)
Form.displayName = "Form"
