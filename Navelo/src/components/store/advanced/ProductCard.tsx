"use client"

import React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Product } from "@/src/types/domain"
import { ProductCardQuantityFooter } from "@/components/store/advanced/ProductCardQuantityFooter"

export interface ProductCardProps {
  product: Product
  onClick?: (product: Product) => void
  quantity?: number
  onIncrease?: () => void
  onDecrease?: () => void
  onRemove?: () => void
}

export function ProductCard({ product, onClick, quantity = 0, onIncrease, onDecrease, onRemove }: ProductCardProps) {
  return (
    <Stack
      gap={2.5}
      onClick={() => {
        if (quantity === 0) onClick?.(product)
      }}
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
            <Font variant="auxiliary" color="muted" text="Sem Foto" />
          </Stack>
        )}

        <ProductCardQuantityFooter
          quantity={quantity}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onRemove={onRemove}
        />
      </Box>

      <Stack gap={1} w="full" flex="1" justify="between">
        <Box w="full" flex="1">
          <Font as="p" variant="body-bold" text={product.name} align="center" lineClamp={2} />
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
