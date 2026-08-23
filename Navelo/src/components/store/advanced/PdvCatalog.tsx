"use client"

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

function useGridColumnCount(minCardWidth: number, gap: number) {
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
  isActive: true,
})

interface PdvCatalogListItemProps {
  prod: MockProduct
  qty: number
  isLast: boolean
  pulsingListId: string | null
  pulseListKey: number
  onProductClick: (prod: MockProduct) => void
  onIncrease?: (id: string) => void
  onDecrease?: (id: string) => void
  onRemove?: (id: string) => void
}

function PdvCatalogListItem({
  prod,
  qty,
  isLast,
  pulsingListId,
  pulseListKey,
  onProductClick,
  onIncrease,
  onDecrease,
  onRemove,
}: PdvCatalogListItemProps) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(prod.unitPrice)
  return (
    <Box>
      <Box
        w="full"
        padding={2.5}
        hoverBg="secondary/10"
        onClick={() => {
          if (qty === 0) onProductClick(prod)
        }}
        cursor={qty === 0 ? "pointer" : undefined}
      >
        <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" gap={2.5} w="full">
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
              <Font variant="body-sm-semibold" text={formattedPrice} align="right" />
              <Font variant="auxiliary" color="muted" text={prod.unit || "UN"} />
            </Stack>
          </Stack>
        </Stack>
      </Box>
      {!isLast && <Box h="h-[1px]" w="full" bg="bg-border" />}
    </Box>
  )
}

interface PdvCatalogListProps {
  products: MockProduct[]
  cartItems: CartItemType[]
  pulsingListId: string | null
  pulseListKey: number
  onProductClick: (prod: MockProduct) => void
  onIncrease?: (id: string) => void
  onDecrease?: (id: string) => void
  onRemove?: (id: string) => void
}

function PdvCatalogList({
  products,
  cartItems,
  pulsingListId,
  pulseListKey,
  onProductClick,
  onIncrease,
  onDecrease,
  onRemove,
}: PdvCatalogListProps) {
  return (
    <Box display="flex" direction="col" radius="default" border={true} borderColor="border-border" bg="bg-white" overflow="hidden">
      {products.map((prod, idx) => {
        const qty = cartItems.find((it) => it.id === prod.id)?.quantity || 0
        return (
          <PdvCatalogListItem
            key={prod.id}
            prod={prod}
            qty={qty}
            isLast={idx === products.length - 1}
            pulsingListId={pulsingListId}
            pulseListKey={pulseListKey}
            onProductClick={onProductClick}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            onRemove={onRemove}
          />
        )
      })}
    </Box>
  )
}

function usePdvPulse() {
  const [pulsingListId, setPulsingListId] = React.useState<string | null>(null)
  const [pulseListKey, setPulseListKey] = React.useState(0)
  const pulseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    return () => {
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current)
    }
  }, [])

  const triggerPulse = (id: string) => {
    if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current)
    setPulsingListId(null)
    requestAnimationFrame(() => {
      setPulsingListId(id)
      setPulseListKey((prev) => prev + 1)
      pulseTimeoutRef.current = setTimeout(() => setPulsingListId(null), 450)
    })
  }

  return { pulsingListId, pulseListKey, triggerPulse }
}

export function PdvCatalog({
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
}: PdvCatalogProps) {
  const [minCardWidth, setMinCardWidth] = React.useState(105)
  const [gridColumns, gridContainerRef] = useGridColumnCount(minCardWidth, GRID_GAP_PX)
  const { pulsingListId, pulseListKey, triggerPulse } = usePdvPulse()

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)")
    const updateMinWidth = () => setMinCardWidth(mediaQuery.matches ? 135 : 110)
    updateMinWidth()
    mediaQuery.addEventListener("change", updateMinWidth)
    return () => mediaQuery.removeEventListener("change", updateMinWidth)
  }, [])

  const handleListProductClick = (prod: MockProduct) => {
    if (prod.stock !== undefined && prod.stock <= 0) {
      triggerPulse(prod.id)
      return
    }
    onAddProduct(prod)
  }

  return (
    <Stack gap={5} flex="1" minH="0">
      <Box w="full" overflow="auto" shrink="0">
        <Tabs value={activeCategory} onValueChange={onActiveCategoryChange}>
          <Stack direction="row" gap={2.5}>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
            ))}
          </Stack>
        </Tabs>
      </Box>

      <Box padding={0} flex="1" minH="0" overflow="x-hidden y-auto">
        {filteredProducts.length === 0 ? (
          <EmptyState icon={Package} title={UI_STRINGS.pdv.catalog.noProductsTitle} subtitle={UI_STRINGS.pdv.catalog.noProductsSubtitle} />
        ) : viewMode === "grade" ? (
          <Box ref={gridContainerRef} w="full">
            <Grid cols={gridColumns} responsive={false} gap={5} w="full">
              {filteredProducts.map((prod) => (
                <Box key={prod.id} display="flex" direction="col">
                  <ProductCard
                    product={adaptProduct(prod)}
                    onClick={() => onAddProduct(prod)}
                    quantity={cartItems.find((it) => it.id === prod.id)?.quantity || 0}
                    onIncrease={() => onIncrease?.(prod.id)}
                    onDecrease={() => onDecrease?.(prod.id)}
                    onRemove={() => onRemove?.(prod.id)}
                  />
                </Box>
              ))}
            </Grid>
          </Box>
        ) : (
          <PdvCatalogList
            products={filteredProducts}
            cartItems={cartItems}
            pulsingListId={pulsingListId}
            pulseListKey={pulseListKey}
            onProductClick={handleListProductClick}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            onRemove={onRemove}
          />
        )}
      </Box>
    </Stack>
  )
}
