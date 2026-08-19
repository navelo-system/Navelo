"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Button } from "@/components/store/base/Button"
import { ProductForm, ProductFormData } from "@/components/store/advanced/ProductForm"
import { FiscalConfigForm, FiscalConfigData } from "@/components/store/advanced/FiscalConfigForm"
import { Package, PackageX, Check, Trash2 } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { ViewTransition } from "@/components/store/base/ViewTransition"
import { ListSectionLayout } from "@/components/store/intermediary/ListSectionLayout"
import { useProducts, dal, Product } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import { UI_STRINGS } from "@/constants/strings"

interface ProductItem extends ProductFormData {
  id: string
}

interface ProdutosSectionProps {
  onBackToDashboard?: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function extractProductFiscal(f?: Record<string, unknown>): FiscalConfigData {
  if (!f) return {}
  return {
    nfeItemType: typeof f.nfeItemType === "string" ? f.nfeItemType : "00 - Mercadoria para Revenda",
    icmsCst: typeof f.icmsCst === "string" ? f.icmsCst : "102",
    icmsModBc: typeof f.icmsModBc === "string" ? f.icmsModBc : "3 - Valor da Operação",
    icmsReduction: typeof f.icmsReduction === "number" ? f.icmsReduction : 0,
    icmsAliquot: typeof f.icmsAliquot === "number" ? f.icmsAliquot : 0,
    pisCofinsDefault: typeof f.pisCofinsDefault === "boolean" ? f.pisCofinsDefault : true,
    pisCofinsCst: typeof f.pisCofinsCst === "string" ? f.pisCofinsCst : "99",
  }
}

function extractProductPricing(p: Product) {
  return {
    unitPrice: p.price ?? 0,
    stock: p.stock ?? 0,
    unit: p.unit ?? "UN",
    minStock: p.min_stock,
    costPrice: p.cost_price,
    otherCosts: p.other_costs,
    margin: p.margin,
  }
}

function extractProductMeta(p: Product) {
  return {
    ncm: p.ncm ?? "2201.10.00",
    cest: p.cest ?? "17.110.00",
    cfop: p.cfop ?? "5.102",
    icmsOrigem: p.icms_origem ?? "0 - Nacional",
    detailedDescription: p.detailed_description,
    subgroup: p.subgroup,
    multissaborEnabled: p.multissabor_enabled,
    complementosEnabled: p.complementos_enabled,
    plataformasEnabled: p.plataformas_enabled,
    barcodes: p.barcodes,
    printPoint: p.print_point,
    producaoPropria: p.producao_propria,
    ingredients: p.ingredients,
    preparationMode: p.preparation_mode,
  }
}

function mapProductToItem(p: Product): ProductItem {
  const fiscal = extractProductFiscal(p.fiscal_data as Record<string, unknown> | undefined)
  const pricing = extractProductPricing(p)
  const meta = extractProductMeta(p)
  const image = p.image_url ?? (p as unknown as Record<string, string>).image ?? ""

  return {
    id: p.id,
    name: p.name,
    category: p.category ?? p.description ?? "GERAL",
    image,
    ...pricing,
    ...meta,
    ...fiscal,
  }
}

function extractPayloadCore(data: ProductFormData, editingId?: string, tenantId?: string) {
  return {
    id: editingId ?? `prod-${Date.now()}`,
    name: data.name.toUpperCase(),
    description: data.category ?? "",
    category: data.category ?? "GERAL",
    price: Number(data.unitPrice) || 0,
    stock: Number(data.stock) || 0,
    unit: data.unit ?? "UN",
    cost_price: Number(data.costPrice) || 0,
    company_id: tenantId ?? "demo-tenant",
    tenant_id: tenantId ?? "demo-tenant",
    active: true,
    category_id: null,
  }
}

function extractPayloadToggles(data: ProductFormData) {
  return {
    multissabor_enabled: Boolean(data.multissaborEnabled),
    complementos_enabled: Boolean(data.complementosEnabled),
    plataformas_enabled: Boolean(data.plataformasEnabled),
    producao_propria: Boolean(data.producaoPropria),
  }
}

function extractPayloadFiscalCodes(data: ProductFormData) {
  return {
    ncm: data.ncm ?? "",
    cest: data.cest ?? "",
    cfop: data.cfop ?? "",
    icms_origem: data.icmsOrigem ?? "",
    detailed_description: data.detailedDescription ?? "",
    subgroup: data.subgroup ?? "",
  }
}

function extractPayloadStockCosts(data: ProductFormData) {
  return {
    min_stock: Number(data.minStock) || 0,
    other_costs: Number(data.otherCosts) || 0,
    margin: Number(data.margin) || 0,
    ingredients: data.ingredients ?? "",
    preparation_mode: data.preparationMode ?? "",
    barcodes: data.barcodes ?? [],
    print_point: data.printPoint ?? "",
    image_url: data.image ?? "",
    image: data.image ?? "",
  }
}

function buildProductPayload(data: ProductFormData, editingId?: string, tenantId?: string) {
  const core = extractPayloadCore(data, editingId, tenantId)
  const toggles = extractPayloadToggles(data)
  const fiscalCodes = extractPayloadFiscalCodes(data)
  const stockCosts = extractPayloadStockCosts(data)
  return {
    ...core,
    ...toggles,
    ...fiscalCodes,
    ...stockCosts,
    fiscal_data: {
      exTipi: data.exTipi,
      icmsDefault: data.icmsDefault,
      icmsCsosn: data.icmsCsosn,
      icmsReduction: data.icmsReduction,
      icmsAliquot: data.icmsAliquot,
      pisCofinsDefault: data.pisCofinsDefault,
      pisCofinsCst: data.pisCofinsCst,
    },
  }
}

function ProductListItemRow({ prod, onClick }: { prod: ProductItem; onClick: () => void }) {
  return (
    <Box w="full" paddingY={2.5} paddingX={2.5} radius="none" hoverBg="primary/10" cursor="pointer" onClick={onClick}>
      <Stack direction="row" align="center" justify="between" w="full">
        <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
          <Box w="w-10" h="h-10" bg="bg-surface-sunken" borderColor="border-border" border radius="default" shrink="0" overflow="hidden">
            {prod.image ? (
              <Box as="img" src={prod.image} alt={prod.name} w="full" h="full" objectFit="cover" />
            ) : (
              <Stack w="full" h="full" align="center" justify="center">
                <Icon icon={Package} size={20} color="muted" />
              </Stack>
            )}
          </Box>
          <Stack gap={1} align="start" flex="1" minW="0">
            <Font variant="body" text={prod.name} />
            <Font variant="auxiliary" color="muted" truncate text={(prod.category || "GERAL").toUpperCase()} />
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

function useProductScrollRestore(mode: string) {
  const scrollPositions = React.useRef<Record<string, number>>({})

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const handleScroll = () => { scrollPositions.current[mode] = window.scrollY }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [mode])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const savedScroll = scrollPositions.current[mode] || 0
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { window.scrollTo({ top: savedScroll, behavior: "instant" }) })
    })
  }, [mode])
}

