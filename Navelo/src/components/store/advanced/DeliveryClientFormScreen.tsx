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
import { Avatar } from "@/components/store/base/Avatar"
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

export function parseAddressString(address: string) {
  if (!address || address === "Endereço não informado") {
    return { name: "Principal", street: "", number: "", complement: "", neighborhood: "", city: "", zip: "" }
  }

  let str = address
  let zip = ""
  const cepMatch = str.match(/\(CEP:\s*([\d\-]+)\)/i)
  if (cepMatch) {
    zip = cepMatch[1]
    str = str.replace(/\(CEP:\s*[\d\-]+\)/i, "").trim()
  }

  const parts = str.split(",").map((p) => p.trim()).filter(Boolean)
  let street = ""
  let number = ""
  let complement = ""
  let neighborhood = ""
  let city = ""

  if (parts.length >= 1) {
    street = parts[0]
  }

  if (parts.length >= 2) {
    const subParts2 = parts[1].split("-").map((p) => p.trim())
    number = subParts2[0] || ""
    if (subParts2.length > 1) {
      complement = subParts2.slice(1).join(" - ")
    }
  }

  if (parts.length >= 3) {
    const subParts3 = parts[2].split("-").map((p) => p.trim())
    neighborhood = subParts3[0] || ""
    if (subParts3.length > 1) {
      city = subParts3[1] || ""
    }
  }

  return {
    name: "Principal",
    street: street || address,
    number: number || "S/N",
    complement: complement || "",
    neighborhood: neighborhood || "",
    city: city || "",
    zip: zip || "",
  }
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
  const customersRef = React.useRef(customers)
  React.useEffect(() => {
    customersRef.current = customers
  }, [customers])

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
      const matchingCustomer = customersRef.current.find(
        (c) =>
          (initialClient.customerId && c.id === initialClient.customerId) ||
          (c.name && c.name.trim().toLowerCase() === initialClient.name.trim().toLowerCase()) ||
          (initialClient.phone && c.phone && c.phone.trim() === initialClient.phone.trim())
      )

      if (matchingCustomer) {
        setName(matchingCustomer.name || initialClient.name)
        setEmail(matchingCustomer.email || "")
        setDocument(matchingCustomer.document || "")
        setIe(matchingCustomer.ie || "")
        setRg(matchingCustomer.rg || "")
        setPhone(matchingCustomer.phone || initialClient.phone || "")
        setSelectedCustomerId(matchingCustomer.id)
        if (matchingCustomer.addresses && matchingCustomer.addresses.length > 0) {
          setClientAddresses(matchingCustomer.addresses)
        } else if (initialClient.address && initialClient.address !== "Endereço não informado") {
          const parsed = parseAddressString(initialClient.address)
          setClientAddresses([
            {
              id: `addr-init-${Date.now()}`,
              customerId: matchingCustomer.id,
              street: parsed.street,
              number: parsed.number,
              complement: parsed.complement,
              neighborhood: parsed.neighborhood,
              city: parsed.city,
              state: "",
              zipCode: parsed.zip,
              isDefault: true,
            },
          ])
        } else {
          setClientAddresses([])
        }
      } else {
        setName(initialClient.name)
        setPhone(initialClient.phone || "")
        setEmail("")
        setDocument("")
        setIe("")
        setRg("")
        setSelectedCustomerId(initialClient.customerId)
        if (initialClient.address && initialClient.address !== "Endereço não informado") {
          const parsed = parseAddressString(initialClient.address)
          setClientAddresses([
            {
              id: `addr-init-${Date.now()}`,
              customerId: initialClient.customerId || "",
              street: parsed.street,
              number: parsed.number,
              complement: parsed.complement,
              neighborhood: parsed.neighborhood,
              city: parsed.city,
              state: "",
              zipCode: parsed.zip,
              isDefault: true,
            },
          ])
        } else {
          setClientAddresses([])
        }
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
      const cleanAddresses = customer.addresses.map((a) => {
        if (a.street && (a.street.includes("(CEP:") || a.street.includes(" - "))) {
          const p = parseAddressString(a.street)
          return {
            ...a,
            street: p.street,
            number: p.number !== "S/N" ? p.number : a.number,
            complement: p.complement || a.complement,
            neighborhood: p.neighborhood || a.neighborhood,
            city: p.city || a.city,
            zipCode: p.zip || a.zipCode,
          }
        }
        return a
      })
      setClientAddresses(cleanAddresses)
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

    if (primaryAddr.street.includes("(CEP:") || (primaryAddr.street.includes(" - ") && primaryAddr.street.includes(","))) {
      return primaryAddr.street
    }

    let parts = primaryAddr.street
    if (primaryAddr.number && primaryAddr.number !== "S/N" && !primaryAddr.street.includes(primaryAddr.number)) {
      parts += `, ${primaryAddr.number}`
    }
    if (primaryAddr.complement && !primaryAddr.street.includes(primaryAddr.complement)) {
      parts += ` - ${primaryAddr.complement}`
    }
    if (primaryAddr.neighborhood && !primaryAddr.street.includes(primaryAddr.neighborhood)) {
      parts += `, ${primaryAddr.neighborhood}`
    }
    if (primaryAddr.city && !primaryAddr.street.includes(primaryAddr.city)) {
      parts += ` - ${primaryAddr.city}`
    }
    if (primaryAddr.zipCode && !primaryAddr.street.includes(primaryAddr.zipCode)) {
      parts += ` (CEP: ${primaryAddr.zipCode})`
    }
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

  // Botão de deletar deve ser exibido EXCLUSIVAMENTE na tela de EDITAR cliente existente
  const showDeleteButton = Boolean(initialCustomer) && !title.toLowerCase().includes("identificar") && !title.toLowerCase().includes("novo")

  React.useEffect(() => {
    setCustomTitle?.(title)
    setCustomBack?.(() => () => onBackRef.current?.())

    const actionsContent = (
      <Stack direction="row" align="center" gap={2.5}>
        {showDeleteButton && (
          <Button
            type="button"
            variant="danger-pill-icon-confirm"
            confirmTitle="Excluir Cliente"
            confirmSubtitle="Confirmar exclusão de cadastro"
            confirmParagraph="Tem certeza de que deseja excluir este cliente do sistema? Esta ação não poderá ser desfeita."
            onConfirm={handleDeleteCustomer}
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
  }, [setCustomActions, setCustomTitle, setCustomBack, searchQuery, title, showSearchInHeader, showDeleteButton])

  return (
    <Box display="flex" direction="col" flex="1" minH="0" overflow="auto" w="full">
      <Stack gap={5} w="full">
        {/* Barra superior: Switch salvar na lista (esquerda) e Botão Pular (direita) - Ocultos durante busca */}
        {searchQuery.trim().length === 0 && (showSaveSwitch || showSkip) && (
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
              <Box display="flex" direction="col" w="full">
                {filteredCustomers.map((client, idx) => (
                  <Box key={client.id}>
                    <Box
                      w="full"
                      paddingY={2.5}
                      paddingX={2.5}
                      radius="none"
                      hoverBg="primary/10"
                      cursor="pointer"
                      onClick={() => {
                        handleSelectCustomer(client)
                        setSearchQuery("")
                      }}
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
                    {idx < filteredCustomers.length - 1 && (
                      <Box borderBottom={true} borderColor="border-border" w="full" />
                    )}
                  </Box>
                ))}
              </Box>
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

                {/* Seção de Endereço com botão Pill + (visível apenas se não houver endereço cadastrado) */}
                <Stack gap={2.5} w="full">
                  <Stack direction="row" align="center" gap={2.5}>
                    <Font variant="body-bold" text="Endereço" />
                    {clientAddresses.length === 0 && (
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
                    )}
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
