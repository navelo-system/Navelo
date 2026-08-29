"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Icon } from "@/components/store/base/Icon"
import { Sun, Moon } from "lucide-react"

export interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <Box
      position="relative"
      bg="bg-brand-primary/10"
      radius="full"
      cursor="pointer"
      onClick={onToggle}
      w="w-[58px]"
      h="h-[30px]"
      display="flex"
      align="center"
      shrink="0"
    >
      {/* Sliding Pill Thumb */}
      <Box
        position="absolute"
        top="3px"
        style={{
          left: isDark ? "31px" : "3px",
          transition: "left 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        w="w-[24px]"
        h="h-[24px]"
        radius="full"
        bg="bg-brand-primary"
        shadow="default"
      />

      {/* Sun Icon */}
      <Box
        flex="1"
        display="flex"
        align="center"
        justify="center"
        position="relative"
        zIndex="10"
        h="full"
      >
        <Icon
          icon={Sun}
          size={14}
          color={!isDark ? "white" : "muted"}
        />
      </Box>

      {/* Moon Icon */}
      <Box
        flex="1"
        display="flex"
        align="center"
        justify="center"
        position="relative"
        zIndex="10"
        h="full"
      >
        <Icon
          icon={Moon}
          size={14}
          color={isDark ? "white" : "muted"}
        />
      </Box>
    </Box>
  )
}
