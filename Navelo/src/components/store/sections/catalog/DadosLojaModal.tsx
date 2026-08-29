"use client"

import React, { useMemo } from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Badge } from "@/components/store/base/Badge"
import { ThemeToggle } from "@/components/store/intermediary/ThemeToggle"
import { ArrowLeft, MessageCircle, CheckCircle2, Clock, Map } from "lucide-react"
import { useCatalog } from "@/lib/catalog/CatalogProvider"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "@/lib/dal"

const InstagramIcon: React.FC<React.SVGAttributes<SVGSVGElement> & { size?: number | string }> = ({
  size = 20,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const FacebookIcon: React.FC<React.SVGAttributes<SVGSVGElement> & { size?: number | string }> = ({
  size = 20,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

export function DadosLojaModal() {
  const { settings, isDark, setIsDark, isStoreInfoOpen, setIsStoreInfoOpen } = useCatalog()

  const company = useLiveQuery(() => db.companies.toCollection().first())

  const storeName =
    company?.trade_name || company?.name || settings.identification.subdomain || "Minha Loja"
  const storeInitial = (storeName || "N").charAt(0).toUpperCase()

  // Status de funcionamento baseado nos horários configurados
  const isOpen = useMemo(() => {
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
  }, [settings.enabled, settings.schedule])

  // Lista dos dias da semana exatamente conforme configurado no painel (settings.schedule)
  const currentDayIndex = new Date().getDay()
  const dayKeysMap: Record<number, string> = {
    0: "dom",
    1: "seg",
    2: "ter",
    3: "qua",
    4: "qui",
    5: "sex",
    6: "sab",
  }
  const currentDayKey = dayKeysMap[currentDayIndex]

  const daysList = useMemo(() => {
    if (settings.schedule && settings.schedule.length > 0) {
      return settings.schedule.map((item) => {
        let hours = "Fechado"
        if (item.enabled && item.start && item.end) {
          hours = `${item.start} - ${item.end}`
        }
        return {
          key: item.day,
          label: item.label,
          isToday: item.day === currentDayKey,
          hours,
        }
      })
    }
    return []
  }, [currentDayKey, settings.schedule])

  // Contatos dinâmicos
  const rawWhatsApp = (settings.identification as any).whatsapp || company?.phone || ""
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, "")
  const hasWhatsApp = Boolean(cleanWhatsApp)

  const rawInsta = settings.identification.instagram || ""
  const cleanInsta = rawInsta.replace("@", "").trim()
  const hasInstagram = Boolean(cleanInsta)

  const rawFacebook = settings.identification.facebook || ""
  const cleanFacebook = rawFacebook.trim()
  const hasFacebook = Boolean(cleanFacebook)

  const handleWhatsApp = () => {
    if (cleanWhatsApp) {
      window.open(`https://wa.me/${cleanWhatsApp}`, "_blank")
    }
  }

  const handleInstagram = () => {
    if (cleanInsta) {
      if (cleanInsta.startsWith("http")) {
        window.open(cleanInsta, "_blank")
      } else {
        window.open(`https://instagram.com/${cleanInsta}`, "_blank")
      }
    }
  }

  const handleFacebook = () => {
    if (cleanFacebook) {
      if (cleanFacebook.startsWith("http")) {
        window.open(cleanFacebook, "_blank")
      } else {
        window.open(`https://facebook.com/${cleanFacebook.replace("@", "")}`, "_blank")
      }
    }
  }

  // Endereço da empresa formatado estritamente a partir dos Dados da Empresa (db.companies)
  const streetLine = useMemo(() => {
    if (!company?.address_street) return ""
    return company.address_number
      ? `${company.address_street}, ${company.address_number}`
      : company.address_street
  }, [company])

  const cityLine = useMemo(() => {
    if (company?.address_neighborhood || company?.address_city) {
      const parts = [
        company.address_neighborhood,
        company.address_city && company.address_state
          ? `${company.address_city} - ${company.address_state}`
          : company.address_city,
      ].filter(Boolean)
      return parts.join(", ")
    }
    return ""
  }, [company])

  const cepLine = useMemo(() => {
    return company?.address_cep || ""
  }, [company])

  const hasAddress = Boolean(streetLine || cityLine || cepLine)

  const fullAddressQuery = useMemo(() => {
    return [streetLine, cityLine, cepLine].filter(Boolean).join(", ")
  }, [streetLine, cityLine, cepLine])

  const handleOpenMap = () => {
    if (fullAddressQuery) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddressQuery)}`,
        "_blank"
      )
    }
  }

  if (!isStoreInfoOpen) return null

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      zIndex="50"
      bg="bg-background"
      overflowY="auto"
    >
      <Box w="full" bg="bg-background" minH="screen" position="relative" padding={0}>

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

        {/* Barra Superior da Tela (Voltar + Título Centralizado) */}
        <Box
          padding={2.5}
          borderBottom
          borderColor="border-border"
          bg="bg-surface"
          position="sticky"
          top="0"
          zIndex="20"
        >
          <Box position="relative" w="full" display="flex" align="center" justify="center">
            {/* Botão Voltar à Esquerda */}
            <Box
              position="absolute"
              left="0"
              cursor="pointer"
              padding={1}
              onClick={() => setIsStoreInfoOpen(false)}
            >
              <Icon icon={ArrowLeft} size={20} color="primary" />
            </Box>

            {/* Título Centralizado */}
            <Font variant="h3" text="Dados da loja" align="center" />
          </Box>
        </Box>

        {/* Conteúdo da Tela em Cards */}
        <Box padding={5} w="full">
          <Stack gap={5} w="full">

            {/* Card 1: Identificação, Redes Sociais e Status */}
            <Box
              bg="bg-surface"
              padding={5}
              radius="default"
              w="full"
            >
              <Stack gap={5} w="full">
                <Font variant="h3" text={storeName.toUpperCase()} />

                <Stack direction="row" align="center" justify="between" w="full">
                  {/* Botões de Redes Sociais */}
                  <Stack direction="row" align="center" gap={2.5}>
                    {hasWhatsApp && (
                      <Box
                        bg="bg-brand-primary"
                        padding={2.5}
                        radius="default"
                        cursor="pointer"
                        onClick={handleWhatsApp}
                      >
                        <Icon icon={MessageCircle} color="white" size={20} />
                      </Box>
                    )}

                    {hasInstagram && (
                      <Box
                        bg="bg-brand-primary"
                        padding={2.5}
                        radius="default"
                        cursor="pointer"
                        onClick={handleInstagram}
                      >
                        <Icon icon={InstagramIcon as any} color="white" size={20} />
                      </Box>
                    )}

                    {hasFacebook && (
                      <Box
                        bg="bg-brand-primary"
                        padding={2.5}
                        radius="default"
                        cursor="pointer"
                        onClick={handleFacebook}
                      >
                        <Icon icon={FacebookIcon as any} color="white" size={20} />
                      </Box>
                    )}
                  </Stack>

                  {/* Badge de Status Aberto / Fechado (Componente Oficial do Design System) */}
                  <Badge
                    variant={isOpen ? "success" : "danger"}
                    rounded="full"
                    label={isOpen ? "Loja aberta" : "Loja fechada"}
                    icon={isOpen ? CheckCircle2 : Clock}
                  />
                </Stack>
              </Stack>
            </Box>

            {/* Card 2: Horários de Funcionamento */}
            <Box
              bg="bg-surface"
              padding={5}
              radius="default"
              w="full"
            >
              <Stack gap={5} w="full">
                <Font variant="body-xs" color="muted" text="Horários de funcionamento" />

                <Stack gap={2.5} w="full">
                  {daysList.map((day) => (
                    <Stack
                      key={day.key}
                      direction="row"
                      align="center"
                      justify="between"
                      w="full"
                    >
                      <Font
                        variant={day.isToday ? "body-bold" : "body"}
                        text={day.label}
                      />
                      <Font
                        variant={day.isToday ? "body-bold" : "body"}
                        text={day.hours}
                      />
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Box>

            {/* Card 3: Endereço da Empresa */}
            <Box
              bg="bg-surface"
              padding={5}
              radius="default"
              w="full"
            >
              <Stack gap={5} w="full">
                <Stack gap={2.5} w="full">
                  <Font variant="body-xs" color="muted" text="Endereço da empresa" />
                  {hasAddress ? (
                    <>
                      {streetLine && <Font variant="body" text={streetLine} />}
                      {cityLine && <Font variant="body" text={cityLine} />}
                      {cepLine && <Font variant="body" text={cepLine} />}
                    </>
                  ) : (
                    <Font variant="body" color="muted" text="Endereço não informado" />
                  )}
                </Stack>

                {/* Botão Ver no Mapa */}
                {hasAddress && (
                  <Box cursor="pointer" onClick={handleOpenMap}>
                    <Stack direction="row" align="center" gap={2.5}>
                      <Icon icon={Map} size={20} color="primary" />
                      <Font variant="body-bold" color="primary" text="Ver no mapa" />
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Box>

          </Stack>
        </Box>

      </Box>
    </Box>
  )
}
