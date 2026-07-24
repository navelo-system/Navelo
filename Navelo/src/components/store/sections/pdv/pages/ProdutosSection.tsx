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
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Plus, Package, PackageX } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"

interface ProductItem extends ProductFormData {
  id: string
}

interface ProdutosSectionProps {
  onBackToDashboard?: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: "1",
    name: "ÁGUA COM GÁS",
    category: "BEBIDAS - ÁGUA",
    unitPrice: 6.00,
    stock: 2,
    unit: "UN",
    ncm: "2201.10.00",
    cest: "17.110.00",
    cfop: "5.102",
    icmsOrigem: "0 - Nacional"
  },
  {
    id: "2",
    name: "ÁGUA SEM GÁS",
    category: "BEBIDAS - ÁGUA",
    unitPrice: 3.00,
    stock: -2,
    unit: "UN",
    ncm: "2201.10.00",
    cest: "17.110.00",
    cfop: "5.102",
    icmsOrigem: "0 - Nacional"
  },
  {
    id: "3",
    name: "ÁGUA TÔNICA 350ML",
    category: "BEBIDAS - ÁGUA",
    unitPrice: 6.00,
    stock: -1,
    unit: "UN",
    ncm: "2202.10.00",
    cest: "17.111.00",
    cfop: "5.405",
    icmsOrigem: "0 - Nacional"
  },
  {
    id: "4",
    name: "BADEN BADEN CRISTAL 600ML",
    category: "CERVEJAS ARTESANAIS - UNICO",
    unitPrice: 18.00,
    stock: 0,
    unit: "UN",
    ncm: "2203.00.00",
    cest: "17.022.00",
    cfop: "5.102",
    icmsOrigem: "0 - Nacional"
  },
  {
    id: "5",
    name: "BADEN BADEN GOLDEN 600ML",
    category: "CERVEJAS ARTESANAIS - UNICO",
    unitPrice: 18.00,
    stock: 0,
    unit: "UN",
    ncm: "2203.00.00",
    cest: "17.022.00",
    cfop: "5.102",
    icmsOrigem: "0 - Nacional"
  },
  {
    id: "6",
    name: "BADEN BADEN IPA 600ML",
    category: "CERVEJAS ARTESANAIS - UNICO",
    unitPrice: 18.00,
    stock: 0,
    unit: "UN",
    ncm: "2203.00.00",
    cest: "17.022.00",
    cfop: "5.102",
    icmsOrigem: "0 - Nacional"
  },
  {
    id: "7",
    name: "BADEN BADEN PEACH 600ML",
    category: "CERVEJAS ARTESANAIS - UNICO",
    unitPrice: 18.00,
    stock: -1,
    unit: "UN",
    ncm: "2203.00.00",
    cest: "17.022.00",
    cfop: "5.102",
    icmsOrigem: "0 - Nacional"
  },
  {
    id: "8",
    name: "BADEN BADEN WITBIER 600ML",
    category: "CERVEJAS ARTESANAIS - UNICO",
    unitPrice: 18.00,
    stock: 0,
    unit: "UN",
    ncm: "2203.00.00",
    cest: "17.022.00",
    cfop: "5.102",
    icmsOrigem: "0 - Nacional"
  },
  {
    id: "9",
    name: "BOI",
    category: "CHURRASCO - BOVINA",
    unitPrice: 10.00,
    stock: 0,
    unit: "UN",
    ncm: "0201.30.00",
    cest: "17.010.00",
    cfop: "5.102",
    icmsOrigem: "0 - Nacional"
  },
  {
    id: "10",
    name: "BRAHMA 600ML",
    category: "CERVEJAS - UNICO",
    unitPrice: 10.00,
    stock: 15,
    unit: "UN",
    ncm: "2203.00.00",
    cest: "17.022.00",
    cfop: "5.102",
    icmsOrigem: "0 - Nacional"
  },
]

export const ProdutosSection: React.FC<ProdutosSectionProps> = ({
  setCustomBack,
  setCustomTitle,
  setCustomActions
}) => {
  const [products, setProducts] = React.useState<ProductItem[]>(DEFAULT_PRODUCTS)
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
      setCustomActions?.(null)
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

  const handleSave = (data: ProductFormData) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
              ...p,
              ...data,
              name: data.name.toUpperCase(),
            }
            : p
        )
      )
    } else {
      const newProduct: ProductItem = {
        id: Math.random().toString(),
        ...data,
        name: data.name.toUpperCase(),
      }
      setProducts((prev) => [...prev, newProduct])
    }

    setMode("list")
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Stack gap={5} w="full">
      {mode === "list" && (
        /* ================= LISTAGEM DE PRODUTOS (MINIMALISTA) ================= */
        <Box position="relative" w="full">
          {filtered.length > 0 ? (
            <Box display="flex" direction="col" w="full">
              {filtered.map((prod, idx) => (
                <Box key={prod.id}>
                  <Box
                    w="full"
                    paddingY={2.5}
                    paddingX={2.5}
                    radius="full"
                    hoverBg="surface-sunken"
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
                        >
                          <Stack w="full" h="full" align="center" justify="center">
                            <Icon icon={Package} size={20} color="muted" />
                          </Stack>
                        </Box>

                        <Stack gap={1} align="start" flex="1" minW="0">
                          <Font
                            variant="body"
                            text={prod.name}
                          />
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
                          <Font
                            variant="body"
                            text={formatPrice(prod.unitPrice)}
                          />
                          <Font
                            variant="auxiliary"
                            color="muted"
                            text={`${prod.stock} UN`}
                          />
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                  {idx < filtered.length - 1 && (
                    <Box h="h-[1px]" w="full" bg="bg-border" />
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <EmptyState
              icon={PackageX}
              title="Nenhum produto encontrado"
              subtitle="Tente pesquisar com outro termo ou adicione um novo produto."
            />
          )}

          {/* Botão FAB Flutuante no Canto Inferior Direito */}
          <Box position="fixed" bottom={6} right={6} zIndex="50">
            <Button
              variant="secondary-pill-icon"
              icon={Plus}
              onClick={handleCreateNew}
            />
          </Box>
        </Box>
      )}

      {mode === "form" && (
        /* ================= FORMULÁRIO DE PRODUTO ================= */
        <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
          <ProductForm
            initialData={editingProduct}
            onCancel={() => setMode("list")}
            onSave={handleSave}
            onAccessFiscalConfig={() => setMode("fiscal-config")}
          />
        </Box>
      )}

      {mode === "fiscal-config" && (
        /* ================= CONFIGURAÇÃO FISCAL PADRÃO ================= */
        <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
          <FiscalConfigForm
            initialData={defaultFiscalConfig}
            onCancel={() => setMode("form")}
            onSave={(data) => {
              setDefaultFiscalConfig(data)
              setMode("form")
            }}
          />
        </Box>
      )}
    </Stack>
  )
}
