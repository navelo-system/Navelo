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
}

export const ClientesSection: React.FC<ClientesSectionProps> = ({
  onBackToDashboard,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
  onBack,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id

  // Clientes do banco de dados local IndexedDB
  const dbCustomers = useCustomers(tenantId)
  const clients = React.useMemo(() => Array.isArray(dbCustomers) ? dbCustomers : [], [dbCustomers])

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

  React.useEffect(() => {
    if (mode === "list") {
      setCustomTitle?.("Clientes")
      if (modeHistory.length > 1) {
        setCustomBack?.(() => popMode)
      } else if (onBack) {
        setCustomBack?.(() => () => onBack())
      } else {
        setCustomBack?.(null)
      }
      setCustomActions?.(
        <MobileHeaderSearch
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          placeholder="Buscar por nome ou CPF/CNPJ..."
        />
      )
    }
  }, [mode, searchQuery, modeHistory.length, popMode, setCustomBack, setCustomTitle, setCustomActions, onBack])

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
    <ViewTransition viewKey={mode} flex="1" minH="0">
      {mode === "form" ? (
        <DeliveryClientFormScreen
          onBack={popMode}
          onSelectClient={popMode}
          initialCustomer={editingClient}
          title={editingClient ? "Editar Cliente" : "Novo Cliente"}
          showSkip={false}
          showSaveSwitch={false}
          showSearchInHeader={false}
          setCustomTitle={setCustomTitle}
          setCustomActions={setCustomActions}
          setCustomBack={setCustomBack}
        />
      ) : (
        <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
          <Stack gap={5} w="full">
            <Box position="relative" w="full">
          {filteredClients.length > 0 ? (
            <Box display="flex" direction="col" w="full">
              {filteredClients.map((client, idx) => (
                <Box key={client.id}>
                  <Box
                    w="full"
                    paddingY={2.5}
                    paddingX={2.5}
                    radius="none"
                    hoverBg="primary/10"
                    cursor="pointer"
                    onClick={() => handleEdit(client)}
                  >
                    <Stack direction="row" align="center" justify="between" w="full">
                      {/* Lado Esquerdo: Avatar + Nome e Documento/Telefone */}
                      <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
                        <Avatar fallback={client.name ? client.name.charAt(0).toUpperCase() : "C"} />

                        <Stack gap={0} align="start" flex="1" minW="0">
                          <Font variant="body" text={client.name} />
                          {(client.document || client.phone) && (
                            <Font
                              variant="auxiliary"
                              color="muted"
                              truncate={true}
                              text={client.document || client.phone || ""}
                            />
                          )}
                        </Stack>
                      </Stack>
                    </Stack>
                  </Box>
                  {idx < filteredClients.length - 1 && (
                    <Box borderBottom={true} borderColor="border-border" w="full" />
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <EmptyState
              icon={UserX}
              title="Nenhum cliente encontrado"
              subtitle="Tente pesquisar com outro termo ou cadastre um novo cliente."
            />
          )}

          {/* Botão FAB fixo no canto inferior direito */}
          <Box position="fixed" bottom={6} right={6} zIndex="50">
            <Button
              variant="secondary-pill-icon"
              icon={Plus}
              onClick={handleCreateNew}
              title="Novo cliente"
            />
          </Box>
        </Box>
      </Stack>
    </Box>
      )}
    </ViewTransition>
  )
}
