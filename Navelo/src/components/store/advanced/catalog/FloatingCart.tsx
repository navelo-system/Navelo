"use client"

import React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { CircularIcon } from "@/components/store/intermediary/CircularIcon"
import { ShoppingCart, Home, ClipboardList, User } from "lucide-react"
import { useCatalog } from "@/lib/catalog/CatalogProvider"

function formatPrice(val: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
}

export function FloatingCart() {
  const { cart, cartSubtotal, selectedProduct, isCartOpen, setIsCartOpen, isStoreInfoOpen } = useCatalog()
  if (selectedProduct || isCartOpen || isStoreInfoOpen) return null
  const hasItems = cart.length > 0

  return (
    <>
      {/* Botão Flutuante de Carrinho no Desktop (Apenas se tiver itens no carrinho) */}
      {hasItems && (
        <Box
          display="hidden md:block"
          position="fixed"
          bottom="24px"
          right="24px"
          zIndex="50"
          cursor="pointer"
          onClick={() => setIsCartOpen(true)}
        >
          <Box
            bg="bg-brand-primary"
            padding={2.5}
            radius="default"
            shadow="default"
          >
            <Stack direction="row" align="center" gap={2.5}>
              <Icon icon={ShoppingCart} size={20} color="white" />
              <Box w="w-[1px]" h="h-[24px]" bg="bg-white/30" />
              <Stack gap={0}>
                <Font variant="body-xs-bold" color="white" text="Carrinho" />
                <Font variant="body-sm-semibold" color="white" text={formatPrice(cartSubtotal)} />
              </Stack>
            </Stack>
          </Box>
        </Box>
      )}

      {/* Menu Fixo na Base da Tela no Mobile */}
      <Box
        display="block md:hidden"
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        zIndex="50"
      >
        {/* Barra Superior do Carrinho no Mobile (Apenas se tiver itens no carrinho) */}
        {hasItems && (
          <Box
            bg="bg-brand-primary"
            padding={2.5}
            cursor="pointer"
            onClick={() => setIsCartOpen(true)}
          >
            <Stack direction="row" align="center" justify="between" w="full">
              <Stack gap={0}>
                <Font variant="body-xs" color="white" text="Subtotal" />
                <Font variant="body-bold" color="white" text={formatPrice(cartSubtotal)} />
              </Stack>
              <Font variant="body-bold" color="white" text="Carrinho" />
            </Stack>
          </Box>
        )}

        {/* Barra Inferior com as Abas de Navegação */}
        <Box
          bg="bg-surface"
          padding={2.5}
          borderTop
          borderColor="border-border"
          shadow="default"
        >
          <Stack direction="row" align="center" justify="around" w="full">
            {/* Aba Início (Ativa) */}
            <Stack align="center" justify="center" gap={1} cursor="pointer" flex="1">
              <Icon icon={Home} color="primary" size={22} />
              <Font variant="body-xs-bold" color="primary" text="Início" />
            </Stack>

            {/* Aba Pedidos */}
            <Stack align="center" justify="center" gap={1} cursor="pointer" flex="1">
              <Icon icon={ClipboardList} color="muted" size={22} />
              <Font variant="body-xs" color="muted" text="Pedidos" />
            </Stack>

            {/* Aba Perfil / Marcos com indicador online */}
            <Stack align="center" justify="center" gap={1} cursor="pointer" flex="1">
              <Box position="relative">
                <CircularIcon icon={User} size={16} variant="secondary" />
                <Box
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  w="w-[8px]"
                  h="h-[8px]"
                  radius="full"
                  bg="bg-brand-success"
                />
              </Box>
              <Font variant="body-xs" color="muted" text="Marcos" />
            </Stack>
          </Stack>
        </Box>
      </Box>
    </>
  )
}
