"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Avatar } from "@/components/store/base/Avatar"
import { Plus, UserX } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { useCustomers, Customer } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import { DeliveryClientFormScreen } from "@/components/store/advanced/DeliveryClientFormScreen"
import { ViewTransition } from "@/components/store/base/ViewTransition"

interface ClientesSectionProps {
  onBackToDashboard?: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onBack?: () => void
  onSelectClient?: (client: Customer) => void
}

export const ClientesSection: React.FC<ClientesSectionProps> = ({
  onBackToDashboard,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
  onBack,
  onSelectClient,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id

  // Clientes do banco de dados local IndexedDB
  const dbCustomers = useCustomers(tenantId)
  const clients = React.useMemo(() => (Array.isArray(dbCustomers) ? dbCustomers : []), [dbCustomers])

  const [modeHistory, setModeHistory] = React.useState<("list" | "form")[]>(["list"])
  const mode = modeHistory[modeHistory.length - 1] || "list"

  const pushMode = React.useCallback((newMode: "list" | "form") => {
    setModeHistory((prev) => [...prev, newMode])
  }, [])

  const popMode = React.useCallback(() => {
    setEditingClient(null)
    setModeHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }, [])

  const [editingClient, setEditingClient] = React.useState<Customer | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  const scrollPositions = React.useRef<Record<string, number>>({})

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const handleScroll = () => {
      scrollPositions.current[mode] = window.scrollY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [mode])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const savedScroll = scrollPositions.current[mode] || 0
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScroll, behavior: "instant" })
      })
    })
  }, [mode])

  // Handler unificado de navegação de retorno
  const handleBack = React.useCallback(() => {
    if (modeHistory.length > 1) {
      popMode()
    } else if (onBack) {
      onBack()
    } else if (onBackToDashboard) {
      onBackToDashboard()
    }
  }, [modeHistory.length, popMode, onBack, onBackToDashboard])

  const handleBackRef = React.useRef(handleBack)
  React.useEffect(() => {
    handleBackRef.current = handleBack
  }, [handleBack])

  const setCustomBackRef = React.useRef(setCustomBack)
  const setCustomTitleRef = React.useRef(setCustomTitle)
  const setCustomActionsRef = React.useRef(setCustomActions)
  React.useEffect(() => {
    setCustomBackRef.current = setCustomBack
    setCustomTitleRef.current = setCustomTitle
    setCustomActionsRef.current = setCustomActions
  }, [setCustomBack, setCustomTitle, setCustomActions])

  // Atualização do cabeçalho da seção
  React.useEffect(() => {
    setCustomTitleRef.current?.(mode === "form" ? (editingClient ? "Editar cliente" : "Novo cliente") : "Clientes")
    setCustomBackRef.current?.(() => () => handleBackRef.current())

    if (mode === "list") {
      setCustomActionsRef.current?.(
        <MobileHeaderSearch
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          placeholder="Buscar por nome ou CPF/CNPJ..."
        />
      )
    } else {
      setCustomActionsRef.current?.(null)
    }

    return () => {
      setCustomBackRef.current?.(null)
      setCustomTitleRef.current?.(null)
      setCustomActionsRef.current?.(null)
    }
  }, [mode, editingClient])

  const handleEdit = (client: Customer) => {
    setEditingClient(client)
    pushMode("form")
  }

  const handleCreateNew = () => {
    setEditingClient(null)
    pushMode("form")
  }

  const filteredClients = React.useMemo(() => {
    if (!searchQuery.trim()) return clients
    const q = searchQuery.toLowerCase()
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.document && c.document.includes(q)) ||
        (c.phone && c.phone.includes(q))
    )
  }, [clients, searchQuery])

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <ViewTransition viewKey={mode} flex="1" minH="0">
        <Stack gap={5} w="full">
          {mode === "list" && (
            <Box position="relative" w="full">
              {filteredClients.length > 0 ? (
                <Box display="flex" direction="col" w="full">
                  {filteredClients.map((client) => (
                    <Box key={client.id}>
                      <Box
                        w="full"
                        padding={2.5}
                        radius="none"
                        hoverBg="primary/10"
                        cursor="pointer"
                        onClick={() => {
                          if (onSelectClient) {
                            onSelectClient(client)
                          } else {
                            handleEdit(client)
                          }
                        }}
                      >
                        <Stack direction="row" align="center" justify="between" w="full">
                          <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
                            <Avatar fallback={client.name.substring(0, 2).toUpperCase()} />

                            <Stack gap={1} align="start" flex="1" minW="0">
                              <Font variant="body" text={client.name} />
                              <Stack direction="row" align="center" gap={2.5}>
                                <Font
                                  variant="auxiliary"
                                  color="muted"
                                  text={client.document ? `CPF/CNPJ: ${client.document}` : "Sem documento"}
                                />
                                {client.phone && (
                                  <Font variant="auxiliary" color="muted" text={`• ${client.phone}`} />
                                )}
                              </Stack>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Box>
                      <Box border borderStyle="solid" borderColor="border/40" w="full" />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box padding={12} align="center" justify="center" w="full">
                  <EmptyState
                    variant="transparent"
                    icon={UserX}
                    title="Nenum cliente encontrado"
                    subtitle={
                      searchQuery
                        ? "Tente buscar com outro termo."
                        : "Cadastre seu primeiro cliente para gerenciar no PDV."
                    }
                  />
                </Box>
              )}

              {/* Botão flutuante para criar novo cliente */}
              <Box position="fixed" bottom={12} right={5} zIndex="40">
                <Button
                  variant="primary-pill-icon"
                  icon={Plus}
                  onClick={handleCreateNew}
                  aria-label="Cadastrar novo cliente"
                />
              </Box>
            </Box>
          )}

          {mode === "form" && (
            <DeliveryClientFormScreen
              initialCustomer={editingClient || undefined}
              onBack={popMode}
              setCustomTitle={setCustomTitle}
              setCustomBack={setCustomBack}
            />
          )}
        </Stack>
      </ViewTransition>
    </Box>
  )
}
