"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Tabs, TabsTrigger } from "@/components/store/base/Tabs"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { ProductCard } from "@/components/store/advanced/ProductCard"
import { Product, ProductType, UnitType } from "@/src/types/domain"
import { Package } from "lucide-react"
import { QuantityControl } from "@/components/store/intermediary/QuantityControl"
import { CartItemType } from "@/components/store/sections/pdv/pages/PdvSection"
import { UI_STRINGS } from "@/constants/strings"

export interface MockProduct {
  id: string
  name: string
  image?: string
  unit?: string
  stock?: number
  unitPrice: number
  category: string
  subgroup?: string
  barcode?: string
}

interface PdvCatalogProps {
  activeCategory: string
  onActiveCategoryChange: (val: string) => void
  filteredProducts: MockProduct[]
  onAddProduct: (prod: MockProduct) => void
  categories: string[]
  viewMode: "grade" | "lista"
  cartItems?: CartItemType[]
  onIncrease?: (id: string) => void
  onDecrease?: (id: string) => void
  onRemove?: (id: string) => void
}

const GRID_GAP_PX = 20

type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12

function toGridCols(count: number): GridCols {
  const clamped = Math.max(1, Math.min(count, 10))
  if (clamped <= 6) return clamped as 1 | 2 | 3 | 4 | 5 | 6
  if (clamped <= 8) return 8
  return 10
}

function useGridColumnCount(
  minCardWidth: number,
  gap: number
) {
  const [columns, setColumns] = React.useState<GridCols>(3)
  const observerRef = React.useRef<ResizeObserver | null>(null)

  const refCallback = React.useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }

      if (node) {
        const updateColumns = () => {
          const width = node.getBoundingClientRect().width
          const next = Math.floor((width + gap) / (minCardWidth + gap))
          setColumns(toGridCols(next))
        }

        updateColumns()
        const observer = new ResizeObserver(updateColumns)
        observer.observe(node)
        observerRef.current = observer
      }
    },
    [minCardWidth, gap]
  )

  return [columns, refCallback] as const
}

const adaptProduct = (prod: MockProduct): Product => ({
  id: prod.id,
  tenantId: "1",
  name: prod.name,
  type: ProductType.SIMPLE,
  mainImage: prod.image,
  unitType: prod.unit === "UN" ? UnitType.UN : UnitType.KG,
  categoryId: "1",
  stock: prod.stock ?? 0,
  minStock: 0,
  costPrice: 0,
  otherCosts: 0,
  marginPercentage: 0,
  sellingPrice: prod.unitPrice,
  isActive: true
})

