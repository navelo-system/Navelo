"use client"

/* eslint-disable max-lines-per-function */

import React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Product } from "@/src/types/domain"
import { ProductCardQuantityFooter } from "@/components/store/advanced/ProductCardQuantityFooter"
import { UI_STRINGS } from "@/constants/strings"

export interface ProductCardProps {
  product: Product
  onClick?: (product: Product) => void
  quantity?: number
  onIncrease?: () => void
  onDecrease?: () => void
  onRemove?: () => void
}

export function ProductCard({ product, onClick, quantity = 0, onIncrease, onDecrease, onRemove }: ProductCardProps) {
  const [isPulsing, setIsPulsing] = React.useState(false)
  const [pulseId, setPulseId] = React.useState(0)
  const pulseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    return () => {
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current)
      }
    }
  }, [])

  const handleCardClick = () => {
    if (quantity > 0) return

    // Se o produto está sem estoque (stock <= 0)
    if (product.stock !== undefined && product.stock <= 0) {
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current)
      }
      setIsPulsing(false)
      requestAnimationFrame(() => {
        setIsPulsing(true)
        setPulseId((prev) => prev + 1)
        pulseTimeoutRef.current = setTimeout(() => {
          setIsPulsing(false)
        }, 450)
      })
      return
    }

    onClick?.(product)
  }

  return (
    <Stack
      gap={2.5}
      onClick={handleCardClick}
      cursor={quantity === 0 ? "pointer" : undefined}
      w="full"
      align="stretch"
      flex="1"
    >
      <Box
        position="relative"
        w="full"
        shrink="0"
        bg="bg-surface-sunken"
        radius="default"
        overflow="hidden"
        h="aspect-square"
      >
        {product.mainImage ? (
          <Box
            as="img"
            src={product.mainImage}
            alt={product.name}
            w="full"
            h="full"
            objectFit="cover"
          />
        ) : (
          <Stack align="center" justify="center" w="full" h="full">
            <Font variant="auxiliary" color="muted" text={UI_STRINGS.products.noPhoto} />
          </Stack>
        )}

        {isPulsing && (
          <Box
            key={pulseId}
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            w="full"
            h="full"
            zIndex="30"
            display="flex"
            align="center"
            justify="center"
            radius="default"
            pointerEvents="none"
            animation="zero-stock-pulse"
          >
            <Font
              variant="display-huge"
              color="white"
              text="0"
              align="center"
            />
          </Box>
        )}

        <ProductCardQuantityFooter
          quantity={quantity}
          stock={product.stock}
          maxQuantity={product.stock}
          isMaxReached={product.stock !== undefined && product.stock !== Infinity && quantity >= product.stock}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onRemove={onRemove}
        />
      </Box>

      <Stack gap={1} w="full" flex="1" justify="between">
        <Box w="full" flex="1">
          <Font as="p" variant="body" text={product.name} align="center" lineClamp={2} />
        </Box>

        <Font
          as="p"
          variant="body-sm-semibold"
          color="primary"
          text={`${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.sellingPrice)} / ${product.unitType || "UN"}`}
          align="center"
        />
      </Stack>
    </Stack>
  )
}
