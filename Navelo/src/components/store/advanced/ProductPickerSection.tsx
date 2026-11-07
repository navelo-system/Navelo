"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Avatar } from "@/components/store/base/Avatar"
import { Input } from "@/components/store/base/Input"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Package, PackageX, Search } from "lucide-react"
import { useProducts } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"

interface ProductItem {
  id: string
  name: string
  category?: string
  subgroup?: string
  unitPrice: number
  stock: number
  unit: string
  image?: string
}

function mapProduct(p: NonNullable<ReturnType<typeof useProducts>>[number]): ProductItem {
  return {
    id: p.id,
    name: p.name || "",
    category: p.category || undefined,
    subgroup: p.subgroup || undefined,
    unitPrice: p.price ?? 0,
    stock: p.stock ?? 0,
    unit: p.unit || "UN",
    image: p.image_url || undefined,
  }
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function formatCategory(prod: ProductItem) {
  if (prod.category && prod.subgroup) return `${prod.category} • ${prod.subgroup}`
  return prod.category || prod.subgroup || "GERAL"
}

export interface ProductPickerSectionProps {
  title: string
  selectedProductId?: string
  onSelect: (product: { id: string; name: string }) => void
  onBack: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

export const ProductPickerSection: React.FC<ProductPickerSectionProps> = ({
  title,
  selectedProductId,
  onSelect,
  onBack,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("")
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "default"
  const rawProducts = useProducts(tenantId)
  const products: ProductItem[] = React.useMemo(
    () => (Array.isArray(rawProducts) ? rawProducts.map(mapProduct) : []),
    [rawProducts]
  )

  const filtered = React.useMemo(() => {
    if (!searchQuery.trim()) return products
    const q = searchQuery.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q) ||
        (p.subgroup || "").toLowerCase().includes(q)
    )
  }, [products, searchQuery])

  const onBackRef = React.useRef(onBack)
  const setCustomBackRef = React.useRef(setCustomBack)
  const setCustomTitleRef = React.useRef(setCustomTitle)
  const setCustomActionsRef = React.useRef(setCustomActions)

  React.useEffect(() => {
    onBackRef.current = onBack
    setCustomBackRef.current = setCustomBack
    setCustomTitleRef.current = setCustomTitle
    setCustomActionsRef.current = setCustomActions
  })

  React.useEffect(() => {
    setCustomBackRef.current?.(() => () => onBackRef.current())
    setCustomTitleRef.current?.(title)
    setCustomActionsRef.current?.(null)
    return () => {
      setCustomBackRef.current?.(null)
      setCustomTitleRef.current?.(null)
      setCustomActionsRef.current?.(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title])

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <Stack gap={0} w="full">
        {/* Search bar */}
        <Box padding={5} w="full" borderBottom borderColor="border-border">
          <Input
            placeholder="Buscar produto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </Box>

        {/* List */}
        <Box bg="bg-white" border borderColor="border-border" radius="default" overflow="hidden" w="full" marginTop={5} marginX={5} style={{ width: "calc(100% - 40px)" }}>
          {filtered.length === 0 ? (
            <Box padding={5}>
              <EmptyState icon={PackageX} title="Nenhum produto encontrado" subtitle="Tente outro termo de busca ou cadastre um produto." />
            </Box>
          ) : (
            <Stack gap={0} w="full">
              {filtered.map((prod, idx) => (
                <React.Fragment key={prod.id}>
                  {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
                  <Box
                    w="full"
                    padding={2.5}
                    hoverBg="secondary/10"
                    cursor="pointer"
                    bg={prod.id === selectedProductId ? "secondary/10" : undefined}
                    onClick={() => {
                      onSelect({ id: prod.id, name: prod.name })
                      onBack()
                    }}
                  >
                    <Stack direction="row" align="center" justify="between" w="full">
                      <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
                        <Avatar image={prod.image} icon={Package} fallback={prod.name.substring(0, 2)} />
                        <Stack gap={1} align="start" flex="1" minW="0">
                          <Font variant="body" text={prod.name} />
                          <Font variant="auxiliary" color="muted" truncate text={formatCategory(prod)} />
                        </Stack>
                      </Stack>
                      <Box shrink="0">
                        <Stack gap={1} align="end">
                          <Font variant="body" text={formatPrice(prod.unitPrice)} />
                          <Font variant="auxiliary" color="muted" text={`${prod.stock} ${prod.unit}`} />
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                </React.Fragment>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </Box>
  )
}
