import * as React from "react"
import { Box } from "./Box"

export interface TagFoldSvgProps {
  color?: string
}

export const TagFoldSvg: React.FC<TagFoldSvgProps> = ({ color = "brand-secondary" }) => {
  return (
    <Box position="absolute" top={0} left={0} w="w-12" h="h-12" className={`text-${color}`}>
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }} fill="currentColor">
        <path d="M0 0 H100 L0 100 V0" />
        <circle cx="28" cy="28" r="14" fill="var(--surface)" />
      </svg>
    </Box>
  )
}
