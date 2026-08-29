import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { LucideIcon } from "lucide-react"

export interface ActionMenuItem {
  id: string
  label: string
  icon: LucideIcon
  onClick: () => void
  danger?: boolean
}

export interface ActionMenuProps {
  items: ActionMenuItem[]
  onClose?: () => void
  top?: string
  bottom?: string
  left?: string
  right?: string
  width?: string
}

export function ActionMenu({ items, onClose, top, bottom, left, right, width = "w-52" }: ActionMenuProps) {
  React.useEffect(() => {
    if (!onClose) return
    const handleClickOutside = () => onClose()
    window.addEventListener("click", handleClickOutside)
    return () => window.removeEventListener("click", handleClickOutside)
  }, [onClose])

  return (
    <Box
      position="absolute"
      top={top}
      bottom={bottom}
      left={left}
      right={right}
      zIndex="50"
      bg="bg-surface"
      radius="default"
      shadow="default"
      border
      borderColor="border-border"
      padding={2.5}
      w={width}
      onClick={(e) => e.stopPropagation()}
    >
      <Stack gap={1} w="full">
        {items.map((item) => (
          <Box
            key={item.id}
            padding={2.5}
            hoverBg="secondary/10"
            cursor="pointer"
            radius="default"
            onClick={() => {
              item.onClick()
              if (onClose) onClose()
            }}
          >
            <Stack direction="row" align="center" gap={2.5}>
              <Icon icon={item.icon} size={16} color={item.danger ? "danger" : "foreground"} />
              <Font variant="body" text={item.label} color={item.danger ? "danger" : "foreground"} />
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
