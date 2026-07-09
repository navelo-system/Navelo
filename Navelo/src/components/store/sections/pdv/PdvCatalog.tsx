"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Grid } from "../../base/Grid"
import { Font } from "../../base/Font"
import { Tabs, TabsTrigger } from "../../base/Tabs"
import { EmptyState } from "../../intermediary/EmptyState"
import { ProductCard } from "../../advanced/ProductCard"
import { Product, ProductType, UnitType } from "@/src/types/domain"
import {
  Package
} from "lucide-react"

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
}) => {
  return (
    <Stack gap={5}>

      {/* Abas de Categorias */}
      <Box w="full" overflow="auto" paddingY={1}>
        <Tabs value={activeCategory} onValueChange={onActiveCategoryChange}>
          <Stack direction="row" gap={5}>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
              </TabsTrigger>
            ))}
          </Stack>
        </Tabs>
      </Box>

      {/* Grade/Lista de Produtos */}
      <Box padding={1}>
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Sem produtos"
            subtitle="Nenhum produto cadastrado nesta categoria."
          />
        ) : viewMode === "grade" ? (
          <Grid cols={6} gap={5} mobileCols={2}>
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={adaptProduct(prod)}
                onClick={() => onAddProduct(prod)}
              />
            ))}
          </Grid>
        ) : (
          /* Lista limpa — thumbnail + nome + preço/unidade */
          <Box display="flex" direction="col" radius="default" border={true} borderColor="border-border" bg="bg-white">
            {filteredProducts.map((prod, idx) => (
              <Box key={prod.id}>
                <Box
                  as="button"
                  w="full"
                  paddingX={2.5}
                  paddingY={2.5}
                  hoverBg="surface-sunken"
                  onClick={() => onAddProduct(prod)}
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
                    {/* Preço + Unidade */}
                    <Stack direction="row" align="baseline" gap={1} justify="end" w="w-full md:w-auto">
                      <Font
                        variant="body-sm-semibold"
                        text={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(prod.unitPrice)}
                      />
                      <Font variant="auxiliary" color="muted" text={prod.unit || "UN"} />
                    </Stack>
                  </Stack>
                </Box>
                {idx < filteredProducts.length - 1 && (
                  <Box h="h-[1px]" w="full" bg="bg-border" />
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Stack>
  )
}
