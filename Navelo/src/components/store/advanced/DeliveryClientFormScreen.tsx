"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Switch } from "@/components/store/base/Switch"
import { Avatar } from "@/components/store/base/Avatar"
import { AddressList } from "@/components/store/advanced/AddressList"
import { ClientAddressFormModal, AddressFormData } from "@/components/store/advanced/ClientAddressFormModal"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Plus, Check, UserX, ArrowRight } from "lucide-react"
import { useCustomers, dal, Customer, CustomerAddress } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import { DeliveryClientInfo } from "./DeliveryCheckoutConfirmation"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { UI_STRINGS } from "@/constants/strings"

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

function extractCepFromString(raw: string): { cleanStr: string; zip: string } {
  const match = raw.match(/\(CEP:\s*([\d\-]+)\)/i)
  if (!match) return { cleanStr: raw, zip: "" }
  return { cleanStr: raw.replace(/\(CEP:\s*[\d\-]+\)/i, "").trim(), zip: match[1] }
}

export function parseAddressString(address: string) {
  if (!address || address === "Endereço não informado") {
    return { name: "Principal", street: "", number: "", complement: "", neighborhood: "", city: "", zip: "" }
  }

  const { cleanStr, zip } = extractCepFromString(address)
  const parts = cleanStr.split(",").map((p) => p.trim()).filter(Boolean)
  const numPart = parts[1] || ""
  const neighPart = parts[2] || ""

  return {
    name: "Principal",
    street: parts[0] || address,
    number: numPart.split("-")[0]?.trim() || "S/N",
    complement: numPart.split("-").slice(1).join(" - ").trim(),
    neighborhood: neighPart.split("-")[0]?.trim() || "",
    city: neighPart.split("-").slice(1).join(" - ").trim(),
    zip,
  }
}

function resolveInitialCustomer(c: Customer) {
  return {
    name: c.name || "", email: c.email || "", document: c.document || "",
    phone: c.phone || "", selectedCustomerId: c.id, addresses: c.addresses || [],
  }
}

function resolveInitialClient(client: DeliveryClientInfo, customersList: Customer[]) {
  const matching = customersList.find(
    (c) => (client.customerId && c.id === client.customerId) ||
      (c.name && c.name.trim().toLowerCase() === client.name.trim().toLowerCase()) ||
      (client.phone && c.phone && c.phone.trim() === client.phone.trim())
  )
  if (matching) return resolveInitialCustomer(matching)

  const parsed = parseAddressString(client.address || "")
  const initialAddresses: CustomerAddress[] = (client.address && client.address !== "Endereço não informado")
    ? [{
        id: `addr-init-${Date.now()}`, customerId: client.customerId || "",
        street: parsed.street, number: parsed.number, complement: parsed.complement,
        neighborhood: parsed.neighborhood, city: parsed.city, state: "", zipCode: parsed.zip, isDefault: true,
      }]
    : []

  return {
    name: client.name, email: client.email || "", document: client.document || "",
    phone: client.phone || "", selectedCustomerId: client.customerId, addresses: initialAddresses,
  }
}

function resolveInitialClientState(
  initialCustomer?: Customer | null,
  initialClient?: DeliveryClientInfo | null,
  customersList: Customer[] = []
) {
  if (initialCustomer) return resolveInitialCustomer(initialCustomer)
  if (initialClient?.name) return resolveInitialClient(initialClient, customersList)
  return { name: "", email: "", document: "", phone: "", selectedCustomerId: undefined, addresses: [] as CustomerAddress[] }
}

function formatCustomerPrimaryAddress(clientAddresses: CustomerAddress[]): string {
  if (clientAddresses.length === 0) return "Endereço não informado"
  const a = clientAddresses.find((it) => it.isDefault) || clientAddresses[0]
  if (a.street.includes("(CEP:") || (a.street.includes(" - ") && a.street.includes(","))) return a.street
  const segs = [a.street, a.number !== "S/N" ? a.number : "", a.complement, a.neighborhood, a.city].filter(Boolean)
  const base = segs.join(", ")
  return a.zipCode && !a.street.includes(a.zipCode) ? `${base} (CEP: ${a.zipCode})` : base
}

