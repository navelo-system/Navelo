"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Checkbox } from "../../base/Checkbox"
import { Input } from "../../base/Input"
import { EmptyState } from "../../intermediary/EmptyState"
import { Search } from "lucide-react"

interface CatalogProduct {
  id: string
  name: string
  category: string
  subcategory: string
  price: number
  stock: number
}

const MOCK_PRODUCTS: CatalogProduct[] = [
  { id: "1", name: "ÁGUA COM GÁS", category: "BEBIDAS", subcategory: "ÁGUA", price: 5.00, stock: 2 },
  { id: "2", name: "ÁGUA SEM GÁS", category: "BEBIDAS", subcategory: "ÁGUA", price: 3.00, stock: 0 },
  { id: "3", name: "ÁGUA TÔNICA 350ML", category: "BEBIDAS", subcategory: "ÁGUA", price: 6.00, stock: -1 },
  { id: "4", name: "BADEN BADEN CRISTAL 600ML", category: "CERVEJAS ARTESANAIS", subcategory: "ÚNICO", price: 18.00, stock: 0 },
  { id: "5", name: "BADEN BADEN GOLDEN 600ML", category: "CERVEJAS ARTESANAIS", subcategory: "ÚNICO", price: 18.00, stock: 0 },
  { id: "6", name: "BADEN BADEN IPA 600ML", category: "CERVEJAS ARTESANAIS", subcategory: "ÚNICO", price: 18.00, stock: 0 },
  { id: "7", name: "BADEN BADEN PEACH 600ML", category: "CERVEJAS ARTESANAIS", subcategory: "ÚNICO", price: 18.00, stock: -1 },
  { id: "8", name: "BADEN BADEN WITBIER 600ML", category: "CERVEJAS ARTESANAIS", subcategory: "ÚNICO", price: 18.00, stock: 0 },
  { id: "9", name: "BOI", category: "CHURRASCO", subcategory: "BOVINA", price: 10.00, stock: 0 },
  { id: "10", name: "BRAHMA 600ML", category: "CERVEJAS", subcategory: "COM ALCOOL", price: 10.00, stock: 0 },
  { id: "11", name: "BRAHMA LATÃO 473ML", category: "CERVEJAS", subcategory: "COM ALCOOL", price: 8.00, stock: 0 },
  { id: "12", name: "BRAHMA LONG NECK 355ML", category: "CERVEJAS", subcategory: "COM ALCOOL", price: 8.00, stock: 0 },
  { id: "13", name: "COCA-COLA 350ML", category: "BEBIDAS", subcategory: "REFRIGERANTE", price: 6.00, stock: 5 },
  { id: "14", name: "COCA-COLA ZERO 350ML", category: "BEBIDAS", subcategory: "REFRIGERANTE", price: 6.00, stock: 3 },
  { id: "15", name: "HEINEKEN 600ML", category: "CERVEJAS", subcategory: "COM ALCOOL", price: 16.00, stock: 4 },
  { id: "16", name: "HEINEKEN LONG NECK 330ML", category: "CERVEJAS", subcategory: "COM ALCOOL", price: 10.00, stock: 0 },
  { id: "17", name: "SUCO DE LARANJA 500ML", category: "BEBIDAS", subcategory: "SUCO", price: 12.00, stock: 0 },
  { id: "18", name: "PASTEL DE CARNE", category: "LANCHES", subcategory: "PASTÉIS", price: 8.00, stock: 0 },
  { id: "19", name: "PASTEL DE QUEIJO", category: "LANCHES", subcategory: "PASTÉIS", price: 8.00, stock: 0 },
  { id: "20", name: "PORÇÃO DE BATATA FRITA", category: "PETISCOS", subcategory: "PORÇÕES", price: 25.00, stock: 0 },
]

export interface CatalogoProdutosSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const CatalogoProdutosSection: React.FC<CatalogoProdutosSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(
    new Set(MOCK_PRODUCTS.slice(0, 11).map((p) => p.id))
  )
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Produtos")
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel])

  const filtered = MOCK_PRODUCTS.filter((p) =>
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
      {/* Subtítulo + busca */}
      <Stack gap={2.5} w="full">
        <Font
          variant="description"
          text="Selecione os produtos para vender no Catálogo Online."
          color="muted"
        />
        <Input
          placeholder="Buscar produto ou categoria..."
          icon={Search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
