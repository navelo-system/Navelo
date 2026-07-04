import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Button } from "../base/Button"
import { Eye, EyeOff } from "lucide-react"

export interface KpiCardProps {
  title: string
  value: string
  subtitle: string
  hideValues?: boolean
  onToggleHide?: () => void
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  hideValues = false,
  onToggleHide,
}) => {
  return (
    <Box padding={2.5} bg="bg-surface" radius="default">
      <Stack gap={2.5}>
        <Stack direction="row" align="center" justify="between" gap={1}>
          <Font variant="description" text={title} />
          {onToggleHide && (
            <Button 
              variant="outline-icon-xs" 
              icon={hideValues ? EyeOff : Eye} 
              onClick={onToggleHide} 
            />
          )}
        </Stack>
        <Font 
          variant="body-bold" 
          text={hideValues ? "R$ *****" : value} 
        />
        <Font variant="sub-tiny" text={subtitle} />
      </Stack>
    </Box>
  )
}