function DeliveryClientSearchResults({
  customers, onSelectCustomer,
}: {
  customers: Customer[]
  onSelectCustomer: (c: Customer) => void
}) {
  const cust = UI_STRINGS.customers
  if (customers.length === 0) {
    return <EmptyState icon={UserX} title={cust.noCustomerFoundTitle} subtitle={cust.noCustomerFoundSubtitle} />
  }

  return (
    <Box display="flex" direction="col" w="full">
      {customers.map((client, idx) => (
        <Box key={client.id}>
          <Box w="full" paddingY={2.5} paddingX={2.5} radius="none" hoverBg="primary/10" cursor="pointer" onClick={() => onSelectCustomer(client)}>
            <Stack direction="row" align="center" justify="between" w="full">
              <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
                <Avatar fallback={client.name ? client.name.charAt(0).toUpperCase() : "C"} />
                <Stack gap={0} align="start" flex="1" minW="0">
                  <Font variant="body" text={client.name} />
                  {(client.document || client.phone) && <Font variant="auxiliary" color="muted" truncate={true} text={client.document || client.phone || ""} />}
                </Stack>
              </Stack>
            </Stack>
          </Box>
          {idx < customers.length - 1 && <Box borderBottom={true} borderColor="border-border" w="full" />}
        </Box>
      ))}
    </Box>
  )
}

function DeliveryClientPersonalFields({
  name, setName, email, setEmail, document, setDocument, phone, setPhone,
}: {
  name: string; setName: (v: string) => void
  email: string; setEmail: (v: string) => void
  document: string; setDocument: (v: string) => void
  phone: string; setPhone: (v: string) => void
}) {
  const cust = UI_STRINGS.customers
  return (
    <Stack gap={2.5} w="full">
      <Input placeholder={cust.nameRequiredPlaceholder} value={name} onChange={(e) => setName(e.target.value)} required />
      <Input placeholder={cust.emailPlaceholder} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input mask="cpf" placeholder={cust.cpfPlaceholder} value={document} onChange={(e) => setDocument(e.target.value)} />
      <Input mask="phone" placeholder={cust.phonePlaceholder} value={phone} onChange={(e) => setPhone(e.target.value)} />
    </Stack>
  )
}

interface PersistClientParams {
  tenantId: string
  selectedCustomerId: string | undefined
  saveClient: boolean
  showSaveSwitch: boolean
  name: string
  phone: string
  email: string
  document: string
  clientAddresses: CustomerAddress[]
}

async function updateExistingCustomer(id: string, payload: Omit<Customer, "id">, addresses: CustomerAddress[]) {
  try {
    await dal.customers.update({
      ...payload, id, addresses: addresses.map((a, i) => ({ ...a, customerId: id, isDefault: i === 0 })),
    })
    return id
  } catch {
    return id
  }
}

async function createNewCustomer(payload: Omit<Customer, "id">, addresses: CustomerAddress[]) {
  const newCustId = `cli-${Date.now()}`
  try {
    await dal.customers.create({
      ...payload, id: newCustId, addresses: addresses.map((a, i) => ({ ...a, customerId: newCustId, isDefault: i === 0 })),
    })
    return newCustId
  } catch {
    return undefined
  }
}

async function persistClientRecord(p: PersistClientParams): Promise<string | undefined> {
  const trimmedName = p.name.trim()
  if (!trimmedName || !p.tenantId) return p.selectedCustomerId
  const payload: Omit<Customer, "id"> = {
    tenant_id: p.tenantId, company_id: p.tenantId, name: trimmedName,
    phone: p.phone.trim(), email: p.email.trim() || undefined, document: p.document.trim() || "",
    type: (p.document.length > 14 ? "PJ" : "PF") as "PJ" | "PF",
  }

  if (p.selectedCustomerId) {
    return updateExistingCustomer(p.selectedCustomerId, payload, p.clientAddresses)
  }

  if (p.saveClient || !p.showSaveSwitch) {
    return createNewCustomer(payload, p.clientAddresses)
  }

  return undefined
}

