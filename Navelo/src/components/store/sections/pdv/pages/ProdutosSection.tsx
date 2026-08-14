"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Button } from "@/components/store/base/Button"
import { ProductForm, ProductFormData } from "@/components/store/advanced/ProductForm"
import { FiscalConfigForm, FiscalConfigData } from "@/components/store/advanced/FiscalConfigForm"
import { Package, PackageX, Check } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { ViewTransition } from "@/components/store/base/ViewTransition"
import { ListSectionLayout } from "@/components/store/intermediary/ListSectionLayout"

interface ProductItem extends ProductFormData {
  id: string
}

interface ProdutosSectionProps {
  onBackToDashboard?: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

import { useProducts, dal } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"

export const ProdutosSection: React.FC<ProdutosSectionProps> = ({
  setCustomBack,
  setCustomTitle,
  setCustomActions
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id

  // Produtos do IndexedDB local
  const dbProducts = useProducts(tenantId)

  // Lista agregada de produtos reativa do banco local
  const products: ProductItem[] = React.useMemo(() => {
    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category || p.description || "GERAL",
        unitPrice: p.price || 0,
        stock: p.stock ?? 0,
        unit: p.unit || "UN",
        ncm: p.ncm || "2201.10.00",
        cest: p.cest || "17.110.00",
        cfop: p.cfop || "5.102",
        icmsOrigem: p.icms_origem || "0 - Nacional",
        detailedDescription: p.detailed_description,
        subgroup: p.subgroup,
        minStock: p.min_stock,
        costPrice: p.cost_price,
        otherCosts: p.other_costs,
        margin: p.margin,
        multissaborEnabled: p.multissabor_enabled,
        complementosEnabled: p.complementos_enabled,
        plataformasEnabled: p.plataformas_enabled,
        barcodes: p.barcodes,
        printPoint: p.print_point,
        producaoPropria: p.producao_propria,
        ingredients: p.ingredients,
        preparationMode: p.preparation_mode,
        image: p.image_url || (p as unknown as Record<string, string>).image || "",
        exTipi: (p.fiscal_data?.exTipi as string) || "",
        icmsDefault: (p.fiscal_data?.icmsDefault as boolean) ?? true,
        icmsCsosn: (p.fiscal_data?.icmsCsosn as string) || "500",
        icmsReduction: (p.fiscal_data?.icmsReduction as number) || 0,
        icmsAliquot: (p.fiscal_data?.icmsAliquot as number) || 0,
        pisCofinsDefault: (p.fiscal_data?.pisCofinsDefault as boolean) ?? true,
        pisCofinsCst: (p.fiscal_data?.pisCofinsCst as string) || "99"
      }))
    }
    return []
  }, [dbProducts])

  const [mode, setMode] = React.useState<"list" | "form" | "fiscal-config">("list")
  const [editingProduct, setEditingProduct] = React.useState<ProductItem | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  const scrollPositions = React.useRef<Record<string, number>>({})

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const handleScroll = () => {
      scrollPositions.current[mode] = window.scrollY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [mode])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const savedScroll = scrollPositions.current[mode] || 0
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScroll, behavior: "instant" })
      })
    })
  }, [mode])

  const [defaultFiscalConfig, setDefaultFiscalConfig] = React.useState<FiscalConfigData>({
    csosn: "500",
    reduction: 0,
    aliquot: 0,
    pisCofinsCst: "99",
  })

  React.useEffect(() => {
    if (mode === "form") {
      setCustomBack?.(() => () => setMode("list"))
      setCustomTitle?.(editingProduct ? "Editar Produto" : "Novo Produto")
      setCustomActions?.(
        <Button
          type="submit"
          form="product-form"
          variant="primary-pill-icon"
          icon={Check}
          title="Salvar produto"
        />
      )
    } else if (mode === "fiscal-config") {
      setCustomBack?.(() => () => setMode("form"))
      setCustomTitle?.("Configuração Fiscal Padrão")
      setCustomActions?.(null)
    } else {
      setCustomBack?.(null)
      setCustomTitle?.("Produtos")
      setCustomActions?.(
        <MobileHeaderSearch
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          placeholder="Buscar produto pelo nome..."
        />
      )
    }
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [mode, searchQuery, editingProduct, setCustomBack, setCustomTitle, setCustomActions])

  const handleEdit = (prod: ProductItem) => {
    setEditingProduct(prod)
    setMode("form")
  }

  const handleCreateNew = () => {
    setEditingProduct(null)
    setMode("form")
  }

  const handleSave = async (data: ProductFormData) => {
    const productId = editingProduct ? editingProduct.id : `prod-${Date.now()}`
    const productPayload = {
      id: productId,
      name: data.name.toUpperCase(),
      description: data.category || "",
      category: data.category || "GERAL",
      price: Number(data.unitPrice) || 0,
      stock: Number(data.stock) || 0,
      unit: data.unit || "UN",
      cost_price: Number(data.costPrice) || 0,
      ncm: data.ncm || "",
      cest: data.cest || "",
      cfop: data.cfop || "",
      icms_origem: data.icmsOrigem || "",
      detailed_description: data.detailedDescription || "",
      subgroup: data.subgroup || "",
      min_stock: Number(data.minStock) || 0,
      other_costs: Number(data.otherCosts) || 0,
      margin: Number(data.margin) || 0,
      multissabor_enabled: Boolean(data.multissaborEnabled),
      complementos_enabled: Boolean(data.complementosEnabled),
      plataformas_enabled: Boolean(data.plataformasEnabled),
      producao_propria: Boolean(data.producaoPropria),
      ingredients: data.ingredients || "",
      preparation_mode: data.preparationMode || "",
      barcodes: data.barcodes || [],
      print_point: data.printPoint || "",
      image_url: data.image || "",
      image: data.image || "",
      fiscal_data: {
        exTipi: data.exTipi,
        icmsDefault: data.icmsDefault,
        icmsCsosn: data.icmsCsosn,
        icmsReduction: data.icmsReduction,
        icmsAliquot: data.icmsAliquot,
        pisCofinsDefault: data.pisCofinsDefault,
        pisCofinsCst: data.pisCofinsCst
      },
      active: true,
      category_id: null,
      company_id: tenantId || "demo-tenant",
      tenant_id: tenantId || "demo-tenant"
    }

    if (editingProduct) {
      await dal.products.update(productPayload)
    } else {
      await dal.products.create(productPayload)
    }

    setMode("list")
  }


  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <ViewTransition viewKey={mode} flex="1" minH="0">
        <Stack gap={5} w="full">
      {mode === "list" && (
        <ListSectionLayout<ProductItem>
          title="Produtos"
          items={products}
          searchPlaceholder="Buscar produto por nome ou categoria..."
          searchFilterFn={(prod, query) => {
            const q = query.toLowerCase()
            return (
              prod.name.toLowerCase().includes(q) ||
              (!!prod.category && prod.category.toLowerCase().includes(q))
            )
          }}
          emptyIcon={PackageX}
          emptyTitle="Nenhum produto encontrado"
          emptySubtitle="Tente pesquisar com outro termo ou adicione um novo produto."
          onAdd={handleCreateNew}
          getItemKey={(prod) => prod.id}
          setCustomBack={setCustomBack}
          setCustomTitle={setCustomTitle}
          setCustomActions={setCustomActions}
          renderItem={(prod) => (
            <Box
              w="full"
              paddingY={2.5}
              paddingX={2.5}
              radius="none"
              hoverBg="primary/10"
              cursor="pointer"
              onClick={() => handleEdit(prod)}
            >
              <Stack direction="row" align="center" justify="between" w="full">
                {/* Lado Esquerdo: Ícone/Thumbnail + Nome e Categoria */}
                <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
                  <Box
                    w="w-10"
                    h="h-10"
                    bg="bg-surface-sunken"
                    borderColor="border-border"
                    border={true}
                    radius="default"
                    shrink="0"
                    overflow="hidden"
                  >
                    {prod.image ? (
                      <Box
                        as="img"
                        src={prod.image}
                        alt={prod.name}
                        w="full"
                        h="full"
                        objectFit="cover"
                      />
                    ) : (
                      <Stack w="full" h="full" align="center" justify="center">
                        <Icon icon={Package} size={20} color="muted" />
                      </Stack>
                    )}
                  </Box>

                  <Stack gap={1} align="start" flex="1" minW="0">
                    <Font variant="body" text={prod.name} />
                    <Font
                      variant="auxiliary"
                      color="muted"
                      truncate={true}
                      text={(prod.category || "GERAL").toUpperCase()}
                    />
                  </Stack>
                </Stack>

                {/* Lado Direito: Preço de Venda + Quantidade de Estoque */}
                <Box shrink="0">
                  <Stack gap={1} align="end">
                    <Font variant="body" text={formatPrice(prod.unitPrice)} />
                    <Font variant="auxiliary" color="muted" text={`${prod.stock} UN`} />
                  </Stack>
                </Box>
              </Stack>
            </Box>
          )}
        />
      )}

      {mode === "form" && (
        /* ================= FORMULÁRIO DE PRODUTO ================= */
        <ProductForm
          initialData={editingProduct}
          onCancel={() => setMode("list")}
          onSave={handleSave}
          onAccessFiscalConfig={() => setMode("fiscal-config")}
        />
      )}

      {mode === "fiscal-config" && (
        /* ================= CONFIGURAÇÃO FISCAL PADRÃO ================= */
        <FiscalConfigForm
          initialData={defaultFiscalConfig}
          onCancel={() => setMode("form")}
          onSave={(data) => {
            setDefaultFiscalConfig(data)
            setMode("form")
          }}
        />
      )}
        </Stack>
      </ViewTransition>
    </Box>
  )
}
