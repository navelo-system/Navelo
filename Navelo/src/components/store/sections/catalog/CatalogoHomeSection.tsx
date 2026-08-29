"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Grid } from "@/components/store/base/Grid"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Package, PackageX } from "lucide-react"
import { useProducts, Product } from "@/lib/dal"
import { useCatalog } from "@/lib/catalog/CatalogProvider"
import { ProdutoDetailModal } from "./ProdutoDetailModal"

function formatPrice(val: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
}

export function CatalogoHomeSection() {
  const { settings, searchQuery, selectedProduct, setSelectedProduct } = useCatalog()
  const dbProducts = useProducts()

  // Filtra apenas produtos ativos, com estoque > 0 e selecionados nas configurações
  const availableProducts = useMemo(() => {
    if (!dbProducts) return []
    return dbProducts.filter((p) => {
      // Estoque positivo
      const stock = p.stock ?? 0
      if (stock <= 0) return false

      // Ativo
      if (p.active === false) return false

      // Selecionado no catálogo
      if (settings.allProductsSelected) return true
      return settings.selectedProductIds?.includes(p.id)
    })
  }, [dbProducts, settings])

  // Filtro de busca de texto
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return availableProducts
    const q = searchQuery.toLowerCase().trim()
    return availableProducts.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q))
    )
  }, [availableProducts, searchQuery])

  // Agrupa produtos por categoria e extrai lista ordenada de categorias com estoque
  const { categories, productsByCategory } = useMemo(() => {
    const map = new Map<string, { label: string; products: Product[] }>()

    filteredProducts.forEach((p) => {
      const catLabel = p.category?.trim() || "Geral"
      const catId = catLabel.toLowerCase()

      if (!map.has(catId)) {
        map.set(catId, { label: catLabel, products: [] })
      }
      map.get(catId)!.products.push(p)
    })

    const cats = Array.from(map.entries()).map(([id, data]) => ({
      id,
      label: data.label,
    }))

    return { categories: cats, productsByCategory: map }
  }, [filteredProducts])

  const [activeCategoryId, setActiveCategoryId] = useState<string>("")

  // Seleciona a primeira categoria por padrão
  if (categories.length > 0 && (!activeCategoryId || !categories.some((c) => c.id === activeCategoryId))) {
    setActiveCategoryId(categories[0].id)
  }

  // ScrollSpy: atualiza categoria ativa conforme scroll da página
  useEffect(() => {
    if (categories.length === 0) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120
      for (const cat of categories) {
        const el = document.getElementById(`category-section-${cat.id}`)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveCategoryId(cat.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [categories])

  const handleCategoryClick = (catId: string) => {
    setActiveCategoryId(catId)
    const el = document.getElementById(`category-section-${catId}`)
    if (el) {
      const yOffset = -70
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  return (
    <Stack align="center" w="full">
      <Box maxW="1200px" padding={0} w="full">
        <Stack gap={0} w="full">

          {/* Categorias Fixas no Topo (Sticky Navigation com Indicador Sublinhado na Paleta) */}
          {categories.length > 0 && (
            <Box
              position="sticky"
              top="0"
              zIndex="30"
              bg="bg-surface"
              borderBottom
              borderColor="border-border"
              display="flex"
              overflow="auto"
              w="full"
            >
              <Stack direction="row" align="center" justify="start" w="full">
                {categories.map((cat) => {
                  const isActive = activeCategoryId === cat.id
                  return (
                    <Box
                      key={cat.id}
                      padding={2.5}
                      cursor="pointer"
                      borderBottom={true}
                      borderColor={isActive ? "border-brand-primary" : "border-transparent"}
                      onClick={() => handleCategoryClick(cat.id)}
                      flex="1"
                      display="flex"
                      align="center"
                      justify="center"
                    >
                      <Font
                        variant={isActive ? "body-bold" : "body-medium"}
                        text={cat.label.toUpperCase()}
                        color={isActive ? "primary" : "muted"}
                      />
                    </Box>
                  )
                })}
              </Stack>
            </Box>
          )}

          {/* Conteúdo Abaixo das Abas de Categorias */}
          <Box padding={5} w="full">
            {categories.length === 0 ? (
              <EmptyState
                icon={PackageX}
                title="Nenhum produto disponível"
                subtitle={
                  searchQuery
                    ? "Nenhum produto encontrado para sua busca."
                    : "Esta loja ainda não possui produtos disponíveis para venda no catálogo."
                }
              />
            ) : (
              <Stack gap={5} w="full">
                {categories.map((cat) => {
                  const prods = productsByCategory.get(cat.id)?.products || []
                  if (prods.length === 0) return null

                  return (
                    <Box key={cat.id} id={`category-section-${cat.id}`} w="full" padding={0}>
                      <Stack gap={2.5} w="full">
                        {/* Título da Categoria */}
                        <Font variant="h4" text={cat.label.toUpperCase()} />

                        {/* Grid de Produtos da Categoria (2 por linha) */}
                        <Grid cols={2} responsive gap={5}>
                          {prods.map((p) => (
                            <Box
                              key={p.id}
                              bg="bg-transparent md:bg-surface"
                              radius="none"
                              hoverBg="primary/10"
                              cursor="pointer"
                              className="p-0 md:p-2.5 rounded-none md:rounded-lg"
                              onClick={() => setSelectedProduct(p)}
                            >
                              <Stack direction="row" align="center" justify="between" h="full" gap={2.5}>
                                <Stack justify="center" h="full" gap={1} flex="1" minW="0">
                                  <Font variant="body-semibold" text={p.name} truncate />
                                  <Font variant="body-bold" text={formatPrice(p.price ?? 0)} />
                                </Stack>
                                {p.image_url ? (
                                  <Box w="w-[90px]" h="h-[90px]" radius="default" overflow="hidden" shrink="0">
                                    <Box
                                      as="img"
                                      src={p.image_url}
                                      alt={p.name}
                                      w="w-full"
                                      h="h-full"
                                      objectFit="cover"
                                    />
                                  </Box>
                                ) : (
                                  <Box w="w-[90px]" h="h-[90px]" radius="default" bg="bg-brand-primary/10" display="flex" align="center" justify="center" shrink="0">
                                    <Icon icon={Package} size={32} color="primary" />
                                  </Box>
                                )}
                              </Stack>
                            </Box>
                          ))}
                        </Grid>
                      </Stack>
                    </Box>
                  )
                })}
              </Stack>
            )}

            {/* Espaçador de Compensação Vertical para o Menu Fixo no Mobile */}
            <Box h="h-[120px]" display="block md:hidden" />
          </Box>

        </Stack>
      </Box>

      {/* Modal / Tela de Detalhes do Produto */}
      <ProdutoDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </Stack>
  )
}
