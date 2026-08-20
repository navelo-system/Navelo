"use client"

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
import { parseAddressString } from "./DeliveryClientFormScreen"
import { UI_STRINGS } from "@/constants/strings"

export interface DeliveryClientSelectModalProps {
  isOpen: boolean
  onClose: () => void
  initialClient?: DeliveryClientInfo | null
  onSelectClient: (client: DeliveryClientInfo) => void
}

function resolveInitialModalClient(initialClient?: DeliveryClientInfo | null) {
  if (!initialClient || !initialClient.name) {
    return { name: "", phone: "", addresses: [] as AddressFormData[], selectedCustomerId: undefined as string | undefined }
  }
  const addrs: AddressFormData[] = []
  if (initialClient.address && initialClient.address !== "Endereço não informado") {
    const parsed = parseAddressString(initialClient.address)
    addrs.push({
      name: parsed.name, street: parsed.street, number: parsed.number,
      complement: parsed.complement, neighborhood: parsed.neighborhood,
      city: parsed.city, zip: parsed.zip,
    })
  }
  return {
    name: initialClient.name, phone: initialClient.phone || "",
    addresses: addrs, selectedCustomerId: initialClient.customerId,
  }
}

interface DeliveryClientSearchTabProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  filteredCustomers: Customer[]
  selectedCustomerId?: string
  onSelectCustomer: (c: Customer) => void
}

