"use client"

import * as React from "react"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Minus, Plus, Trash2 } from "lucide-react"

export interface QuantityControlProps {
  quantity: number
  stock?: number
  maxQuantity?: number
  onIncrease?: () => void
  onDecrease?: () => void
  onRemove?: () => void
  stopPropagation?: boolean
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  stock,
  maxQuantity,
  onIncrease,
  onDecrease,
  onRemove,
  stopPropagation = true,
}) => {
  const limit = maxQuantity ?? stock
  const isLimitReached = limit !== undefined && limit !== Infinity && quantity >= limit

  const handleDecreaseClick = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation()
    onDecrease?.()
  }

  const handleRemoveClick = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation()
    onRemove?.()
  }

  const handleIncreaseClick = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation()
    if (!isLimitReached) {
      onIncrease?.()
    }
  }

  return (
    <Stack direction="row" align="center" justify="center" gap={2.5}>
      {quantity === 1 ? (
        <Button
          variant="danger-icon-xs"
          icon={Trash2}
          onClick={handleRemoveClick}
        />
      ) : (
        <Button
          variant="primary-icon-xs"
          icon={Minus}
          onClick={handleDecreaseClick}
        />
      )}

      <Box padding={0} minW="min-w-[16px]">
        <Font
          variant="body-bold"
          text={
            Number.isInteger(quantity)
              ? String(quantity)
              : quantity.toLocaleString("pt-BR", { maximumFractionDigits: 3 })
          }
          align="center"
        />
      </Box>

      <Button
        variant="primary-icon-xs"
        icon={Plus}
        disabled={isLimitReached}
        onClick={handleIncreaseClick}
      />
    </Stack>
  )
}
