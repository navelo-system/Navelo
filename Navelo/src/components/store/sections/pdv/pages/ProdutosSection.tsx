"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Avatar } from "@/components/store/base/Avatar"
import { Button } from "@/components/store/base/Button"
import { ProductForm, ProductFormData } from "@/components/store/advanced/ProductForm"
import { FiscalConfigForm, FiscalConfigData } from "@/components/store/advanced/FiscalConfigForm"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { Package, PackageX, Check, Trash2 } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { ViewTransition } from "@/components/store/base/ViewTransition"
import { ListSectionLayout } from "@/components/store/intermediary/ListSectionLayout"
import { useProducts, dal } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import { useAppNavigation } from "@/lib/navigation/NavigationContext"
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

interface ExtractedFiscal {
  exTipi?: string
  icmsDefault?: boolean
  icmsCsosn?: string
  icmsReduction?: number
  icmsAliquot?: number
  pisCofinsDefault?: boolean
  pisCofinsCst?: string
  multissaborLimit?: number
  multissaborPricingMode?: "proporcional" | "maior"
  plataformasPriceDifferent?: number
}

function extractTaxFiscal(raw: Record<string, unknown>) {
  return {
    exTipi: typeof raw.exTipi === "string" ? raw.exTipi : undefined,
    icmsDefault: typeof raw.icmsDefault === "boolean" ? raw.icmsDefault : undefined,
    icmsCsosn: typeof raw.icmsCsosn === "string" ? raw.icmsCsosn : undefined,
    icmsReduction: typeof raw.icmsReduction === "number" ? raw.icmsReduction : undefined,
    icmsAliquot: typeof raw.icmsAliquot === "number" ? raw.icmsAliquot : undefined,
    pisCofinsDefault: typeof raw.pisCofinsDefault === "boolean" ? raw.pisCofinsDefault : undefined,
    pisCofinsCst: typeof raw.pisCofinsCst === "string" ? raw.pisCofinsCst : undefined,
  }
}

function extractFiscal(raw?: Record<string, unknown>): ExtractedFiscal {
  if (!raw) return {}
  return {
    ...extractTaxFiscal(raw),
    multissaborLimit: typeof raw.multissabor_limit === "number" ? raw.multissabor_limit : undefined,
    multissaborPricingMode: (raw.multissabor_pricing_mode as "proporcional" | "maior") || undefined,
    plataformasPriceDifferent: typeof raw.plataformas_price_different === "number" ? raw.plataformas_price_different : undefined,
  }
}

function mapDbProduct(p: NonNullable<ReturnType<typeof useProducts>>[number]): ProductItem {
  const f = extractFiscal(p.fiscal_data)
  return {
    id: p.id,
    name: p.name || "",
    category: p.category || "",
    unitPrice: p.price ?? 0,
    stock: p.stock ?? 0,
    unit: p.unit || "UN",
    ncm: p.ncm,
    cest: p.cest,
    cfop: p.cfop,
    icmsOrigem: p.icms_origem,
    image: p.image_url,
    detailedDescription: p.detailed_description,
    subgroup: p.subgroup,
    minStock: p.min_stock,
    costPrice: p.cost_price,
    otherCosts: p.other_costs,
    margin: p.margin,
    multissaborEnabled: p.multissabor_enabled,
    multissaborLimit: p.multissabor_limit ?? f.multissaborLimit,
    multissaborPricingMode: p.multissabor_pricing_mode ?? f.multissaborPricingMode,
    complementosEnabled: p.complementos_enabled,
    plataformasEnabled: p.plataformas_enabled,
    plataformasPriceDifferent: p.plataformas_price_different ?? f.plataformasPriceDifferent,
    barcodes: p.barcodes,
    printPoint: p.print_point,
    producaoPropria: p.producao_propria,
    ingredients: p.ingredients,
    preparationMode: p.preparation_mode,
    ...f,
  }
}