export const PdvCatalog: React.FC<PdvCatalogProps> = ({
  activeCategory,
  onActiveCategoryChange,
  filteredProducts,
  onAddProduct,
  categories,
  viewMode,
  cartItems = [],
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const [minCardWidth, setMinCardWidth] = React.useState(105)
  const [gridColumns, gridContainerRef] = useGridColumnCount(minCardWidth, GRID_GAP_PX)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)")
    const updateMinWidth = () => setMinCardWidth(mediaQuery.matches ? 135 : 110)
    updateMinWidth()
    mediaQuery.addEventListener("change", updateMinWidth)
    return () => mediaQuery.removeEventListener("change", updateMinWidth)
  }, [])

  const [pulsingListId, setPulsingListId] = React.useState<string | null>(null)
  const [pulseListKey, setPulseListKey] = React.useState(0)
  const pulseListTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    return () => {
      if (pulseListTimeoutRef.current) {
        clearTimeout(pulseListTimeoutRef.current)
      }
    }
  }, [])

  const handleListProductClick = (prod: MockProduct) => {
    if (prod.stock !== undefined && prod.stock <= 0) {
      if (pulseListTimeoutRef.current) {
        clearTimeout(pulseListTimeoutRef.current)
      }
      setPulsingListId(null)
      requestAnimationFrame(() => {
        setPulsingListId(prod.id)
        setPulseListKey((prev) => prev + 1)
        pulseListTimeoutRef.current = setTimeout(() => {
          setPulsingListId(null)
        }, 450)
      })
      return
    }
    onAddProduct(prod)
  }

  const getProductQuantity = (id: string) => {
    return cartItems.find((item) => item.id === id)?.quantity || 0
  }

  return (
    <Stack gap={5} flex="1" minH="0">

      {/* Abas de Categorias */}
      <Box w="full" overflow="auto" paddingY={1} shrink="0">
        <Tabs value={activeCategory} onValueChange={onActiveCategoryChange}>
          <Stack direction="row" gap={2.5}>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
              </TabsTrigger>
            ))}
          </Stack>
        </Tabs>
      </Box>

      {/* Grade/Lista de Produtos ou Carrinho */}
      <Box padding={0} flex="1" minH="0" overflow="x-hidden y-auto">
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={Package}
            title={UI_STRINGS.pdv.catalog.noProductsTitle}
            subtitle={UI_STRINGS.pdv.catalog.noProductsSubtitle}
          />
        ) : viewMode === "grade" ? (
          <Box ref={gridContainerRef} w="full">
            <Grid cols={gridColumns} responsive={false} gap={5} w="full">
              {filteredProducts.map((prod) => {
                const qty = getProductQuantity(prod.id)
                return (
                  <Box key={prod.id} display="flex" direction="col">
                    <ProductCard
                      product={adaptProduct(prod)}
                      onClick={() => onAddProduct(prod)}
                      quantity={qty}
                      onIncrease={() => onIncrease?.(prod.id)}
                      onDecrease={() => onDecrease?.(prod.id)}
                      onRemove={() => onRemove?.(prod.id)}
                    />
                  </Box>
                )
              })}
            </Grid>
          </Box>
        ) : (
          /* Lista limpa — thumbnail + nome + preço/unidade */
          <Box display="flex" direction="col" radius="default" border={true} borderColor="border-border" bg="bg-white" overflow="hidden">
            {filteredProducts.map((prod, idx) => {
              const qty = getProductQuantity(prod.id)
              return (
                <Box key={prod.id}>
                  <Box
                    w="full"
                    paddingX={2.5}
                    paddingY={2.5}
                    hoverBg="secondary/10"
                    onClick={() => {
                      if (qty === 0) handleListProductClick(prod)
                    }}
                    cursor={qty === 0 ? "pointer" : undefined}
                  >
                    <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" gap={2.5} w="full">
                      {/* Thumbnail + Nome */}
                      <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
                        <Box position="relative" w="w-10" h="h-10" bg="bg-surface-sunken" radius="default" overflow="hidden" shrink="0">
                          {prod.image ? (
                            <Box as="img" src={prod.image} alt={prod.name} w="full" h="full" objectFit="cover" />
                          ) : (
                            <Stack align="center" justify="center" w="full" h="full">
                              <Font variant="auxiliary" color="muted" text={UI_STRINGS.common.dash} />
                            </Stack>
                          )}
                          {pulsingListId === prod.id && (
                            <Box
                              key={pulseListKey}
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
                              <Font variant="body-bold" color="white" text="0" align="center" />
                            </Box>
                          )}
                        </Box>
                        <Font variant="body-sm-medium" text={prod.name.toUpperCase()} align="left" />
                      </Stack>
                      {/* Preço + Unidade e Controles */}
                      <Stack direction="row" align="center" gap={2.5} justify="end" w="w-full md:w-auto">
                        {qty > 0 && (
                          <QuantityControl
                            quantity={qty}
                            stock={prod.stock}
                            onIncrease={() => onIncrease?.(prod.id)}
                            onDecrease={() => onDecrease?.(prod.id)}
                            onRemove={() => onRemove?.(prod.id)}
                            stopPropagation={true}
                          />
                        )}
                        <Stack direction="row" align="baseline" gap={1} justify="end" w="min-w-[85px]">
                          <Font
                            variant="body-sm-semibold"
                            text={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(prod.unitPrice)}
                            align="right"
                          />
                          <Font variant="auxiliary" color="muted" text={prod.unit || "UN"} />
                        </Stack>
                      </Stack>
                    </Stack>
                  </Box>
                  {idx < filteredProducts.length - 1 && (
                    <Box h="h-[1px]" w="full" bg="bg-border" />
                  )}
                </Box>
              )
            })}
          </Box>
        )}
      </Box>
    </Stack>
  )
}
