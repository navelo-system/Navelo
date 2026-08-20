"use client"

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
import { UI_STRINGS, formatString } from "@/constants/strings"

interface ClientesSectionProps {
  onBackToDashboard?: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onBack?: () => void
  onSelectClient?: (client: Customer) => void
}

function ClientListItem({
  client,
  onClick,
}: {
  client: Customer
  onClick: () => void
}) {
  const s = UI_STRINGS.customers
  const docText = client.document
    ? formatString(s.cpfCnpjTemplate, { document: client.document })
    : s.noDocumentText

  return (
    <Box w="full" padding={2.5} radius="none" hoverBg="primary/10" cursor="pointer" onClick={onClick}>
      <Stack direction="row" align="center" justify="between" w="full">
        <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
          <Avatar fallback={client.name.substring(0, 2).toUpperCase()} />
          <Stack gap={1} align="start" flex="1" minW="0">
            <Font variant="body" text={client.name} />
            <Stack direction="row" align="center" gap={2.5}>
              <Font variant="auxiliary" color="muted" text={docText} />
              {client.phone && <Font variant="auxiliary" color="muted" text={`• ${client.phone}`} />}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
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
  const s = UI_STRINGS.customers
  const dbCustomers = useCustomers(tenantId)
  const clients = React.useMemo(() => (Array.isArray(dbCustomers) ? dbCustomers : []), [dbCustomers])

  const [modeHistory, setModeHistory] = React.useState<("list" | "form")[]>(["list"])
  const mode = modeHistory[modeHistory.length - 1] || "list"
  const [editingClient, setEditingClient] = React.useState<Customer | null>(null)

  const pushMode = React.useCallback((newMode: "list" | "form") => {
    setModeHistory((prev) => [...prev, newMode])
  }, [])

  const popMode = React.useCallback(() => {
    setEditingClient(null)
    setModeHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }, [])

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <ViewTransition viewKey={mode} flex="1" minH="0">
        <Stack gap={5} w="full" h="full">
          {mode === "list" && (
            <ListSectionLayout<Customer>
              title={s.title}
              items={clients}
              searchPlaceholder={s.searchPlaceholder}
              searchFilterFn={(c, query) => {
                const q = query.toLowerCase()
                return c.name.toLowerCase().includes(q) || (!!c.document && c.document.includes(q)) || (!!c.phone && c.phone.includes(q))
              }}
              emptyIcon={UserX}
              emptyTitle={s.emptyTitle}
              emptySubtitle={s.emptySubtitle}
              onAdd={() => { setEditingClient(null); pushMode("form") }}
              getItemKey={(c) => c.id}
              setCustomBack={setCustomBack}
              setCustomTitle={setCustomTitle}
              setCustomActions={setCustomActions}
              onBackToDashboard={onBack || onBackToDashboard}
              renderItem={(client) => (
                <ClientListItem
                  client={client}
                  onClick={() => {
                    if (onSelectClient) onSelectClient(client)
                    else { setEditingClient(client); pushMode("form") }
                  }}
                />
              )}
            />
          )}

          {mode === "form" && (
            <DeliveryClientFormScreen
              initialCustomer={editingClient || undefined}
              onBack={popMode}
              setCustomTitle={setCustomTitle}
              setCustomBack={setCustomBack}
              setCustomActions={setCustomActions}
              showSkip={false}
              showSaveSwitch={false}
              showSearchInHeader={false}
              title={editingClient ? "Editar Cliente" : "Novo Cliente"}
            />
          )}
        </Stack>
      </ViewTransition>
    </Box>
  )
}
