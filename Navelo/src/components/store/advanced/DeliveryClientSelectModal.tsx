"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Icon } from "@/components/store/base/Icon"
import { User, Search, Check, Plus, Trash2, Edit2, MapPin, UserX } from "lucide-react"
import { useCustomers, dal } from "@/lib/dal"
import { Customer } from "@/lib/dal/db"
import { useTenant } from "@/lib/context/TenantContext"
import { DeliveryClientInfo } from "./DeliveryCheckoutConfirmation"
import { ClientAddressFormModal, AddressFormData } from "./ClientAddressFormModal"
import { EmptyState } from "@/components/store/intermediary/EmptyState"

export interface DeliveryClientSelectModalProps {
  isOpen: boolean
  onClose: () => void
  initialClient?: DeliveryClientInfo | null
  onSelectClient: (client: DeliveryClientInfo) => void
}

export const DeliveryClientSelectModal: React.FC<DeliveryClientSelectModalProps> = ({
  isOpen,
  onClose,
  initialClient,
  onSelectClient,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "default"
  const rawCustomers = useCustomers(tenantId)
  const customers = React.useMemo(() => Array.isArray(rawCustomers) ? rawCustomers : [], [rawCustomers])

  const [tab, setTab] = React.useState<"search" | "form">("form")
  const [searchQuery, setSearchQuery] = React.useState("")

  // Form states (Dados pessoais)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [document, setDocument] = React.useState("")
  const [ie, setIe] = React.useState("")
  const [rg, setRg] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [addresses, setAddresses] = React.useState<AddressFormData[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | undefined>()

  // Modal de endereço
  const [isAddressModalOpen, setIsAddressModalOpen] = React.useState(false)
  const [editingAddressIndex, setEditingAddressIndex] = React.useState<number | null>(null)

  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen)
  const [prevInitialClient, setPrevInitialClient] = React.useState(initialClient)

  if (isOpen !== prevIsOpen || initialClient !== prevInitialClient) {
    setPrevIsOpen(isOpen)
    setPrevInitialClient(initialClient)
    if (isOpen) {
      if (initialClient && initialClient.name) {
        setName(initialClient.name)
        setPhone(initialClient.phone || "")
        setEmail("")
        setDocument("")
        setIe("")
        setRg("")
        setSelectedCustomerId(initialClient.customerId)
        // eslint-disable-next-line max-depth
        if (initialClient.address && initialClient.address !== "Endereço não informado") {
          setAddresses([
            {
              name: "Principal",
              street: initialClient.address,
              number: "",
              neighborhood: "",
              city: "",
              zip: "",
            },
          ])
        } else {
          setAddresses([])
        }
      } else {
        setName("")
        setEmail("")
        setDocument("")
        setIe("")
        setRg("")
        setPhone("")
        setAddresses([])
        setSelectedCustomerId(undefined)
      }
    }
  }

  const filteredCustomers = customers.filter(
    (c: Customer) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(searchQuery)) ||
      (c.document && c.document.includes(searchQuery))
  )

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomerId(customer.id)
    setName(customer.name)
    setPhone(customer.phone || "")
    setEmail(customer.email || "")
    setDocument(customer.document || "")
    setRg(customer.rg || "")
    setIe(customer.ie || "")

    if (customer.addresses && customer.addresses.length > 0) {
      setAddresses(
        customer.addresses.map((a) => ({
          id: a.id,
          name: a.name || "Endereço",
          street: a.street,
          number: a.number,
          complement: a.complement || "",
          neighborhood: a.neighborhood,
          city: a.city,
          zip: a.zipCode,
          reference_point: a.reference_point || "",
        }))
      )
    } else {
      setAddresses([])
    }

    setTab("form")
  }

  const handleSaveAddress = (addrData: AddressFormData) => {
    if (editingAddressIndex !== null) {
      setAddresses((prev) =>
        prev.map((item, idx) => (idx === editingAddressIndex ? addrData : item))
      )
      setEditingAddressIndex(null)
    } else {
      setAddresses((prev) => [...prev, addrData])
    }
  }

  const handleDeleteAddress = (idx: number) => {
    setAddresses((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleEditAddress = (idx: number) => {
    setEditingAddressIndex(idx)
    setIsAddressModalOpen(true)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!name.trim()) return

    // Formata o endereço principal para o delivery
    let formattedAddress = "Endereço não informado"
    if (addresses.length > 0) {
      const primaryAddr = addresses[0]
      let parts = primaryAddr.street
      if (primaryAddr.number) parts += `, ${primaryAddr.number}`
      if (primaryAddr.complement) parts += ` - ${primaryAddr.complement}`
      if (primaryAddr.neighborhood) parts += `, ${primaryAddr.neighborhood}`
      if (primaryAddr.city) parts += ` - ${primaryAddr.city}`
      if (primaryAddr.zip) parts += ` (CEP: ${primaryAddr.zip})`
      formattedAddress = parts
    }

    // Se é um cliente novo que ainda não está no Dexie, salva no Dexie para persistência multi-tenant
    let finalCustomerId = selectedCustomerId
    if (!finalCustomerId && tenantId) {
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
          addresses: addresses.map((a, i) => ({
            id: a.id || `addr-${Date.now()}-${i}`,
            customerId: newCustId,
            name: a.name,
            street: a.street,
            number: a.number,
            complement: a.complement,
            neighborhood: a.neighborhood,
            city: a.city,
            state: "",
            zipCode: a.zip,
            reference_point: a.reference_point,
            isDefault: i === 0,
          })),
        })
        finalCustomerId = newCustId
      } catch (err) {
        console.error("Erro ao salvar cliente no Dexie:", err)
      }
    }

    onSelectClient({
      name: name.trim(),
      phone: phone.trim(),
      address: formattedAddress,
      customerId: finalCustomerId,
    })

    onClose()
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Identificar Cliente do Delivery"
        subtitle="Selecione um cliente cadastrado ou preencha os dados da entrega"
        icon={User}
        successText="Avançar para o Pedido"
        onSuccess={handleSubmit}
        showCancelButton={true}
      >
        <Stack gap={2.5} w="full">
          {/* Alternância de Abas: Buscar Cadastrado vs Dados pessoais */}
          <Stack direction="row" gap={2.5} w="full">
            <Button
              variant={tab === "search" ? "primary" : "secondary"}
              label="Buscar Cadastrado"
              icon={Search}
              onClick={() => setTab("search")}
            />
            <Button
              variant={tab === "form" ? "primary" : "secondary"}
              label="Dados do Cliente"
              icon={Plus}
              onClick={() => setTab("form")}
            />
          </Stack>

          {tab === "search" ? (
            <Stack gap={2.5} w="full">
              <Input
                placeholder="Buscar por nome, telefone ou CPF/CNPJ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />

              <Box maxH="96" overflow="auto" w="full">
                <Stack gap={1} w="full">
                  {filteredCustomers.length === 0 ? (
                    <EmptyState
                      icon={UserX}
                      title="Nenhum cliente cadastrado"
                      subtitle="Tente buscar por outro termo ou cadastre um novo cliente."
                    />
                  ) : (
                    filteredCustomers.map((cust: Customer) => {
                      const isSelected = cust.id === selectedCustomerId
                      const addr = cust.addresses?.find((a) => a.isDefault) || cust.addresses?.[0]
                      return (
                        <Box
                          key={cust.id}
                          padding={2.5}
                          radius="default"
                          border={true}
                          borderColor={isSelected ? "border-brand-primary" : "border-border"}
                          bg={isSelected ? "bg-brand-primary/5" : "bg-surface"}
                          hoverBg="surface-sunken"
                          cursor="pointer"
                          onClick={() => handleSelectCustomer(cust)}
                        >
                          <Stack direction="row" justify="between" align="center" w="full">
                            <Stack gap={0} align="start">
                              <Font variant="body-bold" text={cust.name} />
                              <Font variant="sub-tiny" color="muted" text={cust.phone || "Sem telefone"} />
                              {addr && (
                                <Font
                                  variant="sub-tiny"
                                  color="muted"
                                  text={`${addr.street}, ${addr.number} - ${addr.neighborhood}`}
                                />
                              )}
                            </Stack>
                            {isSelected && <Icon icon={Check} size={16} color="primary" />}
                          </Stack>
                        </Box>
                      )
                    })
                  )}
                </Stack>
              </Box>
            </Stack>
          ) : (
            /* ================= CARD DADOS PESSOAIS (FIEL AO PRINT) ================= */
            <Box as="form" onSubmit={handleSubmit} w="full">
              <Stack gap={2.5} w="full">
                <Font variant="body-bold" text="Dados pessoais" />

                {/* 1. Nome */}
                <Input
                  placeholder="* Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                {/* 2. E-mail */}
                <Input
                  placeholder="E-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {/* 3. CPF */}
                <Input
                  mask="cpf"
                  placeholder="CPF"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                />

                {/* 4. Telefone */}
                <Input
                  mask="phone"
                  placeholder="Telefone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                {/* 7. Seção Endereço com Botão Pill de Adicionar */}
                <Stack gap={2.5} w="full">
                  <Stack direction="row" align="center" gap={2.5}>
                    <Font variant="body-bold" text="Endereço" />
                    <Button
                      variant="primary-pill-icon"
                      icon={Plus}
                      onClick={() => {
                        setEditingAddressIndex(null)
                        setIsAddressModalOpen(true)
                      }}
                    />
                  </Stack>

                  {/* Lista de endereços adicionados */}
                  {addresses.length > 0 && (
                    <Stack gap={1} w="full">
                      {addresses.map((addr, idx) => (
                        <Box
                          key={idx}
                          padding={2.5}
                          bg="surface-sunken"
                          radius="default"
                          border={true}
                          borderColor="border-border"
                          w="full"
                        >
                          <Stack direction="row" justify="between" align="center" w="full">
                            <Stack direction="row" gap={2.5} align="center">
                              <Box shrink="0">
                                <Icon icon={MapPin} size={16} color="primary" />
                              </Box>
                              <Stack gap={0} align="start">
                                <Font variant="body-sm-semibold" text={addr.name || `Endereço ${idx + 1}`} />
                                <Font
                                  variant="description"
                                  color="muted"
                                  text={`${addr.street}${addr.number ? `, ${addr.number}` : ""}${addr.neighborhood ? ` - ${addr.neighborhood}` : ""}${addr.city ? `, ${addr.city}` : ""}`}
                                />
                              </Stack>
                            </Stack>
                            <Stack direction="row" gap={1}>
                              <Button
                                variant="ghost"
                                icon={Edit2}
                                onClick={() => handleEditAddress(idx)}
                              />
                              <Button
                                variant="ghost"
                                icon={Trash2}
                                onClick={() => handleDeleteAddress(idx)}
                              />
                            </Stack>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </Box>
          )}
        </Stack>
      </Modal>

      {/* Modal de Cadastro/Edição de Endereço */}
      <ClientAddressFormModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false)
          setEditingAddressIndex(null)
        }}
        onSave={handleSaveAddress}
        initialData={editingAddressIndex !== null ? addresses[editingAddressIndex] : null}
      />
    </>
  )
}
