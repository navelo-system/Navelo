"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Checkbox } from "@/components/store/base/Checkbox"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Search } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { useProducts } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import { UI_STRINGS, formatString } from "@/constants/strings"

interface CatalogProduct {
  id: string
  name: string
  category: string
  subcategory: string
  price: number
  stock: number
}

export interface CatalogoProdutosSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode) => void
}

const formatPrice = (price: number) =>
  price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

const formatStock = (stock: number) => {
  if (stock > 0) return `+${stock} UN`
  if (stock < 0) return `${stock} UN`
  return "0 UN"
}

function CatalogProductRow({
  product,
  isSelected,
  onToggle,
}: {
  product: CatalogProduct
  isSelected: boolean
  onToggle: () => void
}) {
  return (
    <Box padding={5} cursor="pointer" hoverBg="primary/10" w="full" onClick={onToggle}>
      <Stack direction="row" align="center" justify="between" w="full" gap={5}>
        <Stack direction="row" align="center" gap={2.5}>
          <Checkbox checked={isSelected} onChange={onToggle} onClick={(e) => e.stopPropagation()} />
          <Stack gap={1}>
            <Font variant="body-bold" text={product.name} />
            <Font variant="description" text={`${product.category} - ${product.subcategory}`} color="muted" />
          </Stack>
        </Stack>
        <Stack align="end" gap={1}>
          <Font variant="body-bold" text={formatPrice(product.price)} />
          <Font variant="description" text={formatStock(product.stock)} color={product.stock > 0 ? "success" : "muted"} />
        </Stack>
      </Stack>
    </Box>
  )
}

function CatalogProductList({
  filtered,
  selectedIds,
  onToggleAll,
  onToggleProduct,
}: {
  filtered: CatalogProduct[]
  selectedIds: Set<string>
  onToggleAll: () => void
  onToggleProduct: (id: string) => void
}) {
  const s = UI_STRINGS.onlineCatalog
  const allSelected = filtered.length > 0 && filtered.every((p) => selectedIds.has(p.id))
  const someSelected = filtered.some((p) => selectedIds.has(p.id))

  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" overflow="hidden" w="full">
      <Box padding={5} w="full">
        <Checkbox
          label={s.selectAllLabel}
          checked={allSelected}
          ref={(el) => { if (el) el.indeterminate = !allSelected && someSelected }}
          onChange={onToggleAll}
        />
      </Box>
      <Box h="h-[1px]" w="full" bg="bg-border" />
      <Stack gap={0} w="full">
        {filtered.map((product, idx) => (
          <React.Fragment key={product.id}>
            {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
            <CatalogProductRow
              product={product}
              isSelected={selectedIds.has(product.id)}
              onToggle={() => onToggleProduct(product.id)}
            />
          </React.Fragment>
        ))}
        {filtered.length === 0 && (
          <EmptyState icon={Search} title={s.noProductsFoundTitle} subtitle={s.noProductsFoundSubtitle} />
        )}
      </Stack>
    </Box>
  )
}

export const CatalogoProdutosSection: React.FC<CatalogoProdutosSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id
  const dbProducts = useProducts(tenantId)
  const s = UI_STRINGS.onlineCatalog
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [search, setSearch] = React.useState("")

  const products: CatalogProduct[] = React.useMemo(() => {
    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category_id || "Geral",
        subcategory: p.unit || "UN",
        price: p.price || 0,
        stock: p.stock ?? 0,
      }))
    }
    return []
  }, [dbProducts])

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.productsTitle)
    setCustomActions?.(
      <MobileHeaderSearch searchQuery={search} onSearchQueryChange={setSearch} placeholder={s.searchProductOrCategoryPlaceholder} />
    )
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, search, onCancel, s.productsTitle, s.searchProductOrCategoryPlaceholder])

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  )

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      const isAll = filtered.length > 0 && filtered.every((p) => next.has(p.id))
      filtered.forEach((p) => (isAll ? next.delete(p.id) : next.add(p.id)))
      return next
    })
  }

  return (
    <Stack gap={5} w="full">
      <Stack gap={2.5} w="full">
        <Font variant="description" text={s.productsSelectDesc} color="muted" />
      </Stack>
      <CatalogProductList
        filtered={filtered}
        selectedIds={selectedIds}
        onToggleAll={toggleAll}
        onToggleProduct={(id) => setSelectedIds((prev) => {
          const next = new Set(prev)
          if (next.has(id)) next.delete(id); else next.add(id)
          return next
        })}
      />
      <Font
        variant="description"
        text={formatString(s.selectedProductsCountTemplate, { count: selectedIds.size })}
        color="muted"
        align="center"
      />
    </Stack>
  )
}
