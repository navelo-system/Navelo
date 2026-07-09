"use client"

import * as React from "react"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { CircularIcon } from "./CircularIcon"
import { LucideIcon } from "lucide-react"

export interface SectionHeaderProps {
  icon: LucideIcon
  title: string
  subtitle: string
  action?: React.ReactNode
  iconSize?: number
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  subtitle,
  action,
  iconSize = 24,
}) => {
  return (
    <Stack direction="col" mobileDirection="row" align="start" mobileAlign="center" justify="between" gap={5}>
      <Stack direction="col" mobileDirection="row" align="start" mobileAlign="center" gap={5}>
        <CircularIcon icon={icon} size={iconSize} />
        <Stack gap={0}>
          <Font variant="body-bold" text={title} />
          <Font variant="description" text={subtitle} />
        </Stack>
      </Stack>
      {action && action}
    </Stack>
  )
}
