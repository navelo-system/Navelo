"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Plus, UserX } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { useCustomers, Customer } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import { DeliveryClientFormScreen } from "@/components/store/advanced/DeliveryClientFormScreen"

interface ClientesSectionProps {
  onBackToDashboard?: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onBack?: () => void
}

export const ClientesSection: React.FC<ClientesSectionProps> = ({
  setCustomBack,
  setCustomTitle,
  setCustomActions,
  onBack,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id

  // Clientes do banco de dados local IndexedDB
  const dbCustomers = useCustomers(tenantId)
  const clients: Customer[] = Array.isArray(dbCustomers) ? dbCustomers : []

  const [mode, setMode] = React.useState<"list" | "form">("list")
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
      if (onBack) {
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
  }, [mode, searchQuery, setCustomBack, setCustomTitle, setCustomActions, onBack])

  const handleEdit = (client: Customer) => {
    setEditingClient(client)
    setMode("form")
  }

  const handleCreateNew = () => {
    setEditingClient(null)
    setMode("form")
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

  if (mode === "form") {
    return (
      <DeliveryClientFormScreen
        onBack={() => {
          setEditingClient(null)
          setMode("list")
        }}
        onSelectClient={() => {
          setEditingClient(null)
          setMode("list")
        }}
        initialCustomer={editingClient}
        title={editingClient ? "Editar Cliente" : "Novo Cliente"}
        showSkip={false}
        showSaveSwitch={false}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
        setCustomBack={setCustomBack}
      />
    )
  }

  return (
    <Box w="full" overflow="auto">
      <Stack gap={5} w="full">
        <Box w="full">
          {filteredClients.length > 0 ? (
            <Grid cols={3} gap={5} w="full">
              {filteredClients.map((client) => (
                <Box
                  key={client.id}
                  padding={5}
                  bg="bg-surface"
                  radius="default"
                  border={true}
                  borderColor="border-border"
                  hoverBg="secondary/10"
                  cursor="pointer"
                  onClick={() => handleEdit(client)}
                >
                  <Stack gap={2.5} w="full">
                    <Stack direction="row" justify="between" align="center" w="full">
                      <Font variant="body-bold" text={client.name} />
                      {client.type && (
                        <span className="text-xs px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary font-medium">
                          {client.type}
                        </span>
                      )}
                    </Stack>

                    <Stack gap={1} w="full">
                      {client.document && (
                        <Font variant="description" color="muted" text={`Doc: ${client.document}`} />
                      )}
                      {client.phone && (
                        <Font variant="description" color="muted" text={`Tel: ${client.phone}`} />
                      )}
                      {client.email && (
                        <Font variant="description" color="muted" text={`Email: ${client.email}`} />
                      )}
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Grid>
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
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
