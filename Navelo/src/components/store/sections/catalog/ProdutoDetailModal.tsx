"use client"

import React, { useState } from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { ThemeToggle } from "@/components/store/intermediary/ThemeToggle"
import { ArrowLeft, Minus, Plus, Package, X, Maximize2 } from "lucide-react"
import { Product } from "@/lib/dal"
import { useCatalog } from "@/lib/catalog/CatalogProvider"

function formatPrice(val: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
}

export interface ProdutoDetailModalProps {
  product: Product | null
  onClose: () => void
}

export function ProdutoDetailModal({ product, onClose }: ProdutoDetailModalProps) {
  const { settings, isDark, setIsDark, addToCart } = useCatalog()
  const [quantity, setQuantity] = useState(1)
  const [observation, setObservation] = useState("")
  const [isImageFullscreen, setIsImageFullscreen] = useState(false)

  if (!product) return null

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price ?? 0,
        image_url: product.image_url,
      },
      quantity,
      observation.trim() ? observation.trim() : undefined
    )
    onClose()
  }

  const totalPrice = (product.price ?? 0) * quantity
  const storeInitial = (settings.identification.subdomain || "N").charAt(0).toUpperCase()

  return (
    <>
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex="50"
        bg="bg-background"
        overflowY="auto"
        display="flex"
        direction="col"
        align="center"
      >
        {/* Cabeçalho Simplificado no Desktop */}
        <Box
          w="full"
          borderBottom
          borderColor="border-border"
          bg="bg-surface"
          padding={2.5}
          display="hidden md:block"
          position="sticky"
          top="0"
          zIndex="40"
        >
          <Stack direction="row" align="center" justify="between" w="full">
            {/* Bolinha da Logo na Esquerda */}
            <Box
              w="w-[42px]"
              h="h-[42px]"
              radius="full"
              border
              borderColor="border-border"
              bg="bg-surface"
              display="flex"
              align="center"
              justify="center"
              overflow="hidden"
              shadow="default"
            >
              {settings.identification.logoImage ? (
                <Box
                  as="img"
                  src={settings.identification.logoImage}
                  alt="Logo"
                  w="w-full"
                  h="h-full"
                  objectFit="cover"
                />
              ) : (
                <Font variant="body-bold" color="primary" text={storeInitial} />
              )}
            </Box>

            {/* Switch de Tema na Direita */}
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </Stack>
        </Box>

        {/* Container Principal do Produto (Largura Total) */}
        <Box
          w="full"
          bg="bg-surface"
          minH="screen"
          position="relative"
          padding={0}
        >
          {/* Botão Flutuante de Voltar */}
          <Box
            position="absolute"
            top="16px"
            left="16px"
            zIndex="20"
            padding={2.5}
            bg="bg-surface"
            radius="default"
            shadow="default"
            cursor="pointer"
            onClick={onClose}
          >
            <Icon icon={ArrowLeft} color="primary" size={20} />
          </Box>

          {/* Área da Imagem do Produto */}
          <Box
            w="full"
            h="h-[360px] md:h-[420px]"
            bg="bg-transparent"
            position="relative"
            display="flex"
            align="center"
            justify="center"
            overflow="hidden"
            cursor={product.image_url ? "pointer" : undefined}
            onClick={() => product.image_url && setIsImageFullscreen(true)}
          >
            {product.image_url ? (
              <>
                <Box
                  as="img"
                  src={product.image_url}
                  alt={product.name}
                  w="full"
                  h="full"
                  objectFit="contain"
                  className="max-h-[360px] md:max-h-[420px]"
                />
                <Box
                  position="absolute"
                  bottom="12px"
                  right="12px"
                  padding={1}
                  bg="bg-surface/80"
                  radius="default"
                  display="flex"
                  align="center"
                  justify="center"
                >
                  <Icon icon={Maximize2} size={16} color="primary" />
                </Box>
              </>
            ) : (
              <Icon icon={Package} size={64} color="primary" />
            )}
          </Box>

          {/* Conteúdo do Produto */}
          <Box padding={5} w="full">
            <Stack gap={5} w="full">
              {/* Nome e Preço Unitário */}
              <Stack gap={1} w="full">
                <Font variant="h3" text={product.name.toUpperCase()} />
                <Font
                  variant="body-bold"
                  text={`${formatPrice(product.price ?? 0)}/UN`}
                />
              </Stack>

              {/* Campo de Observações */}
              <Stack gap={2.5} w="full">
                <Font variant="h4" text="Observações" />
                <Input
                  variant="textarea"
                  rows={4}
                  placeholder="Digite alguma observação"
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                />
              </Stack>

              {/* Espaçador para o Rodapé Fixo */}
              <Box h="h-[120px]" />
            </Stack>
          </Box>

          {/* Rodapé Fixo com Stepper, Total e Botão Adicionar (Largura Total) */}
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
              {/* Seletor de Quantidade */}
              <Box bg="bg-brand-primary/10" padding={2.5} radius="default" shrink="0">
                <Stack direction="row" align="center" gap={2.5}>
                  <Box
                    cursor="pointer"
                    padding={1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Icon icon={Minus} size={16} color="primary" />
                  </Box>
                  <Font variant="body-bold" text={String(quantity)} />
                  <Box
                    cursor="pointer"
                    padding={1}
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Icon icon={Plus} size={16} color="primary" />
                  </Box>
                </Stack>
              </Box>

              {/* Total */}
              <Stack justify="center" gap={0} flex="1" minW="0" className="px-4">
                <Font variant="body-xs" color="muted" text="Total" />
                <Font variant="body-bold" text={formatPrice(totalPrice)} />
              </Stack>

              {/* Botão Adicionar */}
              <Button
                variant="primary"
                label="Adicionar"
                className="!w-auto px-8 shrink-0"
                onClick={handleAddToCart}
              />
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Visualizador de Imagem em Tela Cheia (Lightbox) */}
      {isImageFullscreen && product.image_url && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          onClick={() => setIsImageFullscreen(false)}
        >
          {/* Botão Fechar Tela Cheia */}
          <button
            type="button"
            className="absolute top-5 right-5 z-[10000] p-2.5 rounded-full bg-zinc-800/90 text-white hover:bg-zinc-700 transition-colors shadow-lg cursor-pointer flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation()
              setIsImageFullscreen(false)
            }}
          >
            <X size={24} />
          </button>

          <img
            src={product.image_url}
            alt={product.name}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
