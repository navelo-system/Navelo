"use client"

/* eslint-disable max-lines-per-function */

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

export const CatalogoProdutosSection: React.FC<CatalogoProdutosSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id
  const dbProducts = useProducts(tenantId)

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

  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Produtos")
    setCustomActions?.(
      <MobileHeaderSearch
        searchQuery={search}
        onSearchQueryChange={setSearch}
        placeholder="Buscar produto ou categoria..."
      />
    )
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, search, onCancel])

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const allSelected = filtered.length > 0 && filtered.every((p) => selectedIds.has(p.id))
  const someSelected = filtered.some((p) => selectedIds.has(p.id))

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (allSelected) {
        filtered.forEach((p) => next.delete(p.id))
      } else {
        filtered.forEach((p) => next.add(p.id))
      }
      return next
    })
  }

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  const formatStock = (stock: number) => {
    if (stock > 0) return `+${stock} UN`
    if (stock < 0) return `${stock} UN`
    return "0 UN"
  }

  return (
    <Stack gap={5} w="full">
      {/* Subtítulo */}
      <Stack gap={2.5} w="full">
        <Font
          variant="description"
          text="Selecione os produtos para vender no Catálogo Online."
          color="muted"
        />
      </Stack>

      {/* Card principal */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        overflow="hidden"
        w="full"
      >
        {/* Linha: Selecionar todos */}
        <Box padding={5} w="full">
          <Checkbox
            label="Selecionar todos"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = !allSelected && someSelected
            }}
            onChange={toggleAll}
          />
        </Box>

        <Box h="h-[1px]" w="full" bg="bg-border" />

        {/* Lista de produtos */}
        <Stack gap={0} w="full">
          {filtered.map((product, idx) => (
            <React.Fragment key={product.id}>
              {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
              <Box
                padding={5}
                cursor="pointer"
                hoverBg="primary/10"
                w="full"
                onClick={() => toggleProduct(product.id)}
              >
                <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                  <Stack direction="row" align="center" gap={2.5}>
                    <Checkbox
                      checked={selectedIds.has(product.id)}
                      onChange={() => toggleProduct(product.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Stack gap={1}>
                      <Font variant="body-bold" text={product.name} />
                      <Font
                        variant="description"
                        text={`${product.category} - ${product.subcategory}`}
                        color="muted"
                      />
                    </Stack>
                  </Stack>

                  <Stack align="end" gap={1}>
                    <Font variant="body-bold" text={formatPrice(product.price)} />
                    <Font
                      variant="description"
                      text={formatStock(product.stock)}
                      color={product.stock > 0 ? "success" : "muted"}
                    />
                  </Stack>
                </Stack>
              </Box>
            </React.Fragment>
          ))}

          {filtered.length === 0 && (
            <EmptyState
              icon={Search}
              title="Nenhum produto encontrado"
              subtitle="Tente buscar por outro termo ou categoria."
            />
          )}
        </Stack>
      </Box>

      {/* Rodapé com contagem */}
      <Font
        variant="description"
        text={`${selectedIds.size} produto${selectedIds.size !== 1 ? "s" : ""} selecionado${selectedIds.size !== 1 ? "s" : ""}`}
        color="muted"
        align="center"
      />
    </Stack>
  )
}
