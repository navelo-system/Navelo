import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Grid } from "@/components/store/base/Grid"
import { Button } from "@/components/store/base/Button"
import { Delete } from "lucide-react"

export interface NumpadProps {
  onNumberClick: (num: string) => void
  onActionClick: (action: "backspace" | "clear" | "custom") => void
  customActionLabel?: string
  disabled?: boolean
}

export const Numpad: React.FC<NumpadProps> = ({
  onNumberClick,
  onActionClick,
  customActionLabel = "00",
  disabled = false,
}) => {
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]

  return (
    <Box w="full">
      <Grid cols={3} gap={2.5} responsive={false}>
        {numbers.map((num) => (
          <Button
            key={num}
            label={num}
            onClick={() => onNumberClick(num)}
            disabled={disabled}
            fullWidth
            variant="secondary-lg"
          />
        ))}
        
        {/* Row 4 */}
        <Button
          label={customActionLabel}
          onClick={() => customActionLabel === "00" ? onNumberClick("00") : onActionClick("custom")}
          disabled={disabled}
          fullWidth
          variant="secondary-lg"
        />
        <Button
          label="0"
          onClick={() => onNumberClick("0")}
          disabled={disabled}
          fullWidth
          variant="secondary-lg"
        />
        <Button
          icon={Delete}
          onClick={() => onActionClick("backspace")}
          disabled={disabled}
          fullWidth
          variant="danger-icon"
        />
      </Grid>
    </Box>
  )
}
