"use client"

/* eslint-disable react-hooks/set-state-in-effect */

import React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Minus, Plus, Trash2 } from "lucide-react"

const FOOTER_ANIMATION_MS = 240

interface ProductCardQuantityFooterProps {
  quantity: number
  onIncrease?: () => void
  onDecrease?: () => void
  onRemove?: () => void
}

export function ProductCardQuantityFooter({
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}: ProductCardQuantityFooterProps) {
  const [footerMounted, setFooterMounted] = React.useState(quantity > 0)
  const [footerAnimation, setFooterAnimation] = React.useState<"slide-up" | "slide-down" | undefined>(
    quantity > 0 ? "slide-up" : undefined
  )
  const [displayQuantity, setDisplayQuantity] = React.useState(quantity)
  const exitTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    if (quantity > 0) {
      setDisplayQuantity(quantity)

      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current)
        exitTimerRef.current = null
      }

      setFooterMounted(true)
      setFooterAnimation("slide-up")
      return
    }

    if (!footerMounted) return

    setFooterAnimation("slide-down")
    exitTimerRef.current = setTimeout(() => {
      setFooterMounted(false)
      setFooterAnimation(undefined)
      exitTimerRef.current = null
    }, FOOTER_ANIMATION_MS)

    return () => {
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current)
        exitTimerRef.current = null
      }
    }
  }, [quantity, footerMounted])

  if (!footerMounted || !footerAnimation) return null

  return (
    <Box
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      w="full"
      bg="bg-white"
      padding={1}
      animation={footerAnimation}
    >
      <Stack direction="row" align="center" justify="center" gap={2.5} w="full">
        {displayQuantity === 1 ? (
          <Button variant="danger-icon-xs" icon={Trash2} onClick={(e) => { e.stopPropagation(); onRemove?.(); }} />
        ) : (
          <Button variant="outline-icon-xs" icon={Minus} onClick={(e) => { e.stopPropagation(); onDecrease?.(); }} />
        )}
        <Box padding={0} w="w-4">
          <Font variant="body-bold" text={String(displayQuantity)} align="center" />
        </Box>
        <Button variant="outline-icon-xs" icon={Plus} onClick={(e) => { e.stopPropagation(); onIncrease?.(); }} />
      </Stack>
    </Box>
  )
}