interface ProductHeaderOptions {
  mode: "list" | "form" | "fiscal-config"
  setMode: (m: "list" | "form" | "fiscal-config") => void
  editingProduct: ProductItem | null
  handleDelete: () => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function syncFormHeader(opts: ProductHeaderOptions, s: typeof UI_STRINGS.productsCatalog) {
  opts.setCustomBack?.(() => () => opts.setMode("list"))
  opts.setCustomTitle?.(opts.editingProduct ? "Editar Produto" : "Novo Produto")
  opts.setCustomActions?.(
    <Stack direction="row" gap={2.5} align="center">
      {opts.editingProduct && (
        <Button
          type="button" variant="danger-pill-icon-confirm" icon={Trash2} title={s.deleteProductTitle}
          confirmModal={{
            title: "Excluir Produto", subtitle: "Confirmar exclusão de produto",
            paragraph: `Tem certeza de que deseja excluir o produto "${opts.editingProduct.name}"? Esta ação não poderá ser desfeita.`,
            icon: Trash2, successText: "Confirmar Exclusão",
          }}
          onConfirm={opts.handleDelete}
        />
      )}
      <Button type="submit" form="product-form" variant="primary-pill-icon" icon={Check} title={s.saveProductButton} />
    </Stack>
  )
}

function useProductHeaderEffects(options: ProductHeaderOptions) {
  const { mode, searchQuery, editingProduct, handleDelete, setMode, setCustomBack, setCustomTitle, setCustomActions, setSearchQuery } = options
  const s = UI_STRINGS.productsCatalog

  React.useEffect(() => {
    if (mode === "form") {
      syncFormHeader(options, s)
      return
    }

    if (mode === "fiscal-config") {
      setCustomBack?.(() => () => setMode("form"))
      setCustomTitle?.(UI_STRINGS.products.fiscalConfigTitle)
      setCustomActions?.(null)
      return
    }

    setCustomBack?.(null)
    setCustomTitle?.(s.title)
    setCustomActions?.(
      <MobileHeaderSearch searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} placeholder={s.searchByNamePlaceholder} />
    )
  }, [mode, searchQuery, editingProduct, handleDelete, setMode, setCustomBack, setCustomTitle, setCustomActions, setSearchQuery, options, s])
}

