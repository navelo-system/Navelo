import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Button } from "@/components/store/base/Button"

export interface FormActionsProps {
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  cancelLabel?: string
  confirmDisabled?: boolean
  isSubmit?: boolean
  leftAction?: React.ReactNode
}

export const FormActions: React.FC<FormActionsProps> = ({
  confirmLabel,
  onConfirm,
  onCancel,
  cancelLabel = "Cancelar",
  confirmDisabled = false,
  isSubmit = false,
  leftAction,
}) => {
  return (
    <Stack
      direction="col"
      mobileDirection="row"
      justify={leftAction ? "between" : "end"}
      mobileJustify={leftAction ? "between" : "end"}
      align="center"
      gap={2.5}
      w="full"
    >
      {leftAction && (
        <Box shrink="0" className="w-full md:w-auto">
          {leftAction}
        </Box>
      )}
      <Stack
        direction="col"
        mobileDirection="row"
        gap={2.5}
        w="w-full md:w-auto"
      >
        <Button
          type="button"
          variant="secondary"
          label={cancelLabel}
          onClick={onCancel}
        />
        <Button
          type={isSubmit ? "submit" : "button"}
          variant="primary"
          label={confirmLabel}
          onClick={onConfirm}
          disabled={confirmDisabled}
        />
      </Stack>
    </Stack>
  )
}
