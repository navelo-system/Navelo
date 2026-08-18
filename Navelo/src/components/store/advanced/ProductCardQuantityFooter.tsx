"use client"

/* eslint-disable react-hooks/set-state-in-effect */

import React from "react"
import { Box } from "@/components/store/base/Box"
import { QuantityControl } from "@/components/store/intermediary/QuantityControl"

const FOOTER_ANIMATION_MS = 240

interface ProductCardQuantityFooterProps {
  quantity: number
  stock?: number
  maxQuantity?: number
  isMaxReached?: boolean
  onIncrease?: () => void
  onDecrease?: () => void
  onRemove?: () => void
}

export function ProductCardQuantityFooter({
  quantity,
  stock,
  maxQuantity,
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

  const effectiveMax = maxQuantity ?? stock

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
      <QuantityControl
        quantity={displayQuantity}
        stock={effectiveMax}
        maxQuantity={effectiveMax}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onRemove={onRemove}
        stopPropagation={true}
      />
    </Box>
  )
}
