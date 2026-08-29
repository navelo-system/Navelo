"use client"

import React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Button } from "@/components/store/base/Button"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { ArrowLeft, Trash2, Minus, Plus, ShoppingCart } from "lucide-react"
import { useCatalog, CartItem } from "@/lib/catalog/CatalogProvider"
import { useProducts } from "@/lib/dal"
import { useRouter, useParams } from "next/navigation"

function formatPrice(val: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
}

export function CarrinhoModal() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartSubtotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    setSelectedProduct,
  } = useCatalog()
  const dbProducts = useProducts()
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug as string

  if (!isCartOpen) return null

  const handleEditItem = (item: CartItem) => {
    const originalProduct = dbProducts?.find((p) => p.id === item.productId)
    if (originalProduct) {
      setSelectedProduct(originalProduct)
    } else {
      setSelectedProduct({
        id: item.productId,
        name: item.name,
        price: item.price,
        image_url: item.imageUrl,
      })
    }
    setIsCartOpen(false)
  }

  const handleContinue = () => {
    setIsCartOpen(false)
    if (slug) {
      router.push(`/catalogo/${slug}/checkout`)
    }
  }

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      zIndex="50"
      bg="bg-surface"
      overflowY="auto"
    >
      <Box w="full" bg="bg-surface" minH="screen" position="relative" padding={0}>

        {/* Barra Superior do Carrinho */}
        <Box
          padding={2.5}
          borderBottom
          borderColor="border-border"
          bg="bg-surface"
          position="sticky"
          top="0"
          zIndex="20"
        >
          <Stack direction="row" align="center" justify="between" w="full">
            {/* Lado Esquerdo: Voltar + Título */}
            <Stack direction="row" align="center" gap={2.5}>
              <Box cursor="pointer" padding={1} onClick={() => setIsCartOpen(false)}>
                <Icon icon={ArrowLeft} size={20} color="primary" />
              </Box>
              <Font variant="h3" text="Carrinho" />
            </Stack>

            {/* Lado Direito: Botão Limpar */}
            {cart.length > 0 && (
              <Box cursor="pointer" padding={1} onClick={clearCart}>
                <Font variant="body-semibold" color="danger" text="Limpar" />
              </Box>
            )}
          </Stack>
        </Box>

        {/* Lista de Itens do Carrinho */}
        <Box padding={5} w="full">
          {cart.length === 0 ? (
            <Stack gap={5} w="full">
              <EmptyState
                icon={ShoppingCart}
                title="Seu carrinho está vazio"
                subtitle="Adicione itens do catálogo para continuar seu pedido."
              />
              <Button
                variant="primary"
                label="Explorar Produtos"
                fullWidth
                onClick={() => setIsCartOpen(false)}
              />
            </Stack>
          ) : (
            <Stack gap={5} w="full">
              {cart.map((item) => (
                <Box
                  key={item.id}
                  padding={2.5}
                  borderBottom
                  borderColor="border-border"
                  w="full"
                >
                  <Stack gap={2.5} w="full">
                    {/* Linha Superior: Nome do Produto + Link Alterar */}
                    <Stack direction="row" align="center" justify="between" w="full">
                      <Font variant="body-sm-medium" text={item.name} />
                      <Box cursor="pointer" onClick={() => handleEditItem(item)}>
                        <Font variant="body-xs-medium" color="primary" text="Alterar" />
                      </Box>
                    </Stack>

                    {/* Linha Inferior: Preço + Stepper com Lixeira */}
                    <Stack direction="row" align="center" justify="between" w="full">
                      <Font
                        variant="body-sm-semibold"
                        text={formatPrice((item.price ?? 0) * item.quantity)}
                      />

                      {/* Stepper de Quantidade */}
                      <Box bg="bg-brand-primary/10" padding={2.5} radius="default" shrink="0">
                        <Stack direction="row" align="center" gap={2.5}>
                          {item.quantity === 1 ? (
                            <Box
                              cursor="pointer"
                              padding={1}
                              onClick={() => removeFromCart(item.productId)}
                            >
                              <Icon icon={Trash2} size={16} color="danger" />
                            </Box>
                          ) : (
                            <Box
                              cursor="pointer"
                              padding={1}
                              onClick={() => updateQuantity(item.productId, -1)}
                            >
                              <Icon icon={Minus} size={16} color="primary" />
                            </Box>
                          )}
                          <Font variant="body-bold" text={String(item.quantity)} />
                          <Box
                            cursor="pointer"
                            padding={1}
                            onClick={() => updateQuantity(item.productId, 1)}
                          >
                            <Icon icon={Plus} size={16} color="primary" />
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>

                    {/* Observação (se houver) */}
                    {item.observation && (
                      <Box bg="bg-surface-sunken" padding={2.5} radius="default">
                        <Font
                          variant="body-xs"
                          color="muted"
                          text={`Obs: ${item.observation}`}
                        />
                      </Box>
                    )}
                  </Stack>
                </Box>
              ))}

              {/* Link para Adicionar mais itens */}
              <Box padding={5} display="flex" justify="center">
                <Box cursor="pointer" onClick={() => setIsCartOpen(false)}>
                  <Font variant="body-bold" color="primary" text="Adicionar mais itens" />
                </Box>
              </Box>

              {/* Espaçador para o Rodapé Fixo */}
              <Box h="h-[100px]" />
            </Stack>
          )}
        </Box>

        {/* Rodapé Fixo com Subtotal e Botão Continuar (Largura Total) */}
        {cart.length > 0 && (
          <Box
            position="fixed"
            bottom="0"
            left="0"
            right="0"
            zIndex="50"
            bg="bg-surface"
            borderTop
            borderColor="border-border"
            padding={5}
          >
            <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
              {/* Subtotal */}
              <Stack justify="center" gap={0} flex="1" minW="0" className="px-4">
                <Font variant="body-xs" color="muted" text="Subtotal" />
                <Font variant="h3" text={formatPrice(cartSubtotal)} />
              </Stack>

              {/* Botão Continuar */}
              <Button
                variant="primary"
                label="Continuar"
                className="!w-auto px-8 shrink-0"
                onClick={handleContinue}
              />
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  )
}