interface HeaderSyncOptions {
  title: string
  searchQuery: string
  setSearchQuery: (v: string) => void
  showSearchInHeader: boolean
  showDelete: boolean
  onBack: () => void
  onSubmit: () => void
  onDelete: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (t: string | null) => void
  setCustomActions?: (a: React.ReactNode | null) => void
}

function useDeliveryClientHeaderSync(opts: HeaderSyncOptions) {
  const { title, searchQuery, setSearchQuery, showSearchInHeader, showDelete, onBack, onSubmit, onDelete, setCustomBack, setCustomTitle, setCustomActions } = opts
  const cust = UI_STRINGS.customers
  const common = UI_STRINGS.common

  const onBackRef = React.useRef(onBack)
  const onSubmitRef = React.useRef(onSubmit)
  const onDeleteRef = React.useRef(onDelete)
  const setCustomBackRef = React.useRef(setCustomBack)
  const setCustomTitleRef = React.useRef(setCustomTitle)
  const setCustomActionsRef = React.useRef(setCustomActions)

  React.useEffect(() => {
    onBackRef.current = onBack; onSubmitRef.current = onSubmit; onDeleteRef.current = onDelete
    setCustomBackRef.current = setCustomBack; setCustomTitleRef.current = setCustomTitle; setCustomActionsRef.current = setCustomActions
  })

  React.useEffect(() => {
    setCustomTitleRef.current?.(title)
    setCustomBackRef.current?.(() => () => onBackRef.current())

    const actions = (
      <Stack direction="row" align="center" gap={2.5}>
        {showDelete && (
          <Button
            type="button" variant="danger-pill-icon-confirm"
            confirmTitle={cust.deleteCustomerConfirmTitle} confirmSubtitle={cust.deleteCustomerConfirmSubtitle}
            confirmParagraph={cust.deleteCustomerConfirmParagraph} onConfirm={() => onDeleteRef.current()}
            title={cust.deleteCustomerButtonTitle}
          />
        )}
        <Button type="button" variant="primary-pill-icon" icon={Check} onClick={() => onSubmitRef.current()} title={common.confirm} />
      </Stack>
    )

    setCustomActionsRef.current?.(
      showSearchInHeader ? (
        <MobileHeaderSearch searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} placeholder={cust.searchRegisteredCustomerPlaceholder}>
          {actions}
        </MobileHeaderSearch>
      ) : actions
    )

    return () => setCustomActionsRef.current?.(null)
  }, [searchQuery, title, showSearchInHeader, showDelete, cust, common, setSearchQuery])
}

function getInitialClientKey(
  cust: Customer | null | undefined,
  client: DeliveryClientInfo | null | undefined
): string {
  if (cust?.id) return cust.id
  if (client?.customerId) return client.customerId
  if (client?.name) return client.name
  return client?.phone || ""
}

function checkClientFormDirty(
  curr: { name: string; email: string; document: string; phone: string; addrsLen: number },
  init: { name: string; email: string; document: string; phone: string; addrsLen: number }
): boolean {
  if (curr.name !== init.name || curr.email !== init.email) return true
  if (curr.document !== init.document || curr.phone !== init.phone) return true
  return curr.addrsLen !== init.addrsLen
}