function buildProductPayload(data: ProductFormData, existingId?: string, tenantId?: string) {
  return {
    id: existingId || crypto.randomUUID(),
    company_id: tenantId || "demo-tenant",
    tenant_id: tenantId || "demo-tenant",
    name: data.name.trim(),
    category: data.category,
    subgroup: data.subgroup,
    price: data.unitPrice,
    cost_price: data.costPrice,
    other_costs: data.otherCosts,
    margin: data.margin,
    stock: data.stock,
    min_stock: data.minStock,
    unit: data.unit || "UN",
    multissabor_enabled: data.multissaborEnabled,
    multissabor_limit: data.multissaborLimit,
    multissabor_pricing_mode: data.multissaborPricingMode,
    complementos_enabled: data.complementosEnabled,
    plataformas_enabled: data.plataformasEnabled,
    plataformas_price_different: data.plataformasPriceDifferent,
    barcodes: data.barcodes,
    print_point: data.printPoint,
    producao_propria: data.producaoPropria,
    ingredients: data.ingredients,
    preparation_mode: data.preparationMode,
    image_url: data.image,
    detailed_description: data.detailedDescription,
    ncm: data.ncm,
    cest: data.cest,
    cfop: data.cfop,
    icms_origem: data.icmsOrigem,
    fiscal_data: {
      exTipi: data.exTipi,
      icmsDefault: data.icmsDefault,
      icmsCsosn: data.icmsCsosn,
      icmsReduction: data.icmsReduction,
      icmsAliquot: data.icmsAliquot,
      pisCofinsDefault: data.pisCofinsDefault,
      pisCofinsCst: data.pisCofinsCst,
      multissabor_limit: data.multissaborLimit,
      multissabor_pricing_mode: data.multissaborPricingMode,
      plataformas_price_different: data.plataformasPriceDifferent,
    },
  }
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function formatCategoryHierarchy(prod: ProductItem) {
  if (prod.category && prod.subgroup) return `${prod.category} • ${prod.subgroup}`
  return prod.category || prod.subgroup || "GERAL"
}

function ProductListItemRow({
  prod,
  onClick,
}: {
  prod: ProductItem
  onClick: () => void
}) {
  return (
    <Box w="full" padding={2.5} radius="none" hoverBg="secondary/10" cursor="pointer" onClick={onClick}>
      <Stack direction="row" align="center" justify="between" w="full">
        <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
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

interface ProductHeaderSyncProps {
  mode: "list" | "form" | "fiscal-config"
  editingProduct: ProductItem | null
  searchQuery: string
  setSearchQuery: (q: string) => void
  handleDelete: () => void
  handleSaveTrigger: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onCancelForm: () => void
}

function useProductHeaderSync(props: ProductHeaderSyncProps) {
  const {
    mode, editingProduct, searchQuery, setSearchQuery, handleDelete,
    handleSaveTrigger, setCustomBack, setCustomTitle, setCustomActions, onCancelForm,
  } = props
  const s = UI_STRINGS.productsCatalog

  React.useEffect(() => {
    if (mode === "form" || mode === "fiscal-config") {
      setCustomBack?.(() => onCancelForm)
      setCustomTitle?.(
        mode === "fiscal-config"
          ? s.fiscalConfigTitle
          : editingProduct
            ? s.editProductTitle
            : s.newProductTitle
      )
      setCustomActions?.(
        <Stack direction="row" align="center" gap={2.5}>
          {editingProduct && mode === "form" && (
            <Button
              type="button"
              variant="danger-pill-icon-confirm"
              icon={Trash2}
              confirmModal={{
                title: "Excluir Produto",
                subtitle: "Confirmar exclusão de item",
                paragraph: `Tem certeza de que deseja excluir o produto "${editingProduct.name}"? Esta ação não poderá ser desfeita.`,
                icon: Trash2,
                successText: "Confirmar Exclusão",
              }}
              onConfirm={handleDelete}
            />
          )}
          <Button
            type="button"
            variant="primary-icon"
            icon={Check}
            onClick={handleSaveTrigger}
          />
        </Stack>
      )
    } else {
      setCustomBack?.(null)
      setCustomTitle?.(s.title)
      setCustomActions?.(
        <MobileHeaderSearch
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          placeholder={s.searchPlaceholder}
        />
      )
    }
  }, [
    mode, editingProduct, searchQuery, s.fiscalConfigTitle, s.editProductTitle,
    s.newProductTitle, s.title, s.searchPlaceholder, handleDelete, handleSaveTrigger,
    onCancelForm, setCustomBack, setCustomTitle, setCustomActions, setSearchQuery,
  ])

  React.useEffect(() => () => {
    setCustomBack?.(null)
    setCustomTitle?.(null)
    setCustomActions?.(null)
  }, [setCustomBack, setCustomTitle, setCustomActions])
}

function useProductFormManager(opts: {
  tenantId?: string
  editingProduct: ProductItem | null
  mode: "list" | "form" | "fiscal-config"
  goBack: (fallback?: string) => void
}) {
  const { tenantId, editingProduct, mode, goBack } = opts
  const [isDirty, setIsDirty] = React.useState(false)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  const handleDelete = React.useCallback(async () => {
    if (!editingProduct) return
    await dal.products.delete(editingProduct.id, tenantId)
    setIsDirty(false)
    goBack("#produtos")
  }, [editingProduct, tenantId, goBack])

  const handleRequestCancel = React.useCallback(() => {
    if (mode === "fiscal-config") {
      goBack(editingProduct ? `#produtos/${editingProduct.id}/edit` : "#produtos/new")
      return
    }
    if (isDirty) {
      setIsDiscardModalOpen(true)
    } else {
      goBack("#produtos")
    }
  }, [isDirty, mode, editingProduct, goBack])

  const handleSave = async (data: ProductFormData) => {
    try {
      const payload = buildProductPayload(data, editingProduct?.id, tenantId)
      if (editingProduct) await dal.products.update(payload)
      else await dal.products.create(payload)
      setIsDirty(false)
      goBack("#produtos")
    } catch (err) {
      console.error("[ProdutosSection] Erro ao salvar produto:", err)
    }
  }

  return {
    isDirty, setIsDirty, isDiscardModalOpen, setIsDiscardModalOpen,
    handleDelete, handleRequestCancel, handleSave,
  }
}

export const ProdutosSection: React.FC<ProdutosSectionProps> = ({
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const tenantCtx = useTenant()
  const { currentRoute, navigate, goBack } = useAppNavigation()
  const tenantId = tenantCtx?.currentTenant?.id
  const dbProducts = useProducts(tenantId)
  const s = UI_STRINGS.productsCatalog

  const products = React.useMemo(() => (dbProducts?.length ? dbProducts.map(mapDbProduct) : []), [dbProducts])

  const isProductRoute = currentRoute.view === "produtos" || currentRoute.view === "novo-produto"
  const isCreateMode =
    currentRoute.view === "novo-produto" ||
    (currentRoute.view === "produtos" && (currentRoute.params.action === "new" || currentRoute.action === "new"))
  const editingProductId = isProductRoute ? (currentRoute.params.id || currentRoute.entityId) : undefined
  const editingProduct = React.useMemo(
    () => (editingProductId ? products.find((p) => p.id === editingProductId) || null : null),
    [products, editingProductId]
  )
  const isFiscal = isProductRoute && (currentRoute.params.action === "fiscal" || currentRoute.action === "fiscal")
  const mode: "list" | "form" | "fiscal-config" =
    isFiscal
      ? "fiscal-config"
      : isCreateMode || Boolean(editingProductId)
        ? "form"
        : "list"

  const [searchQuery, setSearchQuery] = React.useState("")
  const [defaultFiscalConfig, setDefaultFiscalConfig] = React.useState<FiscalConfigData>({
    csosn: "500", reduction: 0, aliquot: 0, pisCofinsCst: "99",
  })
  const productFormSubmitRef = React.useRef<(() => void) | null>(null)

  const formMgr = useProductFormManager({ tenantId, editingProduct, mode, goBack })

  useProductHeaderSync({
    mode, editingProduct, searchQuery, setSearchQuery, handleDelete: formMgr.handleDelete,
    handleSaveTrigger: () => productFormSubmitRef.current?.(),
    setCustomBack, setCustomTitle, setCustomActions, onCancelForm: formMgr.handleRequestCancel,
  })

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <ViewTransition viewKey={mode} flex="1" minH="0">
        <Stack gap={5} w="full">
          {mode === "list" && (
            <ListSectionLayout<ProductItem>
              title={s.title}
              items={products}
              searchPlaceholder={s.searchPlaceholder}
              searchFilterFn={(prod: ProductItem, query: string) => {
                const q = query.toLowerCase()
                const categoryMatch = prod.category ? prod.category.toLowerCase().includes(q) : false
                const subgroupMatch = prod.subgroup ? prod.subgroup.toLowerCase().includes(q) : false
                return prod.name.toLowerCase().includes(q) || categoryMatch || subgroupMatch
              }}
              emptyIcon={PackageX}
              emptyTitle={s.emptyTitle}
              emptySubtitle={s.emptySubtitle}
              onAdd={() => {
                formMgr.setIsDirty(false)
                navigate("#produtos?action=new")
              }}
              getItemKey={(prod: ProductItem) => prod.id}
              setCustomBack={setCustomBack}
              setCustomTitle={setCustomTitle}
              setCustomActions={setCustomActions}
              renderItem={(prod: ProductItem) => (
                <ProductListItemRow
                  prod={prod}
                  onClick={() => {
                    formMgr.setIsDirty(false)
                    navigate(`#produtos?id=${prod.id}&action=edit`)
                  }}
                />
              )}
            />
          )}
          {mode === "form" && (
            <ProductForm
              initialData={editingProduct}
              onCancel={formMgr.handleRequestCancel}
              onSave={formMgr.handleSave}
              onAccessFiscalConfig={() => {
                if (editingProduct) navigate(`#produtos?id=${editingProduct.id}&action=fiscal`)
                else navigate("#produtos?action=fiscal")
              }}
              onDirtyChange={formMgr.setIsDirty}
              onSubmitRef={productFormSubmitRef}
            />
          )}
          {mode === "fiscal-config" && (
            <FiscalConfigForm
              initialData={defaultFiscalConfig}
              onCancel={() => goBack("#produtos")}
              onSave={(data: FiscalConfigData) => {
                setDefaultFiscalConfig(data)
                goBack("#produtos")
              }}
            />
          )}
        </Stack>
      </ViewTransition>
      <DiscardChangesModal
        isOpen={formMgr.isDiscardModalOpen}
        onClose={() => formMgr.setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          formMgr.setIsDiscardModalOpen(false)
          formMgr.setIsDirty(false)
          goBack("#produtos")
        }}
      />
    </Box>
  )
}
