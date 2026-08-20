"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
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

function buildBasicProductPayload(d: ProductFormData) {
  return {
    name: d.name,
    category: d.category,
    price: d.unitPrice,
    stock: d.stock,
    unit: d.unit,
    ncm: d.ncm,
    cest: d.cest,
    cfop: d.cfop,
    icms_origem: d.icmsOrigem,
    image_url: d.image,
    detailed_description: d.detailedDescription,
    subgroup: d.subgroup,
    min_stock: d.minStock,
    cost_price: d.costPrice,
    other_costs: d.otherCosts,
    margin: d.margin,
  }
}

function buildExtraProductPayload(d: ProductFormData) {
  return {
    multissabor_enabled: d.multissaborEnabled,
    multissabor_limit: d.multissaborLimit,
    multissabor_pricing_mode: d.multissaborPricingMode,
    complementos_enabled: d.complementosEnabled,
    plataformas_enabled: d.plataformasEnabled,
    plataformas_price_different: d.plataformasPriceDifferent,
    barcodes: d.barcodes,
    print_point: d.printPoint,
    producao_propria: d.producaoPropria,
    ingredients: d.ingredients,
    preparation_mode: d.preparationMode,
    fiscal_data: {
      exTipi: d.exTipi,
      icmsDefault: d.icmsDefault,
      icmsCsosn: d.icmsCsosn,
      icmsReduction: d.icmsReduction,
      icmsAliquot: d.icmsAliquot,
      pisCofinsDefault: d.pisCofinsDefault,
      pisCofinsCst: d.pisCofinsCst,
    },
  }
}

function buildProductPayload(
  d: ProductFormData,
  editingId: string | undefined,
  tenantId: string | undefined
) {
  return {
    id: editingId || crypto.randomUUID(),
    company_id: tenantId,
    tenant_id: tenantId,
    ...buildBasicProductPayload(d),
    ...buildExtraProductPayload(d),
    created_at: new Date().toISOString(),
  }
}