function useDeliveryClientFormState(
  initialCustomer: Customer | null | undefined,
  initialClient: DeliveryClientInfo | null | undefined,
  customers: Customer[]
) {
  const initialKey = getInitialClientKey(initialCustomer, initialClient)
  const init = resolveInitialClientState(initialCustomer, initialClient, customers)

  const [searchQuery, setSearchQuery] = React.useState("")
  const [saveClient, setSaveClient] = React.useState(true)
  const [name, setName] = React.useState(init.name)
  const [email, setEmail] = React.useState(init.email)
  const [document, setDocument] = React.useState(init.document)
  const [phone, setPhone] = React.useState(init.phone)
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | undefined>(init.selectedCustomerId)
  const [clientAddresses, setClientAddresses] = React.useState<CustomerAddress[]>(init.addresses)
  const [isAddressModalOpen, setIsAddressModalOpen] = React.useState(false)
  const [editingAddress, setEditingAddress] = React.useState<CustomerAddress | null>(null)
  const [prevKey, setPrevKey] = React.useState(initialKey)

  if (initialKey !== prevKey) {
    setPrevKey(initialKey)
    const next = resolveInitialClientState(initialCustomer, initialClient, customers)
    setName(next.name); setEmail(next.email); setDocument(next.document); setPhone(next.phone)
    setSelectedCustomerId(next.selectedCustomerId); setClientAddresses(next.addresses)
  }

  const handleSelectCustomer = (c: Customer) => {
    setSelectedCustomerId(c.id); setName(c.name); setPhone(c.phone || "")
    setEmail(c.email || ""); setDocument(c.document || ""); setClientAddresses(c.addresses || [])
    setSearchQuery("")
  }

  const handleSaveAddress = (addrData: AddressFormData) => {
    if (editingAddress) {
      setClientAddresses((prev) => prev.map((a) => (a.id === editingAddress.id ? { ...a, ...addrData, zipCode: addrData.zip } : a)))
    } else {
      setClientAddresses((prev) => [...prev, {
        id: `addr-${Date.now()}`, customerId: selectedCustomerId || "", name: addrData.name, street: addrData.street,
        number: addrData.number, complement: addrData.complement, neighborhood: addrData.neighborhood, city: addrData.city,
        state: "", zipCode: addrData.zip, reference_point: addrData.reference_point, isDefault: clientAddresses.length === 0,
      }])
    }
    setIsAddressModalOpen(false); setEditingAddress(null)
  }

  const isDirty = checkClientFormDirty(
    { name, email, document, phone, addrsLen: clientAddresses.length },
    { name: init.name, email: init.email, document: init.document, phone: init.phone, addrsLen: init.addresses.length }
  )

  return {
    searchQuery, setSearchQuery, saveClient, setSaveClient, name, setName,
    email, setEmail, document, setDocument, phone, setPhone,
    selectedCustomerId, clientAddresses, setClientAddresses,
    isAddressModalOpen, setIsAddressModalOpen, editingAddress, setEditingAddress,
    handleSelectCustomer, handleSaveAddress, isDirty,
  }
}

function DeliveryClientAddressBlock({
  clientAddresses, setClientAddresses, onOpenNewAddress, onEditAddress,
}: {
  clientAddresses: CustomerAddress[]
  setClientAddresses: React.Dispatch<React.SetStateAction<CustomerAddress[]>>
  onOpenNewAddress: () => void
  onEditAddress: (a: CustomerAddress) => void
}) {
  const cust = UI_STRINGS.customers
  return (
    <Stack gap={2.5} w="full">
      <Stack direction="row" align="center" gap={2.5}>
        <Font variant="body-bold" text={cust.addressTitle} />
        {clientAddresses.length === 0 && (
          <Button type="button" variant="primary-icon-xs" icon={Plus} onClick={onOpenNewAddress} title={cust.addAddressTitle} />
        )}
      </Stack>
      {clientAddresses.length > 0 && (
        <Box paddingY={2.5} w="full">
          <AddressList
            addresses={clientAddresses} onEdit={onEditAddress}
            onDelete={(addr) => setClientAddresses((prev) => prev.filter((a) => a.id !== addr.id))}
          />
        </Box>
      )}
    </Stack>
  )
}

function DeliveryClientTopBar({
  showSaveSwitch, showSkip, saveClient, setSaveClient, onSkip,
}: {
  showSaveSwitch: boolean; showSkip: boolean; saveClient: boolean
  setSaveClient: React.Dispatch<React.SetStateAction<boolean>>; onSkip: () => void
}) {
  const cust = UI_STRINGS.customers
  const common = UI_STRINGS.common
  return (
    <Stack direction="row" justify="between" align="center" w="full">
      {showSaveSwitch ? (
        <Stack direction="row" align="center" gap={2.5}>
          <Switch id="save-client-switch" checked={saveClient} onChange={(e) => setSaveClient(e.target.checked)} />
          <Box cursor="pointer" onClick={() => setSaveClient((prev) => !prev)}>
            <Font variant="body-sm-semibold" text={cust.saveClientInList} />
          </Box>
        </Stack>
      ) : <Box />}
      {showSkip && (
        <Box w="auto" shrink="0">
          <Button type="button" variant="outline-sm" label={common.skip} iconRight={ArrowRight} onClick={onSkip} />
        </Box>
      )}
    </Stack>
  )
}

