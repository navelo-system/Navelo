"use client"

import React from "react"
import { Box } from "@/components/store/base/Box"
import { QuantityControl } from "@/components/store/intermediary/QuantityControl"

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
  if (quantity <= 0) return null

  const effectiveMax = maxQuantity !== undefined ? maxQuantity : stock

  return (
    <Box
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      w="full"
      bg="bg-white"
      padding={1}
      animation="slide-up"
    >
      <QuantityControl
        quantity={quantity}
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
