"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Avatar } from "@/components/store/base/Avatar"
import { UserX } from "lucide-react"
import { useCustomers, Customer } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import { DeliveryClientFormScreen } from "@/components/store/advanced/DeliveryClientFormScreen"
import { ViewTransition } from "@/components/store/base/ViewTransition"
import { ListSectionLayout } from "@/components/store/intermediary/ListSectionLayout"

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

  const handleEdit = (client: Customer) => {
    setEditingClient(client)
    pushMode("form")
  }

  const handleCreateNew = () => {
    setEditingClient(null)
    pushMode("form")
  }

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <ViewTransition viewKey={mode} flex="1" minH="0">
        <Stack gap={5} w="full" h="full">
          {mode === "list" && (
            <ListSectionLayout<Customer>
              title="Clientes"
              items={clients}
              searchPlaceholder="Buscar por nome ou CPF/CNPJ..."
              searchFilterFn={(client, query) => {
                const q = query.toLowerCase()
                return (
                  client.name.toLowerCase().includes(q) ||
                  (!!client.document && client.document.includes(q)) ||
                  (!!client.phone && client.phone.includes(q))
                )
              }}
              emptyIcon={UserX}
              emptyTitle="Nenhum cliente encontrado"
              emptySubtitle="Cadastre seu primeiro cliente para gerenciar no PDV."
              onAdd={handleCreateNew}
              getItemKey={(client) => client.id}
              setCustomBack={setCustomBack}
              setCustomTitle={setCustomTitle}
              setCustomActions={setCustomActions}
              onBackToDashboard={onBack || onBackToDashboard}
              renderItem={(client) => (
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
              )}
            />
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

