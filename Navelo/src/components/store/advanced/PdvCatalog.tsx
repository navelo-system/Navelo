"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Tabs, TabsTrigger } from "@/components/store/base/Tabs"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { ProductCard } from "@/components/store/advanced/ProductCard"
import { Product, ProductType, UnitType } from "@/src/types/domain"
import {
  Package,
  Minus,
  Plus,
  Trash2
} from "lucide-react"
import { Button } from "@/components/store/base/Button"
import { CartItemType } from "@/components/store/sections/pdv/pages/PdvSection"

export interface MockProduct {
  id: string
  name: string
  image?: string
  unit?: string
  stock?: number
  unitPrice: number
  category: string
}

interface PdvCatalogProps {
  activeCategory: string
  onActiveCategoryChange: (val: string) => void
  filteredProducts: MockProduct[]
  onAddProduct: (prod: MockProduct) => void
  categories: string[]
  viewMode: "grade" | "lista"
  cartSidebarNode?: React.ReactNode
  cartItems?: CartItemType[]
  onIncrease?: (id: string) => void
  onDecrease?: (id: string) => void
  onRemove?: (id: string) => void
}

const adaptProduct = (prod: MockProduct): Product => ({
  id: prod.id,
  tenantId: "1",
  name: prod.name,
  type: ProductType.SIMPLE,
  mainImage: prod.image,
  unitType: prod.unit === "UN" ? UnitType.UN : UnitType.KG,
  categoryId: "1",
  stock: prod.stock || 0,
  minStock: 0,
  costPrice: 0,
  otherCosts: 0,
  marginPercentage: 0,
  sellingPrice: prod.unitPrice,
  isActive: true
})

export const PdvCatalog: React.FC<PdvCatalogProps> = ({
  activeCategory,
  onActiveCategoryChange,
  filteredProducts,
  onAddProduct,
  categories,
  viewMode,
  cartSidebarNode,
  cartItems = [],
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const getProductQuantity = (id: string) => {
    return cartItems.find((item) => item.id === id)?.quantity || 0
  }

  return (
    <Stack gap={5} className="flex-1 min-h-0">

      {/* Abas de Categorias */}
      <Box w="full" overflow="auto" paddingY={1} shrink="0">
        <Tabs value={activeCategory} onValueChange={onActiveCategoryChange}>
          <Stack direction="row" gap={2.5}>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
              </TabsTrigger>
            ))}
            {cartSidebarNode && (
              <Box display="block md:hidden">
                <TabsTrigger value="Resumo">Resumo</TabsTrigger>
              </Box>
            )}
          </Stack>
        </Tabs>
      </Box>

      {/* Grade/Lista de Produtos ou Carrinho */}
      <Box padding={1} flex="1" className="min-h-0 overflow-y-auto">
        {activeCategory === "Resumo" && cartSidebarNode ? (
          cartSidebarNode
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Sem produtos"
            subtitle="Nenhum produto cadastrado nesta categoria."
          />
        ) : viewMode === "grade" ? (
          <Stack direction="row" wrap={true} gap={5} justify="between" align="stretch" w="full">
            {filteredProducts.map((prod) => {
              const qty = getProductQuantity(prod.id)
              return (
                <Box key={prod.id} minW="min-w-[105px] md:min-w-[120px]" flex="1" display="flex" direction="col">
                  <ProductCard
                    product={adaptProduct(prod)}
                    onClick={() => onAddProduct(prod)}
                    quantity={qty}
                    onIncrease={() => onIncrease?.(prod.id)}
                    onDecrease={() => onDecrease?.(prod.id)}
                    onRemove={() => onRemove?.(prod.id)}
                  />
                </Box>
              )
            })}
          </Stack>
        ) : (
          /* Lista limpa — thumbnail + nome + preço/unidade */
          <Box display="flex" direction="col" radius="default" border={true} borderColor="border-border" bg="bg-white">
            {filteredProducts.map((prod, idx) => {
              const qty = getProductQuantity(prod.id)
              return (
                <Box key={prod.id}>
                  <Box
                    w="full"
                    paddingX={2.5}
                    paddingY={2.5}
                    hoverBg="surface-sunken"
                    onClick={() => {
                      if (qty === 0) onAddProduct(prod)
                    }}
                    cursor={qty === 0 ? "pointer" : undefined}
                  >
                    <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" gap={2.5} w="full">
                      {/* Thumbnail + Nome */}
                      <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
                        <Box w="w-10" h="h-10" bg="bg-surface-sunken" radius="default" overflow="hidden" shrink="0">
                          {prod.image ? (
                            <Box as="img" src={prod.image} alt={prod.name} w="full" h="full" objectFit="cover" />
                          ) : (
                            <Stack align="center" justify="center" w="full" h="full">
                              <Font variant="auxiliary" color="muted" text="—" />
                            </Stack>
                          )}
                        </Box>
                        <Font variant="body-sm-semibold" text={prod.name.toUpperCase()} align="left" />
                      </Stack>
                      {/* Preço + Unidade e Controles */}
                      <Stack direction="row" align="center" gap={2.5} justify="end" w="w-full md:w-auto">
                        <Stack direction="row" align="baseline" gap={1}>
                          <Font
                            variant="body-sm-semibold"
                            text={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(prod.unitPrice)}
                          />
                          <Font variant="auxiliary" color="muted" text={prod.unit || "UN"} />
                        </Stack>
                        {qty > 0 && (
                          <Stack direction="row" align="center" justify="center" gap={2.5}>
                            {qty === 1 ? (
                              <Button variant="danger-icon-xs" icon={Trash2} onClick={(e) => { e.stopPropagation(); onRemove?.(prod.id); }} />
                            ) : (
                              <Button variant="outline-icon-xs" icon={Minus} onClick={(e) => { e.stopPropagation(); onDecrease?.(prod.id); }} />
                            )}
                            <Box padding={0} w="w-4">
                              <Font variant="body-bold" text={String(qty)} align="center" />
                            </Box>
                            <Button variant="outline-icon-xs" icon={Plus} onClick={(e) => { e.stopPropagation(); onIncrease?.(prod.id); }} />
                          </Stack>
                        )}
                      </Stack>
                    </Stack>
                  </Box>
                  {idx < filteredProducts.length - 1 && (
                    <Box h="h-[1px]" w="full" bg="bg-border" />
                  )}
                </Box>
              )
            })}
          </Box>
        )}
      </Box>
    </Stack>
  )
}
