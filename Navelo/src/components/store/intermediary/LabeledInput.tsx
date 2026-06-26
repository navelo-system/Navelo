import * as React from "react"
import { Box } from "../base/Box"
import { Font } from "../base/Font"
import { Input, InputProps } from "../base/Input"
import { Stack } from "../base/Stack"

export interface LabeledInputProps extends InputProps {
  label: string
  description?: string
  error?: string
}

export const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
  ({ label, description, error, ...props }, ref) => {
    return (
      <Stack gap={2.5}>
        <Stack gap={1}>
          <Font variant="sub-tiny-bold" text={label} />
          {description && <Font variant="description" text={description} />}
        </Stack>
        <Input ref={ref} hasError={!!error} {...props} />
        {error && <Font variant="auxiliary" color="danger" text={error} />}
      </Stack>
    )
  }
)
LabeledInput.displayName = "LabeledInput"
