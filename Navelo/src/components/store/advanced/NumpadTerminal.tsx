import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Numpad } from "../intermediary/Numpad"

export interface NumpadTerminalProps {
  initialValue?: string
}

export const NumpadTerminal: React.FC<NumpadTerminalProps> = ({
  initialValue = "",
}) => {
  const [value, setValue] = React.useState(initialValue)

  const handleNumberClick = (num: string) => {
    setValue((prev) => prev + num)
  }

  const handleActionClick = (action: "backspace" | "clear" | "custom") => {
    if (action === "backspace") {
      setValue((prev) => prev.slice(0, -1))
    } else if (action === "clear") {
      setValue("")
    }
  }

  return (
    <Box padding={5} bg="bg-surface" radius="default">
      <Stack gap={5} align="center">
        {/* Numpad Display - using padding to establish natural height */}
        <Box 
          w="full" 
          paddingX={5} 
          paddingY={2.5}
        >
          <Stack direction="row" justify="end" align="center">
            <Font variant="h3" text={value || "0,00"} />
          </Stack>
        </Box>

        {/* Numpad Keys */}
        <Box w="full">
          <Numpad 
            onNumberClick={handleNumberClick} 
            onActionClick={handleActionClick} 
          />
        </Box>
      </Stack>
    </Box>
  )
}
