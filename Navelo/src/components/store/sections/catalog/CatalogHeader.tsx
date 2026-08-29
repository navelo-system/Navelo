"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/dal"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Input } from "@/components/store/base/Input"
import { Badge } from "@/components/store/base/Badge"
import { CircularIcon } from "@/components/store/intermediary/CircularIcon"
import { ThemeToggle } from "@/components/store/intermediary/ThemeToggle"
import { Home, ReceiptText, User, Search, Share2 } from "lucide-react"
import { useCatalog } from "@/lib/catalog/CatalogProvider"

export function CatalogHeader() {
  const { settings, isDark, setIsDark, searchQuery, setSearchQuery, setIsStoreInfoOpen } = useCatalog()
  const pathname = usePathname()
  const isHomePage = pathname === `/catalogo/${settings.identification.subdomain || "navelo"}`

  // Carrega dados da empresa do banco de dados local
  const company = useLiveQuery(() => db.companies.toCollection().first())

  // Montagem do endereço dinâmico da empresa
  const addressText = React.useMemo(() => {
    if (!company) return settings.identification.areas || ""
    const parts = [
      company.address_street && company.address_number
        ? `${company.address_street}, ${company.address_number}`
        : company.address_street,
      company.address_neighborhood,
      company.address_city && company.address_state
        ? `${company.address_city} - ${company.address_state}`
        : company.address_city,
    ].filter(Boolean)
    return parts.length > 0 ? parts.join(", ") : ""
  }, [company])

  const storeName = company?.trade_name || company?.name || settings.identification.subdomain || "Navelo"

  // Status de funcionamento baseado nos horários configurados
  const isOpen = React.useMemo(() => {
    if (!settings.enabled) return false
    const dayKeys = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"]
    const now = new Date()
    const currentDayKey = dayKeys[now.getDay()]
    const currentSchedule = settings.schedule?.find((s) => s.day === currentDayKey)
    if (!currentSchedule || !currentSchedule.enabled) return false

    try {
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      const [startH, startM] = currentSchedule.start.split(":").map(Number)
      const [endH, endM] = currentSchedule.end.split(":").map(Number)
      const startMinutes = startH * 60 + (startM || 0)
      const endMinutes = endH * 60 + (endM || 0)
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes
    } catch {
      return false
    }
  }, [settings])

  return (
    <Box w="full" bg="bg-surface">
      {/* Top Bar (Oculto no mobile, visível no desktop) */}
      <Box padding={2.5} borderBottom borderColor="border-border" display="hidden md:block">
        <Stack direction="row" align="center" justify="between">

          {/* Lado Esquerdo */}
          <Box flex="1" maxW="md">
            {isHomePage ? (
              <Input
                variant="bordered"
                placeholder="Busque um produto"
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            ) : (
              <Stack direction="row" align="center" gap={2.5}>
                {settings.identification.logoImage ? (
                  <Box position="relative" w="w-[40px]" h="h-[40px]" radius="full" overflow="hidden">
                    <Box as="img" src={settings.identification.logoImage} alt="Logo" w="w-full" h="h-full" objectFit="cover" />
                  </Box>
                ) : (
                  <Box bg="bg-brand-primary" padding={2.5} radius="full">
                    <Font variant="body-bold" color="white" text={storeName.charAt(0).toUpperCase()} />
                  </Box>
                )}
                <Font variant="body-bold" text={storeName} />
              </Stack>
            )}
          </Box>

          {/* Lado Direito */}
          <Stack direction="row" align="center" gap={5}>
            <Stack direction="row" align="center" gap={2.5} cursor="pointer">
              <Icon icon={Home} color="primary" size={16} />
              <Font variant="body-bold" color="primary" text="Início" />
            </Stack>

            <Stack direction="row" align="center" gap={2.5} cursor="pointer">
              <Icon icon={ReceiptText} size={16} />
              <Font variant="body-bold" text="Pedidos" />
            </Stack>

            <Stack direction="row" align="center" gap={2.5} cursor="pointer">
              <CircularIcon icon={User} size={16} variant="secondary" />
              <Font variant="body-bold" text="Marcos" />
            </Stack>

            {/* Divisor */}
            <Box w="1px" h="24px" bg="bg-border" />

            {/* Theme Toggle com Animação Fluida */}
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />

          </Stack>
        </Stack>
      </Box>

      {/* Banner de Capa e Informações da Loja (Renderizado apenas na Home) */}
      {isHomePage && (
        <Stack align="center" w="full">
          <Box maxW="1200px" w="full" padding={0}>
            {/* Imagem de Capa */}
            <Box h="h-[180px]" w="full" bg="bg-brand-primary/10" position="relative" overflow="hidden">
              {settings.identification.coverImage ? (
                <Box
                  as="img"
                  src={settings.identification.coverImage}
                  alt="Capa da Loja"
                  w="full"
                  h="full"
                  objectFit="cover"
                />
              ) : (
                <Box display="flex" align="center" justify="center" h="full">
                  <Font variant="h2" color="muted" text="Sem Imagem de Capa" />
                </Box>
              )}
            </Box>

            {/* Bloco Unificado: Foto Sobreposta + Informações da Loja */}
            <Box position="relative" style={{ marginTop: "-50px" }} w="full" padding={5}>
              <Stack gap={2.5} w="full">

                {/* Linha Central da Foto:
                    - Mobile: Compartilhar (esquerda), Logo (centro), Theme Toggle (direita)
                    - Desktop: Logo centralizado apenas */}
                <Stack direction="row" align="center" justify="between" w="full">
                  {/* Lado Esquerdo: Botão Compartilhar (Apenas Mobile) */}
                  <Box display="block md:hidden">
                    <Box padding={2.5} bg="bg-brand-primary/10" hoverBg="primary/10" radius="full" cursor="pointer">
                      <Icon icon={Share2} color="primary" size={18} />
                    </Box>
                  </Box>
                  <Box display="hidden md:block" w="w-[42px]" />

                  {/* Centro: Logo Redonda */}
                  <Box
                    w="w-[100px]"
                    h="h-[100px]"
                    bg="bg-surface"
                    radius="full"
                    border
                    borderColor="border-border"
                    display="flex"
                    align="center"
                    justify="center"
                    overflow="hidden"
                    shrink="0"
                    shadow="default"
                  >
                    {settings.identification.logoImage ? (
                      <Box as="img" src={settings.identification.logoImage} alt="Logo" w="w-full" h="h-full" objectFit="cover" />
                    ) : (
                      <Font variant="display-huge" color="primary" text={storeName.charAt(0).toUpperCase()} />
                    )}
                  </Box>

                  {/* Lado Direito: Switch de Tema Claro/Escuro Animado (Apenas Mobile) */}
                  <Box display="block md:hidden">
                    <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
                  </Box>
                  <Box display="hidden md:block" w="w-[42px]" />
                </Stack>

                {/* Linha de Informações da Loja */}
                <Stack direction="row" align="center" justify="between" w="full">
                  {/* Info da Loja */}
                  <Stack gap={1} flex="1" minW="0">
                    {/* Desktop: Nome e Endereço em Linha */}
                    <Box display="hidden md:block">
                      <Stack direction="row" align="center" gap={2.5}>
                        <Font variant="body-sm-semibold" text={storeName.toUpperCase()} />
                        {addressText && (
                          <>
                            <Font variant="body-xs" color="muted" text="•" />
                            <Font variant="body-xs" color="muted" text={addressText} />
                          </>
                        )}
                      </Stack>
                    </Box>

                    {/* Mobile: Nome e Endereço Empilhados */}
                    <Box display="block md:hidden">
                      <Stack gap={1}>
                        <Font variant="body-sm-semibold" text={storeName.toUpperCase()} />
                        {addressText && (
                          <Font variant="body-xs" color="muted" text={addressText} truncate />
                        )}
                      </Stack>
                    </Box>

                    <Box cursor="pointer" onClick={() => setIsStoreInfoOpen(true)}>
                      <Font variant="body-sm-semibold" color="primary" text="Ver mais" />
                    </Box>
                  </Stack>

                  {/* Lado Direito: Badge Aberto/Fechado + Botão Compartilhar (no Desktop) */}
                  <Stack direction="row" align="center" gap={2.5}>
                    <Badge
                      variant={isOpen ? "success" : "danger"}
                      rounded="full"
                      label={isOpen ? "Aberto" : "Fechado"}
                    />
                    <Box display="hidden md:block">
                      <Box padding={2.5} bg="bg-brand-primary/10" hoverBg="primary/10" radius="full" cursor="pointer">
                        <Icon icon={Share2} color="primary" size={18} />
                      </Box>
                    </Box>
                  </Stack>
                </Stack>

                {/* Campo de Busca no Mobile (dentro do container com mesmo bg e respeitando padding) */}
                <Box display="block md:hidden" w="full">
                  <Input
                    variant="bordered"
                    placeholder="Busque um produto"
                    icon={Search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Box>

              </Stack>
            </Box>
          </Box>
        </Stack>
      )}
    </Box>
  )
}