function filterProductByQuery(prod: ProductItem, query: string): boolean {
  const q = query.toLowerCase()
  if (prod.name.toLowerCase().includes(q)) return true
  return Boolean(prod.category && prod.category.toLowerCase().includes(q))
}

export const ProdutosSection: React.FC<ProdutosSectionProps> = ({
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id
  const dbProducts = useProducts(tenantId)
  const s = UI_STRINGS.productsCatalog

  const products: ProductItem[] = React.useMemo(() => {
    if (dbProducts && dbProducts.length > 0) return dbProducts.map(mapProductToItem)
    return []
  }, [dbProducts])

  const [mode, setMode] = React.useState<"list" | "form" | "fiscal-config">("list")
  const [editingProduct, setEditingProduct] = React.useState<ProductItem | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [defaultFiscalConfig, setDefaultFiscalConfig] = React.useState<FiscalConfigData>({
    csosn: "500", reduction: 0, aliquot: 0, pisCofinsCst: "99",
  })

  useProductScrollRestore(mode)

  const handleDelete = React.useCallback(async () => {
    if (!editingProduct) return
    await dal.products.delete(editingProduct.id, tenantId)
    setEditingProduct(null)
    setMode("list")
  }, [editingProduct, tenantId])

  useProductHeaderEffects({
    mode, setMode, editingProduct, handleDelete, searchQuery, setSearchQuery,
    setCustomBack, setCustomTitle, setCustomActions,
  })

  const handleSave = async (data: ProductFormData) => {
    const payload = buildProductPayload(data, editingProduct?.id, tenantId)
    if (editingProduct) await dal.products.update(payload)
    else await dal.products.create(payload)
    setMode("list")
  }

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <ViewTransition viewKey={mode} flex="1" minH="0">
        <Stack gap={5} w="full">
          {mode === "list" && (
            <ListSectionLayout<ProductItem>
              title={s.title} items={products} searchPlaceholder={s.searchPlaceholder}
              searchFilterFn={filterProductByQuery}
              emptyIcon={PackageX} emptyTitle={s.emptyTitle} emptySubtitle={s.emptySubtitle}
              onAdd={() => { setEditingProduct(null); setMode("form") }}
              getItemKey={(prod) => prod.id}
              setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions}
              renderItem={(prod) => (
                <ProductListItemRow prod={prod} onClick={() => { setEditingProduct(prod); setMode("form") }} />
              )}
            />
          )}
          {mode === "form" && (
            <ProductForm
              initialData={editingProduct} onCancel={() => setMode("list")} onSave={handleSave}
              onAccessFiscalConfig={() => setMode("fiscal-config")}
            />
          )}
          {mode === "fiscal-config" && (
            <FiscalConfigForm
              initialData={defaultFiscalConfig} onCancel={() => setMode("form")}
              onSave={(data) => { setDefaultFiscalConfig(data); setMode("form") }}
            />
          )}
        </Stack>
      </ViewTransition>
    </Box>
  )
}
