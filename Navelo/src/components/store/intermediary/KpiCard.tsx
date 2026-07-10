import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Icon } from "@/components/store/base/Icon"
import { Eye, EyeOff, LucideIcon } from "lucide-react"

export interface KpiCardProps {
  title: string
  value: string
  subtitle: string
  hideValues?: boolean
  onToggleHide?: () => void
  icon?: LucideIcon
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  hideValues = false,
  onToggleHide,
  icon
}) => {
  return (
    <Box padding={2.5} bg="bg-surface" radius="default">
      <Stack gap={2.5}>
        <Stack direction="row" align="center" justify="between" gap={1}>
          <Font variant="body-sm-semibold" color="secondary" text={title} />
          {icon ? (
            <Icon icon={icon} color="muted" size={16} />
          ) : onToggleHide ? (
            <Button 
              variant="outline-icon-xs" 
              icon={hideValues ? EyeOff : Eye} 
              onClick={onToggleHide} 
            />
          ) : null}
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
