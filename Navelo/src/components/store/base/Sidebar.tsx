"use client"

import * as React from "react"
import { Box } from "./Box"
import { Stack } from "./Stack"
import { Font } from "./Font"
import { Button } from "./Button"
import { X } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children?: React.ReactNode
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, title, children }) => {
  const [shouldRender, setShouldRender] = React.useState(false)
  const [isActive, setIsActive] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsActive(true)
        })
      })
    } else {
      setIsActive(false)
      const timer = setTimeout(() => setShouldRender(false), 260)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsActive(false)
    setTimeout(() => {
      setShouldRender(false)
      onClose()
    }, 260)
  }

  if (!shouldRender) return null

  const backdropStyle: React.CSSProperties = {
    opacity: isActive ? 1 : 0,
    transition: "opacity 0.22s ease",
  }

  const drawerStyle: React.CSSProperties = {
    transform: isActive ? "translateX(0)" : "translateX(100%)",
    transition: isActive
      ? "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)"
      : "transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
  }

  return (
    <Box position="fixed" top={0} left={0} right={0} bottom={0} zIndex="50" display="flex" justify="end">
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="bg-black/50"
        onClick={handleClose}
        style={backdropStyle}
      />
      <Box
        w="w-full max-w-xs"
        h="full"
        bg="bg-surface"
        display="flex"
        direction="col"
        position="relative"
        zIndex="50"
        border={true}
        borderColor="border-border"
        shadow="default"
        style={drawerStyle}
      >
        <Box padding={5}>
          <Stack direction="row" align="center" justify="between" w="full">
            <Font variant="h3" text={title} />
            <Button variant="outline-pill-icon-xs" icon={X} onClick={handleClose} />
          </Stack>
        </Box>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Box flex="1" overflow="x-hidden y-auto" padding={5}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
