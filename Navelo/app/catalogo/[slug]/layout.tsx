import React from "react"
import { Box } from "@/components/store/base/Box"
import { CatalogProvider } from "@/lib/catalog/CatalogProvider"
import { CatalogHeader } from "@/components/store/sections/catalog/CatalogHeader"
import { FloatingCart } from "@/components/store/advanced/catalog/FloatingCart"
import { CarrinhoModal } from "@/components/store/sections/catalog/CarrinhoModal"
import { DadosLojaModal } from "@/components/store/sections/catalog/DadosLojaModal"

export default async function CatalogoLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <CatalogProvider slug={slug}>
      <Box w="full" minH="screen" bg="bg-background">
        <CatalogHeader />
        <Box w="full" padding={0}>
          {children}
        </Box>
        <FloatingCart />
        <CarrinhoModal />
        <DadosLojaModal />
      </Box>
    </CatalogProvider>
  )
}
