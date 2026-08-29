"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Avatar } from "@/components/store/base/Avatar"
import { Button } from "@/components/store/base/Button"
import { Checkbox } from "@/components/store/base/Checkbox"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { Package, PackageX, Check } from "lucide-react"
import { useProducts, Product } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import { UI_STRINGS } from "@/constants/strings"
import {
  loadCatalogoOnlineSettings,
  saveCatalogoOnlineSettings,
  CATALOGO_ONLINE_SETTINGS_EVENT,
  CatalogoOnlineSettings,
} from "@/lib/sync/catalogoOnlineSettings"

export interface CatalogoProdutosSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode) => void
}

interface ProductItem {
  id: string
  name: string
  category?: string
  subgroup?: string
  unitPrice: number
  stock: number
  image?: string
}

function mapDbProduct(p: Product): ProductItem {
  return {
    id: p.id,
    name: p.name || "",
    category: p.category || "",
    subgroup: p.subgroup,
    unitPrice: p.price ?? 0,
    stock: p.stock ?? 0,
    image: p.image_url,
  }
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function formatCategoryHierarchy(prod: ProductItem) {
  if (prod.category && prod.subgroup) return `${prod.category} • ${prod.subgroup}`
  return prod.category || prod.subgroup || "GERAL"
}

function CatalogProductListItemRow({
  prod,
  isSelected,
  onToggle,
}: {
  prod: ProductItem
  isSelected: boolean
  onToggle: () => void
}) {
  return (
    <Box w="full" padding={2.5} radius="none" hoverBg="secondary/10" cursor="pointer" onClick={onToggle}>
      <Stack direction="row" align="center" justify="between" w="full">
        <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
          <Checkbox checked={isSelected} onChange={onToggle} onClick={(e) => e.stopPropagation()} />
          <Avatar image={prod.image} icon={Package} fallback={prod.name.substring(0, 2)} />
          <Stack gap={1} align="start" flex="1" minW="0">
            <Font variant="body" text={prod.name} />
            <Font variant="auxiliary" color="muted" truncate text={formatCategoryHierarchy(prod)} />
          </Stack>
        </Stack>
        <Box shrink="0">
          <Stack gap={1} align="end">
            <Font variant="body" text={formatPrice(prod.unitPrice)} />
            <Font variant="auxiliary" color="muted" text={`${prod.stock} UN`} />
          </Stack>
        </Box>
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

  const [initialSettings, setInitialSettings] = React.useState<CatalogoOnlineSettings>(() => loadCatalogoOnlineSettings())
  const [draftSelectedIds, setDraftSelectedIds] = React.useState<Set<string>>(new Set())
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const products: ProductItem[] = React.useMemo(() => {
    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map(mapDbProduct)
    }
    return []
  }, [dbProducts])

  // Inicializa o draft quando os produtos ou configurações iniciais carregarem
  React.useEffect(() => {
    const fresh = loadCatalogoOnlineSettings()
    setInitialSettings(fresh)
    if (fresh.allProductsSelected) {
      setDraftSelectedIds(new Set(products.map((p) => p.id)))
    } else {
      setDraftSelectedIds(new Set(fresh.selectedProductIds))
    }
  }, [products.length])

  // Sincronização de storage / eventos
  React.useEffect(() => {
    const handleSync = () => {
      const fresh = loadCatalogoOnlineSettings()
      setInitialSettings(fresh)
    }
    window.addEventListener(CATALOGO_ONLINE_SETTINGS_EVENT, handleSync)
    window.addEventListener("storage", handleSync)
    return () => {
      window.removeEventListener(CATALOGO_ONLINE_SETTINGS_EVENT, handleSync)
      window.removeEventListener("storage", handleSync)
    }
  }, [])

  const initialSelectedSet = React.useMemo(() => {
    if (initialSettings.allProductsSelected) {
      return new Set(products.map((p) => p.id))
    }
    return new Set(initialSettings.selectedProductIds)
  }, [initialSettings, products])

  const isDirty = React.useMemo(() => {
    if (draftSelectedIds.size !== initialSelectedSet.size) return true
    for (const id of draftSelectedIds) {
      if (!initialSelectedSet.has(id)) return true
    }
    return false
  }, [draftSelectedIds, initialSelectedSet])

  const filtered = React.useMemo(() => {
    if (!search.trim()) return products
    const query = search.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.subgroup && p.subgroup.toLowerCase().includes(query))
    )
  }, [products, search])

  const allSelected = filtered.length > 0 && filtered.every((p) => draftSelectedIds.has(p.id))

  const handleToggleProduct = (id: string) => {
    setDraftSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleToggleAll = () => {
    setDraftSelectedIds((prev) => {
      const next = new Set(prev)
      if (allSelected) {
        filtered.forEach((p) => next.delete(p.id))
      } else {
        filtered.forEach((p) => next.add(p.id))
      }
      return next
    })
  }

  const handleBack = React.useCallback(() => {
    if (isDirty) {
      setIsDiscardModalOpen(true)
    } else {
      onCancel()
    }
  }, [isDirty, onCancel])

  const handleSave = React.useCallback(() => {
    const isAll = products.length > 0 && products.every((p) => draftSelectedIds.has(p.id))
    const newSettings: CatalogoOnlineSettings = {
      ...initialSettings,
      allProductsSelected: isAll,
      selectedProductIds: Array.from(draftSelectedIds),
    }
    saveCatalogoOnlineSettings(newSettings)
    setInitialSettings(newSettings)
    onCancel()
  }, [draftSelectedIds, products, initialSettings, onCancel])

  const handleBackRef = React.useRef(handleBack)
  const handleSaveRef = React.useRef(handleSave)

  React.useEffect(() => {
    handleBackRef.current = handleBack
    handleSaveRef.current = handleSave
  }, [handleBack, handleSave])

  React.useEffect(() => {
    setCustomBack?.(() => () => handleBackRef.current())
    setCustomTitle?.(s.productsTitle)
    setCustomActions?.(
      <Stack direction="row" align="center" gap={2.5}>
        <MobileHeaderSearch
          searchQuery={search}
          onSearchQueryChange={setSearch}
          placeholder={s.searchProductOrCategoryPlaceholder}
        />
        <Button
          variant="primary-pill-icon"
          icon={Check}
          onClick={() => handleSaveRef.current()}
        />
      </Stack>
    )
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, s.productsTitle, s.searchProductOrCategoryPlaceholder, search])

  return (
    <>
      <Box flex="1" minH="0" h="full" overflowY="auto" w="full" position="relative">
        <Stack gap={0} w="full">
          {/* Linha 'Selecionar todos' no topo da lista */}
          {filtered.length > 0 && (
            <>
              <Box w="full" padding={2.5} radius="none" hoverBg="secondary/10" cursor="pointer" onClick={handleToggleAll}>
                <Stack direction="row" align="center" justify="between" w="full">
                  <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
                    <Checkbox
                      checked={allSelected}
                      onChange={handleToggleAll}
                      onClick={(e) => e.stopPropagation()}
                      label={allSelected ? "Desmarcar todos" : "Selecionar todos"}
                    />
                  </Stack>
                  <Box shrink="0">
                    <Font variant="auxiliary" color="muted" text={`${draftSelectedIds.size} de ${products.length}`} />
                  </Box>
                </Stack>
              </Box>
              <Box h="h-[2px]" w="full" bg="bg-border" />
            </>
          )}

          {/* Lista de Produtos */}
          {filtered.length === 0 ? (
            <EmptyState
              icon={PackageX}
              title={s.noProductsFoundTitle}
              subtitle={s.noProductsFoundSubtitle}
            />
          ) : (
            <Box display="flex" direction="col" w="full">
              {filtered.map((prod, idx) => (
                <Box key={prod.id}>
                  <CatalogProductListItemRow
                    prod={prod}
                    isSelected={draftSelectedIds.has(prod.id)}
                    onToggle={() => handleToggleProduct(prod.id)}
                  />
                  {idx < filtered.length - 1 && (
                    <Box h="h-[2px]" w="full" bg="bg-border" />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Stack>
      </Box>

      {/* Modal de Descarte de Alterações */}
      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          setIsDiscardModalOpen(false)
          onCancel()
        }}
      />
    </>
  )
}