const formatPrice = (val?: number) => {
  if (val === undefined || val === null || isNaN(val)) return "R$ 0,00"
  return `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatCategoryHierarchy(prod: ProductItem): string {
  const category = (prod.category || "GERAL").toUpperCase()
  const subgroup = prod.subgroup?.trim().toUpperCase()
  return subgroup ? `${category} > ${subgroup}` : category
}

function ProductListItemRow({
  prod,
  onClick,
}: {
  prod: ProductItem
  onClick: () => void
}) {
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
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onCancelForm?: () => void
}

interface FormActionsProps {
  editingProduct: ProductItem | null
  handleDelete: () => void
  handleSaveTrigger: () => void
  deleteTitle: string
  saveTitle: string
}

function renderFormActions(props: FormActionsProps) {
  const { editingProduct, handleDelete, handleSaveTrigger, deleteTitle, saveTitle } = props
  return (
    <Stack direction="row" gap={2.5} align="center">
      {editingProduct && (
        <Button
          type="button"
          variant="danger-pill-icon-confirm"
          icon={Trash2}
          title={deleteTitle}
          confirmModal={{
            title: "Excluir Produto",
            subtitle: "Confirmar exclusão de produto",
            paragraph: `Tem certeza de que deseja excluir o produto "${editingProduct.name}"? Esta ação não poderá ser desfeita.`,
            icon: Trash2,
            successText: "Confirmar Exclusão",
          }}
          onConfirm={handleDelete}
        />
      )}
      <Button type="button" variant="primary-pill-icon" icon={Check} title={saveTitle} onClick={handleSaveTrigger} />
    </Stack>
  )
}

function getHeaderState(
  mode: "list" | "form" | "fiscal-config",
  editingProduct: ProductItem | null,
  titleMain: string
) {
  if (mode === "form") {
    return { title: editingProduct ? "Editar Produto" : "Novo Produto", hasBack: true }
  }
  if (mode === "fiscal-config") {
    return { title: UI_STRINGS.productsCatalog.fiscalConfigTitle, hasBack: true }
  }
  return { title: titleMain, hasBack: false }
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
  onCancelForm?: () => void
}

function useProductHeaderSync(props: ProductHeaderSyncProps) {
  const {
    mode, editingProduct, searchQuery, setSearchQuery, handleDelete, handleSaveTrigger,
    setCustomBack, setCustomTitle, setCustomActions, onCancelForm,
  } = props

  const onCancelFormRef = React.useRef(onCancelForm)
  const handleSaveTriggerRef = React.useRef(handleSaveTrigger)
  React.useEffect(() => {
    onCancelFormRef.current = onCancelForm
    handleSaveTriggerRef.current = handleSaveTrigger
  })

  React.useEffect(() => {
    const s = UI_STRINGS.productsCatalog
    const { title, hasBack } = getHeaderState(mode, editingProduct, s.title)
    setCustomTitle?.(title)
    setCustomBack?.(hasBack ? () => () => onCancelFormRef.current?.() : null)

    if (mode === "form") {
      setCustomActions?.(renderFormActions({
        editingProduct, handleDelete, handleSaveTrigger: () => handleSaveTriggerRef.current(),
        deleteTitle: s.deleteProductTitle, saveTitle: s.saveProductButton,
      }))
    } else if (mode === "list") {
      setCustomActions?.(<MobileHeaderSearch searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} placeholder={s.searchByNamePlaceholder} />)
    } else {
      setCustomActions?.(null)
    }
  }, [mode, searchQuery, setSearchQuery, editingProduct, handleDelete, setCustomBack, setCustomTitle, setCustomActions])

  React.useEffect(() => () => {
    setCustomBack?.(null)
    setCustomTitle?.(null)
    setCustomActions?.(null)
  }, [setCustomBack, setCustomTitle, setCustomActions])
}

interface ProductFormManagerOpts {
  tenantId: string | undefined
  editingProduct: ProductItem | null
  setEditingProduct: (p: ProductItem | null) => void
  setMode: (m: "list" | "form" | "fiscal-config") => void
  mode: "list" | "form" | "fiscal-config"
}

function useProductFormManager(opts: ProductFormManagerOpts) {
  const { tenantId, editingProduct, setEditingProduct, setMode, mode } = opts
  const [isDirty, setIsDirty] = React.useState(false)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  const handleDelete = React.useCallback(async () => {
    if (!editingProduct) return
    await dal.products.delete(editingProduct.id, tenantId)
    setIsDirty(false)
    setEditingProduct(null)
    setMode("list")
  }, [editingProduct, tenantId, setEditingProduct, setMode])

  const handleRequestCancel = React.useCallback(() => {
    if (mode === "fiscal-config") {
      setMode("form")
      return
    }
    if (isDirty) {
      setIsDiscardModalOpen(true)
    } else {
      setMode("list")
    }
  }, [isDirty, mode, setMode])

  const handleSave = async (data: ProductFormData) => {
    try {
      const payload = buildProductPayload(data, editingProduct?.id, tenantId)
      if (editingProduct) await dal.products.update(payload)
      else await dal.products.create(payload)
      setIsDirty(false)
      setEditingProduct(null)
      setMode("list")
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
  const tenantId = tenantCtx?.currentTenant?.id
  const dbProducts = useProducts(tenantId)
  const s = UI_STRINGS.productsCatalog

  const products = React.useMemo(() => (dbProducts?.length ? dbProducts.map(mapDbProduct) : []), [dbProducts])

  const [mode, setMode] = React.useState<"list" | "form" | "fiscal-config">("list")
  const [editingProduct, setEditingProduct] = React.useState<ProductItem | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [defaultFiscalConfig, setDefaultFiscalConfig] = React.useState<FiscalConfigData>({
    csosn: "500", reduction: 0, aliquot: 0, pisCofinsCst: "99",
  })
  const productFormSubmitRef = React.useRef<(() => void) | null>(null)

  const formMgr = useProductFormManager({ tenantId, editingProduct, setEditingProduct, setMode, mode })

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
              onAdd={() => { setEditingProduct(null); formMgr.setIsDirty(false); setMode("form") }}
              getItemKey={(prod: ProductItem) => prod.id}
              setCustomBack={setCustomBack}
              setCustomTitle={setCustomTitle}
              setCustomActions={setCustomActions}
              renderItem={(prod: ProductItem) => <ProductListItemRow prod={prod} onClick={() => { setEditingProduct(prod); formMgr.setIsDirty(false); setMode("form") }} />}
            />
          )}
          {mode === "form" && (
            <ProductForm
              initialData={editingProduct}
              onCancel={formMgr.handleRequestCancel}
              onSave={formMgr.handleSave}
              onAccessFiscalConfig={() => setMode("fiscal-config")}
              onDirtyChange={formMgr.setIsDirty}
              onSubmitRef={productFormSubmitRef}
            />
          )}
          {mode === "fiscal-config" && (
            <FiscalConfigForm initialData={defaultFiscalConfig} onCancel={() => setMode("form")} onSave={(data: FiscalConfigData) => { setDefaultFiscalConfig(data); setMode("form") }} />
          )}
        </Stack>
      </ViewTransition>
      <DiscardChangesModal
        isOpen={formMgr.isDiscardModalOpen}
        onClose={() => formMgr.setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          formMgr.setIsDiscardModalOpen(false)
          formMgr.setIsDirty(false)
          setMode("list")
        }}
      />
    </Box>
  )
}
