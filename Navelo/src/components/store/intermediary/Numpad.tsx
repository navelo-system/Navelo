import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Grid } from "@/components/store/base/Grid"
import { Button } from "@/components/store/base/Button"
import { Delete } from "lucide-react"

export interface NumpadProps {
  onKeyPress?: (key: string) => void
  onNumberClick?: (num: string) => void
  onActionClick?: (action: "backspace" | "clear" | "custom") => void
  customActionLabel?: string
  variant?: "ghost" | "outline"
  disabled?: boolean
}

const DEFAULT_NUMPAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]

export const Numpad: React.FC<NumpadProps> = ({
  onKeyPress,
  onNumberClick,
  onActionClick,
  customActionLabel = "00",
  variant = "ghost",
  disabled = false,
}) => {
  const handleKey = (key: string) => {
    if (onKeyPress) {
      onKeyPress(key)
    }
    if (key === "back") {
      onActionClick?.("backspace")
    } else if (key === customActionLabel && customActionLabel !== "00") {
      onActionClick?.("custom")
    } else {
      onNumberClick?.(key)
    }
  }

  return (
    <Box w="full">
      <Grid cols={3} gap={2.5} responsive={false}>
        {DEFAULT_NUMPAD_KEYS.map((num) => (
          <Button
            key={num}
            label={num}
            onClick={() => handleKey(num)}
            disabled={disabled}
            fullWidth
            variant={variant}
          />
        ))}

        <Button
          label={customActionLabel}
          onClick={() => handleKey(customActionLabel)}
          disabled={disabled}
          fullWidth
          variant={variant}
        />
        <Button
          label="0"
          onClick={() => handleKey("0")}
          disabled={disabled}
          fullWidth
          variant={variant}
        />
        <Button
          icon={Delete}
          onClick={() => handleKey("back")}
          disabled={disabled}
          fullWidth
          variant={variant}
        />
      </Grid>
    </Box>
  )
}