function DeliveryClientFormCard({
  formRef, onSubmit, name, setName, email, setEmail, document, setDocument,
  phone, setPhone, clientAddresses, setClientAddresses, onOpenNewAddress, onEditAddress,
}: {
  formRef: React.RefObject<HTMLFormElement | null>
  onSubmit: (e?: React.FormEvent) => void
  name: string; setName: (v: string) => void
  email: string; setEmail: (v: string) => void
  document: string; setDocument: (v: string) => void
  phone: string; setPhone: (v: string) => void
  clientAddresses: CustomerAddress[]
  setClientAddresses: React.Dispatch<React.SetStateAction<CustomerAddress[]>>
  onOpenNewAddress: () => void
  onEditAddress: (a: CustomerAddress) => void
}) {
  return (
    <Box padding={5} bg="bg-surface" radius="default" border borderColor="border-border" w="full">
      <Box as="form" ref={formRef} onSubmit={onSubmit} w="full">
        <Stack gap={5} w="full">
          <Font variant="body-bold" text={UI_STRINGS.customers.personalDataTitle} />
          <DeliveryClientPersonalFields name={name} setName={setName} email={email} setEmail={setEmail} document={document} setDocument={setDocument} phone={phone} setPhone={setPhone} />
          <DeliveryClientAddressBlock clientAddresses={clientAddresses} setClientAddresses={setClientAddresses} onOpenNewAddress={onOpenNewAddress} onEditAddress={onEditAddress} />
        </Stack>
      </Box>
    </Box>
  )
}

function DeliveryClientAddressModalWrapper({
  isOpen, onClose, onSave, editingAddress,
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (a: AddressFormData) => void
  editingAddress: CustomerAddress | null
}) {
  return (
    <ClientAddressFormModal
      isOpen={isOpen} onClose={onClose} onSave={onSave}
      initialData={editingAddress ? {
        id: editingAddress.id, name: editingAddress.name || "Principal", street: editingAddress.street,
        number: editingAddress.number, complement: editingAddress.complement, neighborhood: editingAddress.neighborhood,
        city: editingAddress.city, zip: editingAddress.zipCode,
      } : null}
    />
  )
}

function isDeleteButtonVisible(initialCustomer?: Customer | null, title?: string): boolean {
  if (!initialCustomer) return false
  const t = (title || "").toLowerCase()
  return !t.includes("identificar") && !t.includes("novo")
}

function filterCustomerList(customers: Customer[], searchQuery: string): Customer[] {
  if (!searchQuery.trim()) return []
  const q = searchQuery.toLowerCase()
  return customers.filter((c) => c.name.toLowerCase().includes(q) || (c.phone && c.phone.includes(q)) || (c.document && c.document.includes(q)))
}

function DeliveryClientFormContent({
  s, showSaveSwitch, showSkip, filteredCustomers, formRef, handleSubmit, onSelectClient,
}: {
  s: ReturnType<typeof useDeliveryClientFormState>
  showSaveSwitch: boolean
  showSkip: boolean
  filteredCustomers: Customer[]
  formRef: React.RefObject<HTMLFormElement | null>
  handleSubmit: (e?: React.FormEvent) => Promise<void>
  onSelectClient?: (c: DeliveryClientInfo) => void
}) {
  return (
    <Stack gap={5} w="full">
      {!s.searchQuery && (showSaveSwitch || showSkip) && (
        <DeliveryClientTopBar
          showSaveSwitch={showSaveSwitch} showSkip={showSkip} saveClient={s.saveClient} setSaveClient={s.setSaveClient}
          onSkip={() => {
            const f = formatCustomerPrimaryAddress(s.clientAddresses)
            onSelectClient?.({
              name: s.name.trim() || "Cliente Balcão", phone: s.phone.trim(),
              address: f !== "Endereço não informado" ? f : "Entrega a combinar", customerId: s.selectedCustomerId,
            })
          }}
        />
      )}
      {s.searchQuery ? (
        <Box w="full" position="relative"><DeliveryClientSearchResults customers={filteredCustomers} onSelectCustomer={s.handleSelectCustomer} /></Box>
      ) : (
        <DeliveryClientFormCard
          formRef={formRef} onSubmit={handleSubmit} name={s.name} setName={s.setName} email={s.email} setEmail={s.setEmail}
          document={s.document} setDocument={s.setDocument} phone={s.phone} setPhone={s.setPhone}
          clientAddresses={s.clientAddresses} setClientAddresses={s.setClientAddresses}
          onOpenNewAddress={() => { s.setEditingAddress(null); s.setIsAddressModalOpen(true) }}
          onEditAddress={(addr) => { s.setEditingAddress(addr); s.setIsAddressModalOpen(true) }}
        />
      )}
    </Stack>
  )
}