function DeliveryClientSearchTab({
  searchQuery, setSearchQuery, filteredCustomers, selectedCustomerId, onSelectCustomer,
}: DeliveryClientSearchTabProps) {
  const d = UI_STRINGS.delivery
  return (
    <Stack gap={2.5} w="full">
      <Input placeholder={d.searchClientPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} icon={Search} />
      <Box maxH="96" overflow="auto" w="full">
        <Stack gap={1} w="full">
          {filteredCustomers.length === 0 ? (
            <EmptyState icon={UserX} title={d.noRegisteredClientTitle} subtitle={d.noRegisteredClientSubtitle} />
          ) : (
            filteredCustomers.map((customerObj: Customer) => {
              const isSelected = customerObj.id === selectedCustomerId
              const addr = customerObj.addresses?.find((a) => a.isDefault) || customerObj.addresses?.[0]
              return (
                <Box
                  key={customerObj.id} padding={2.5} radius="default" border borderColor={isSelected ? "border-brand-primary" : "border-border"}
                  bg={isSelected ? "bg-brand-primary/5" : "bg-surface"} hoverBg="surface-sunken" cursor="pointer"
                  onClick={() => onSelectCustomer(customerObj)}
                >
                  <Stack direction="row" justify="between" align="center" w="full">
                    <Stack gap={0} align="start">
                      <Font variant="body-bold" text={customerObj.name} />
                      <Font variant="sub-tiny" color="muted" text={customerObj.phone || "Sem telefone"} />
                      {addr && <Font variant="sub-tiny" color="muted" text={`${addr.street}, ${addr.number} - ${addr.neighborhood}`} />}
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
  )
}

interface DeliveryClientFormTabProps {
  name: string
  setName: (v: string) => void
  email: string
  setEmail: (v: string) => void
  document: string
  setDocument: (v: string) => void
  phone: string
  setPhone: (v: string) => void
  addresses: AddressFormData[]
  onOpenNewAddress: () => void
  onEditAddress: (idx: number) => void
  onDeleteAddress: (idx: number) => void
}

function DeliveryClientFormTab({
  name, setName, email, setEmail, document, setDocument, phone, setPhone,
  addresses, onOpenNewAddress, onEditAddress, onDeleteAddress,
}: DeliveryClientFormTabProps) {
  const cust = UI_STRINGS.customers
  return (
    <Stack gap={2.5} w="full">
      <Font variant="body-bold" text={cust.personalDataTitle} />
      <Input placeholder={cust.nameRequiredPlaceholder} value={name} onChange={(e) => setName(e.target.value)} required />
      <Input placeholder={cust.emailPlaceholder} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input mask="cpf" placeholder={cust.cpfPlaceholder} value={document} onChange={(e) => setDocument(e.target.value)} />
      <Input mask="phone" placeholder={cust.phonePlaceholder} value={phone} onChange={(e) => setPhone(e.target.value)} />

      <Stack gap={2.5} w="full">
        <Stack direction="row" align="center" gap={2.5}>
          <Font variant="body-bold" text={cust.addressTitle} />
          {addresses.length === 0 && <Button variant="primary-pill-icon" icon={Plus} onClick={onOpenNewAddress} />}
        </Stack>

        {addresses.length > 0 && (
          <Stack gap={1} w="full">
            {addresses.map((addr, idx) => (
              <Box key={idx} padding={2.5} bg="surface-sunken" radius="default" border borderColor="border-border" w="full">
                <Stack direction="row" justify="between" align="center" w="full">
                  <Stack direction="row" gap={2.5} align="center">
                    <Box shrink="0"><Icon icon={MapPin} size={16} color="primary" /></Box>
                    <Stack gap={0} align="start">
                      <Font variant="body-sm-semibold" text={addr.name || `Endereço ${idx + 1}`} />
                      <Font
                        variant="description" color="muted"
                        text={`${addr.street}${addr.number ? `, ${addr.number}` : ""}${addr.neighborhood ? ` - ${addr.neighborhood}` : ""}${addr.city ? `, ${addr.city}` : ""}`}
                      />
                    </Stack>
                  </Stack>
                  <Stack direction="row" gap={1}>
                    <Button variant="ghost" icon={Edit2} onClick={() => onEditAddress(idx)} />
                    <Button variant="ghost" icon={Trash2} onClick={() => onDeleteAddress(idx)} />
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

function formatClientSelectAddress(addresses: AddressFormData[]) {
  if (addresses.length === 0) return "Endereço não informado"
  const p = addresses[0]
  const numPart = p.number ? `, ${p.number}` : ""
  const compPart = p.complement ? ` - ${p.complement}` : ""
  const neighPart = p.neighborhood ? `, ${p.neighborhood}` : ""
  const cityPart = p.city ? ` - ${p.city}` : ""
  const zipPart = p.zip ? ` (CEP: ${p.zip})` : ""
  return `${p.street}${numPart}${compPart}${neighPart}${cityPart}${zipPart}`
}

interface PersistCustomerParams {
  tenantId: string
  selectedCustomerId?: string
  name: string
  phone: string
  email: string
  document: string
  addresses: AddressFormData[]
}

async function persistSelectedModalCustomer(params: PersistCustomerParams) {
  if (params.selectedCustomerId || !params.tenantId) return params.selectedCustomerId
  const newCustId = `cli-${Date.now()}`
  try {
    await dal.customers.create({
      id: newCustId, tenant_id: params.tenantId, company_id: params.tenantId,
      name: params.name.trim(), phone: params.phone.trim(), email: params.email.trim() || undefined,
      document: params.document.trim() || "", type: params.document.length > 14 ? "PJ" : "PF",
      addresses: params.addresses.map((a, i) => ({
        id: a.id || `addr-${Date.now()}-${i}`, customerId: newCustId, name: a.name, street: a.street,
        number: a.number, complement: a.complement, neighborhood: a.neighborhood, city: a.city,
        state: "", zipCode: a.zip, reference_point: a.reference_point, isDefault: i === 0,
      })),
    })
    return newCustId
  } catch (err) {
    console.error("Erro ao salvar cliente no Dexie:", err)
    return undefined
  }
}

function useDeliveryClientSelectState(initialClient?: DeliveryClientInfo | null, isOpen?: boolean) {
  const init = resolveInitialModalClient(initialClient)
  const [tab, setTab] = React.useState<"search" | "form">("form")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [name, setName] = React.useState(init.name)
  const [email, setEmail] = React.useState("")
  const [document, setDocument] = React.useState("")
  const [phone, setPhone] = React.useState(init.phone)
  const [addresses, setAddresses] = React.useState<AddressFormData[]>(init.addresses)
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | undefined>(init.selectedCustomerId)
  const [isAddressModalOpen, setIsAddressModalOpen] = React.useState(false)
  const [editingAddressIndex, setEditingAddressIndex] = React.useState<number | null>(null)

  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen)
  const [prevInitialClient, setPrevInitialClient] = React.useState(initialClient)

  if (isOpen !== prevIsOpen || initialClient !== prevInitialClient) {
    setPrevIsOpen(isOpen)
    setPrevInitialClient(initialClient)
    if (isOpen) {
      const next = resolveInitialModalClient(initialClient)
      setName(next.name); setPhone(next.phone); setEmail(""); setDocument("")
      setAddresses(next.addresses); setSelectedCustomerId(next.selectedCustomerId)
    }
  }

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomerId(customer.id)
    setName(customer.name)
    setPhone(customer.phone || "")
    setEmail(customer.email || "")
    setDocument(customer.document || "")
    const addrs = (customer.addresses || []).map((a) => {
      const p = parseAddressString(a.street)
      return {
        id: a.id, name: a.name || "Endereço", street: p.street,
        number: p.number !== "S/N" ? p.number : a.number,
        complement: p.complement || a.complement || "",
        neighborhood: p.neighborhood || a.neighborhood,
        city: p.city || a.city, zip: p.zip || a.zipCode,
        reference_point: a.reference_point || "",
      }
    })
    setAddresses(addrs)
    setTab("form")
  }

  return {
    tab, setTab, searchQuery, setSearchQuery, name, setName, email, setEmail,
    document, setDocument, phone, setPhone, addresses, setAddresses,
    selectedCustomerId, isAddressModalOpen, setIsAddressModalOpen,
    editingAddressIndex, setEditingAddressIndex, handleSelectCustomer,
  }
}

export function DeliveryClientSelectModal({
  isOpen, onClose, initialClient, onSelectClient,
}: DeliveryClientSelectModalProps) {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "default"
  const rawCustomers = useCustomers(tenantId)
  const customers = React.useMemo(() => (Array.isArray(rawCustomers) ? rawCustomers : []), [rawCustomers])
  const d = UI_STRINGS.delivery

  const s = useDeliveryClientSelectState(initialClient, isOpen)

  const filteredCustomers = customers.filter(
    (c: Customer) => c.name.toLowerCase().includes(s.searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(s.searchQuery)) || (c.document && c.document.includes(s.searchQuery))
  )

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!s.name.trim()) return
    const formattedAddress = formatClientSelectAddress(s.addresses)
    const finalCustId = await persistSelectedModalCustomer({
      tenantId, selectedCustomerId: s.selectedCustomerId, name: s.name,
      phone: s.phone, email: s.email, document: s.document, addresses: s.addresses,
    })
    onSelectClient({ name: s.name.trim(), phone: s.phone.trim(), address: formattedAddress, customerId: finalCustId })
    onClose()
  }

  return (
    <>
      <Modal
        isOpen={isOpen} onClose={onClose} title={d.clientSelectModalTitle}
        subtitle={d.clientSelectModalSubtitle} icon={User} successText={d.advanceToOrderButton}
        onSuccess={handleSubmit} showCancelButton={true}
      >
        <Stack gap={2.5} w="full">
          <Stack direction="row" gap={2.5} w="full">
            <Button variant={s.tab === "search" ? "primary" : "secondary"} label={d.searchRegisteredTab} icon={Search} onClick={() => s.setTab("search")} />
            <Button variant={s.tab === "form" ? "primary" : "secondary"} label={d.clientDataTab} icon={Plus} onClick={() => s.setTab("form")} />
          </Stack>
          {s.tab === "search" ? (
            <DeliveryClientSearchTab searchQuery={s.searchQuery} setSearchQuery={s.setSearchQuery} filteredCustomers={filteredCustomers} selectedCustomerId={s.selectedCustomerId} onSelectCustomer={s.handleSelectCustomer} />
          ) : (
            <DeliveryClientFormTab
              name={s.name} setName={s.setName} email={s.email} setEmail={s.setEmail}
              document={s.document} setDocument={s.setDocument} phone={s.phone} setPhone={s.setPhone}
              addresses={s.addresses}
              onOpenNewAddress={() => { s.setEditingAddressIndex(null); s.setIsAddressModalOpen(true) }}
              onEditAddress={(idx) => { s.setEditingAddressIndex(idx); s.setIsAddressModalOpen(true) }}
              onDeleteAddress={(idx) => s.setAddresses((prev) => prev.filter((_, i) => i !== idx))}
            />
          )}
        </Stack>
      </Modal>
      <ClientAddressFormModal
        isOpen={s.isAddressModalOpen} onClose={() => { s.setIsAddressModalOpen(false); s.setEditingAddressIndex(null) }}
        onSave={(addrData) => {
          if (s.editingAddressIndex !== null) {
            s.setAddresses((prev) => prev.map((it, idx) => (idx === s.editingAddressIndex ? addrData : it)))
            s.setEditingAddressIndex(null)
          } else {
            s.setAddresses((prev) => [...prev, addrData])
          }
        }}
        initialData={s.editingAddressIndex !== null ? s.addresses[s.editingAddressIndex] : null}
      />
    </>
  )
}
