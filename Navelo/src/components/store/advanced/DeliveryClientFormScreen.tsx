"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Switch } from "@/components/store/base/Switch"
import { Badge } from "@/components/store/base/Badge"
import { AddressList } from "@/components/store/advanced/AddressList"
import { ClientAddressFormModal, AddressFormData } from "@/components/store/advanced/ClientAddressFormModal"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Plus, Check, UserX, ArrowRight, Trash2 } from "lucide-react"
import { useCustomers, dal, Customer, CustomerAddress } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import { DeliveryClientInfo } from "./DeliveryCheckoutConfirmation"

export interface DeliveryClientFormScreenProps {
  onBack: () => void
  onSelectClient?: (client: DeliveryClientInfo) => void
  initialClient?: DeliveryClientInfo | null
  initialCustomer?: Customer | null
  title?: string
  showSkip?: boolean
  showSaveSwitch?: boolean
  showSearchInHeader?: boolean
  setCustomActions?: (actions: React.ReactNode | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomBack?: (cb: (() => void) | null) => void
}

export const DeliveryClientFormScreen: React.FC<DeliveryClientFormScreenProps> = ({
  onBack,
  onSelectClient,
  initialClient,
  initialCustomer,
  title = "Identificar Cliente",
  showSkip = true,
  showSaveSwitch = true,
  showSearchInHeader = true,
  setCustomActions,
  setCustomTitle,
  setCustomBack,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "default"
  const rawCustomers = useCustomers(tenantId)
  const customers = React.useMemo(() => Array.isArray(rawCustomers) ? rawCustomers : [], [rawCustomers])

  // Busca de clientes no cabeçalho
  const [searchQuery, setSearchQuery] = React.useState("")

  // Switch de salvar cliente (default: ativo / true)
  const [saveClient, setSaveClient] = React.useState(true)

  // Form states (Dados pessoais)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [document, setDocument] = React.useState("")
  const [ie, setIe] = React.useState("")
  const [rg, setRg] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | undefined>()

  // Endereços
  const [clientAddresses, setClientAddresses] = React.useState<CustomerAddress[]>([])
  const [isAddressModalOpen, setIsAddressModalOpen] = React.useState(false)
  const [editingAddress, setEditingAddress] = React.useState<CustomerAddress | null>(null)

  // Referência do formulário para validação HTML5 nativa
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (initialCustomer) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(initialCustomer.name || "")
      setEmail(initialCustomer.email || "")
      setDocument(initialCustomer.document || "")
      setIe(initialCustomer.ie || "")
      setRg(initialCustomer.rg || "")
      setPhone(initialCustomer.phone || "")
      setSelectedCustomerId(initialCustomer.id)
      setClientAddresses(initialCustomer.addresses || [])
    } else if (initialClient && initialClient.name) {
      setName(initialClient.name)
      setPhone(initialClient.phone || "")
      setSelectedCustomerId(initialClient.customerId)
      if (initialClient.address && initialClient.address !== "Endereço não informado") {
        setClientAddresses([
          {
            id: `addr-init-${Date.now()}`,
            customerId: initialClient.customerId || "",
            street: initialClient.address,
            number: "S/N",
            neighborhood: "",
            city: "",
            state: "",
            zipCode: "",
            isDefault: true,
          },
        ])
      } else {
        setClientAddresses([])
      }
    } else {
      setName("")
      setEmail("")
      setDocument("")
      setIe("")
      setRg("")
      setPhone("")
      setClientAddresses([])
      setSelectedCustomerId(undefined)
    }
  }, [initialCustomer, initialClient])

  const filteredCustomers = React.useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        (c.document && c.document.includes(q))
    )
  }, [customers, searchQuery])

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomerId(customer.id)
    setName(customer.name)
    setPhone(customer.phone || "")
    setEmail(customer.email || "")
    setDocument(customer.document || "")
    setRg(customer.rg || "")
    setIe(customer.ie || "")

    if (customer.addresses && customer.addresses.length > 0) {
      setClientAddresses(customer.addresses)
    } else {
      setClientAddresses([])
    }
  }

  const handleSaveAddress = (addrData: AddressFormData) => {
    if (editingAddress) {
      setClientAddresses((prev) =>
        prev.map((a) =>
          a.id === editingAddress.id
            ? {
              ...a,
              name: addrData.name,
              street: addrData.street,
              number: addrData.number,
              complement: addrData.complement,
              neighborhood: addrData.neighborhood,
              city: addrData.city,
              zipCode: addrData.zip,
              reference_point: addrData.reference_point,
            }
            : a
        )
      )
    } else {
      const newAddress: CustomerAddress = {
        id: `addr-${Date.now()}`,
        customerId: selectedCustomerId || "",
        name: addrData.name,
        street: addrData.street,
        number: addrData.number,
        complement: addrData.complement,
        neighborhood: addrData.neighborhood,
        city: addrData.city,
        state: "",
        zipCode: addrData.zip,
        reference_point: addrData.reference_point,
        isDefault: clientAddresses.length === 0,
      }
      setClientAddresses((prev) => [...prev, newAddress])
    }
    setIsAddressModalOpen(false)
    setEditingAddress(null)
  }

  const handleEditAddress = (addr: CustomerAddress) => {
    setEditingAddress(addr)
    setIsAddressModalOpen(true)
  }

  const handleDeleteAddress = (addr: CustomerAddress) => {
    setClientAddresses((prev) => prev.filter((a) => a.id !== addr.id))
  }

  const formatPrimaryAddress = () => {
    if (clientAddresses.length === 0) return "Endereço não informado"
    const primaryAddr = clientAddresses.find((a) => a.isDefault) || clientAddresses[0]
    let parts = primaryAddr.street
    if (primaryAddr.number) parts += `, ${primaryAddr.number}`
    if (primaryAddr.complement) parts += ` - ${primaryAddr.complement}`
    if (primaryAddr.neighborhood) parts += `, ${primaryAddr.neighborhood}`
    if (primaryAddr.city) parts += ` - ${primaryAddr.city}`
    if (primaryAddr.zipCode) parts += ` (CEP: ${primaryAddr.zipCode})`
    return parts
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSubmit = React.useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    // Validação estrita dos campos obrigatórios do formulário
    if (formRef.current && !formRef.current.reportValidity()) {
      return
    }

    if (!name.trim()) {
      formRef.current?.reportValidity()
      return
    }

    const formattedAddress = formatPrimaryAddress()

    let finalCustomerId = selectedCustomerId
    if (selectedCustomerId && tenantId && name.trim()) {
      try {
        await dal.customers.update({
          id: selectedCustomerId,
          tenant_id: tenantId,
          company_id: tenantId,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          document: document.trim() || "",
          rg: rg.trim() || undefined,
          ie: ie.trim() || undefined,
          type: document.length > 14 ? "PJ" : "PF",
          addresses: clientAddresses.map((a, i) => ({
            ...a,
            customerId: selectedCustomerId,
            isDefault: i === 0,
          })),
        })
      } catch (err) {
        console.error("Erro ao atualizar cliente no Dexie:", err)
      }
    } else if ((saveClient || !showSaveSwitch) && !finalCustomerId && tenantId && name.trim()) {
      const newCustId = `cli-${Date.now()}`
      try {
        await dal.customers.create({
          id: newCustId,
          tenant_id: tenantId,
          company_id: tenantId,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          document: document.trim() || "",
          rg: rg.trim() || undefined,
          ie: ie.trim() || undefined,
          type: document.length > 14 ? "PJ" : "PF",
          addresses: clientAddresses.map((a, i) => ({
            ...a,
            customerId: newCustId,
            isDefault: i === 0,
          })),
        })
        finalCustomerId = newCustId
      } catch (err) {
        console.error("Erro ao salvar cliente no Dexie:", err)
      }
    }

    onSelectClient?.({
      name: name.trim(),
      phone: phone.trim(),
      address: formattedAddress,
      customerId: finalCustomerId,
    })
  }, [name, phone, email, document, rg, ie, selectedCustomerId, tenantId, clientAddresses, saveClient, showSaveSwitch, onSelectClient, formatPrimaryAddress])

  const handleSkip = () => {
    const formattedAddress = formatPrimaryAddress()
    onSelectClient?.({
      name: name.trim() || "Cliente Balcão",
      phone: phone.trim(),
      address: formattedAddress !== "Endereço não informado" ? formattedAddress : "Entrega a combinar",
      customerId: selectedCustomerId,
    })
  }

  const handleDeleteCustomer = async () => {
    if (selectedCustomerId && tenantId) {
      try {
        await dal.customers.delete(selectedCustomerId, tenantId)
      } catch (err) {
        console.error("Erro ao excluir cliente:", err)
      }
    }
    onBackRef.current?.()
  }

  // Configurações do cabeçalho com MobileHeaderSearch e botão Primário no Check
  const onBackRef = React.useRef(onBack)
  const handleSubmitRef = React.useRef(handleSubmit)

  React.useEffect(() => {
    onBackRef.current = onBack
  }, [onBack])

  React.useEffect(() => {
    handleSubmitRef.current = handleSubmit
  }, [handleSubmit])

  const isEditMode = Boolean(initialCustomer || selectedCustomerId)

  React.useEffect(() => {
    setCustomTitle?.(title)
    setCustomBack?.(() => () => onBackRef.current?.())

    const actionsContent = (
      <Stack direction="row" align="center" gap={2.5}>
        {isEditMode && (
          <Button
            type="button"
            variant="danger-pill-icon"
            icon={Trash2}
            onClick={handleDeleteCustomer}
            title="Excluir cliente"
          />
        )}
        <Button
          type="button"
          variant="primary-pill-icon"
          icon={Check}
          onClick={() => handleSubmitRef.current?.()}
          title="Confirmar"
        />
      </Stack>
    )

    setCustomActions?.(
      showSearchInHeader ? (
        <MobileHeaderSearch
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          placeholder="Buscar cliente cadastrado..."
        >
          {actionsContent}
        </MobileHeaderSearch>
      ) : (
        actionsContent
      )
    )

    return () => {
      setCustomActions?.(null)
    }
  }, [setCustomActions, setCustomTitle, setCustomBack, searchQuery, title, showSearchInHeader, isEditMode])

  return (
    <Box w="full" overflow="auto">
      <Stack gap={5} w="full">
        {/* Barra superior: Switch salvar na lista (esquerda) e Botão Pular (direita) */}
        {(showSaveSwitch || showSkip) && (
          <Stack direction="row" justify="between" align="center" w="full">
            {showSaveSwitch ? (
              <Stack direction="row" align="center" gap={2.5}>
                <Switch
                  id="save-client-switch"
                  checked={saveClient}
                  onChange={(e) => setSaveClient(e.target.checked)}
                />
                <Box cursor="pointer" onClick={() => setSaveClient((prev) => !prev)}>
                  <Font
                    variant="body-sm-semibold"
                    text="Salvar cliente na lista"
                  />
                </Box>
              </Stack>
            ) : (
              <Box />
            )}

            {showSkip && (
              <Box w="auto" shrink="0">
                <Button
                  type="button"
                  variant="outline-sm"
                  label="Pular"
                  iconRight={ArrowRight}
                  onClick={handleSkip}
                />
              </Box>
            )}
          </Stack>
        )}

        {/* Se houver busca ativa, substitui o formulário pela lista de clientes no mesmo formato da ClientesSection */}
        {searchQuery.trim().length > 0 ? (
          <Box w="full" position="relative">
            {filteredCustomers.length > 0 ? (
              <Grid cols={3} gap={5} w="full">
                {filteredCustomers.map((client) => (
                  <Box
                    key={client.id}
                    padding={5}
                    bg="bg-surface"
                    radius="default"
                    border={true}
                    borderColor="border-border"
                    hoverBg="secondary/10"
                    cursor="pointer"
                    onClick={() => {
                      handleSelectCustomer(client)
                      setSearchQuery("")
                    }}
                  >
                    <Stack gap={2.5} w="full">
                      <Stack direction="row" justify="between" align="center" w="full">
                        <Font variant="body-bold" text={client.name} />
                        {client.type && (
                          <Badge variant="primary" label={client.type} />
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
                subtitle="Tente pesquisar com outro termo ou limpe a busca para cadastrar um novo cliente."
              />
            )}
          </Box>
        ) : (
          /* ================= FORMULÁRIO DADOS PESSOAIS EM LARGURA TOTAL ================= */
          <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border" w="full">
            <Box as="form" ref={formRef} onSubmit={handleSubmit} w="full">
              <Stack gap={5} w="full">
                <Font variant="body-bold" text="Dados pessoais" />

                {/* Lista vertical de campos bordered */}
                <Stack gap={2.5} w="full">
                  <Input
                    placeholder="* Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <Input
                    placeholder="E-mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <Input
                    mask="cpf"
                    placeholder="CPF"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                  />

                  <Input
                    mask="phone"
                    placeholder="Telefone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Stack>

                {/* Seção de Endereço com botão Pill + */}
                <Stack gap={2.5} w="full">
                  <Stack direction="row" align="center" gap={2.5}>
                    <Font variant="body-bold" text="Endereço" />
                    <Button
                      type="button"
                      variant="primary-icon-xs"
                      icon={Plus}
                      onClick={() => {
                        setEditingAddress(null)
                        setIsAddressModalOpen(true)
                      }}
                      title="Adicionar endereço"
                    />
                  </Stack>

                  {clientAddresses.length > 0 && (
                    <Box paddingY={2.5} w="full">
                      <AddressList
                        addresses={clientAddresses}
                        onEdit={handleEditAddress}
                        onDelete={handleDeleteAddress}
                      />
                    </Box>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Box>
        )}
      </Stack>

      {/* Modal exclusivo para Adicionar/Editar Endereço */}
      <ClientAddressFormModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false)
          setEditingAddress(null)
        }}
        onSave={handleSaveAddress}
        initialData={
          editingAddress
            ? {
              id: editingAddress.id,
              name: editingAddress.name || "Principal",
              street: editingAddress.street,
              number: editingAddress.number,
              complement: editingAddress.complement,
              neighborhood: editingAddress.neighborhood,
              city: editingAddress.city,
              zip: editingAddress.zipCode,
            }
            : null
        }
      />
    </Box>
  )
}