export function DeliveryClientFormScreen(props: DeliveryClientFormScreenProps) {
  const showSaveSwitch = props.showSaveSwitch === true
  const showSkip = props.showSkip === true
  const showSearchInHeader = props.showSearchInHeader !== false
  const title = props.title || "Identificar Cliente"

  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "default"
  const rawCustomers = useCustomers(tenantId)
  const customers = React.useMemo(() => (Array.isArray(rawCustomers) ? rawCustomers : []), [rawCustomers])
  const s = useDeliveryClientFormState(props.initialCustomer, props.initialClient, customers)
  const formRef = React.useRef<HTMLFormElement>(null)

  const handleSubmit = React.useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (formRef.current && !formRef.current.reportValidity()) return
    if (!s.name.trim()) return

    const formattedAddress = formatCustomerPrimaryAddress(s.clientAddresses)
    const finalCustId = await persistClientRecord({
      tenantId, selectedCustomerId: s.selectedCustomerId, saveClient: s.saveClient,
      showSaveSwitch, name: s.name, phone: s.phone, email: s.email, document: s.document, clientAddresses: s.clientAddresses,
    })

    if (props.onSelectClient) {
      props.onSelectClient({
        name: s.name.trim(), phone: s.phone.trim(), address: formattedAddress,
        customerId: finalCustId, email: s.email.trim(), document: s.document.trim(),
      })
    } else {
      props.onBack()
    }
  }, [s.name, s.phone, s.email, s.document, s.selectedCustomerId, tenantId, s.clientAddresses, s.saveClient, showSaveSwitch, props])

  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  const handleDelete = React.useCallback(async () => {
    if (s.selectedCustomerId && tenantId) await dal.customers.delete(s.selectedCustomerId, tenantId).catch(() => {})
    props.onBack()
  }, [s.selectedCustomerId, tenantId, props])

  const handleRequestBack = React.useCallback(() => {
    if (s.isDirty) {
      setIsDiscardModalOpen(true)
    } else {
      props.onBack()
    }
  }, [s.isDirty, props])

  useDeliveryClientHeaderSync({
    title, searchQuery: s.searchQuery, setSearchQuery: s.setSearchQuery, showSearchInHeader,
    showDelete: isDeleteButtonVisible(props.initialCustomer, props.title), onBack: handleRequestBack,
    onSubmit: handleSubmit, onDelete: handleDelete, setCustomBack: props.setCustomBack,
    setCustomTitle: props.setCustomTitle, setCustomActions: props.setCustomActions,
  })

  const filteredCustomers = React.useMemo(() => filterCustomerList(customers, s.searchQuery), [customers, s.searchQuery])

  return (
    <Box display="flex" direction="col" flex="1" minH="0" overflow="auto" w="full">
      <DeliveryClientFormContent
        s={s} showSaveSwitch={showSaveSwitch} showSkip={showSkip} filteredCustomers={filteredCustomers}
        formRef={formRef} handleSubmit={handleSubmit} onSelectClient={props.onSelectClient}
      />
      <DeliveryClientAddressModalWrapper isOpen={s.isAddressModalOpen} onClose={() => { s.setIsAddressModalOpen(false); s.setEditingAddress(null) }} onSave={s.handleSaveAddress} editingAddress={s.editingAddress} />
      <DiscardChangesModal isOpen={isDiscardModalOpen} onClose={() => setIsDiscardModalOpen(false)} onConfirmDiscard={() => { setIsDiscardModalOpen(false); props.onBack() }} />
    </Box>
  )
}
