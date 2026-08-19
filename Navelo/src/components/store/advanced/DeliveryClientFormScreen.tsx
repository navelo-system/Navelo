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
  const street = parts[0] || address
  const number = parts[1]?.split("-")[0]?.trim() || "S/N"
  const complement = parts[1]?.split("-").slice(1).join(" - ").trim() || ""
  const neighborhood = parts[2]?.split("-")[0]?.trim() || ""
  const city = parts[2]?.split("-").slice(1).join(" - ").trim() || ""

  return { name: "Principal", street, number, complement, neighborhood, city, zip }
}

function resolveInitialCustomer(c: Customer) {
  return {
    name: c.name || "",
    email: c.email || "",
    document: c.document || "",
    phone: c.phone || "",
    selectedCustomerId: c.id,
    addresses: c.addresses || [],
  }
}

function resolveInitialClient(client: DeliveryClientInfo, customersList: Customer[]) {
  const matching = customersList.find(
    (c) =>
      (client.customerId && c.id === client.customerId) ||
      (c.name && c.name.trim().toLowerCase() === client.name.trim().toLowerCase()) ||
      (client.phone && c.phone && c.phone.trim() === client.phone.trim())
  )
  if (matching) return resolveInitialCustomer(matching)

  const parsed = parseAddressString(client.address || "")
  const initialAddresses =
    client.address && client.address !== "Endereço não informado"
      ? [{
          id: `addr-init-${Date.now()}`,
          customerId: client.customerId || "",
          street: parsed.street,
          number: parsed.number,
          complement: parsed.complement,
          neighborhood: parsed.neighborhood,
          city: parsed.city,
          state: "",
          zipCode: parsed.zip,
          isDefault: true,
        }]
      : []

  return {
    name: client.name,
    email: client.email || "",
    document: client.document || "",
    phone: client.phone || "",
    selectedCustomerId: client.customerId,
    addresses: initialAddresses,
  }
}

function resolveInitialClientState(
  initialCustomer?: Customer | null,
  initialClient?: DeliveryClientInfo | null,
  customersList: Customer[] = []
) {
  if (initialCustomer) return resolveInitialCustomer(initialCustomer)
  if (initialClient?.name) return resolveInitialClient(initialClient, customersList)
  return { name: "", email: "", document: "", phone: "", selectedCustomerId: undefined, addresses: [] }
}

function formatCustomerPrimaryAddress(clientAddresses: CustomerAddress[]) {
  if (clientAddresses.length === 0) return "Endereço não informado"
  const a = clientAddresses.find((it) => it.isDefault) || clientAddresses[0]
  if (a.street.includes("(CEP:") || (a.street.includes(" - ") && a.street.includes(","))) return a.street
  const segs: string[] = [a.street]
  if (a.number && a.number !== "S/N" && !a.street.includes(a.number)) segs.push(a.number)
  if (a.complement && !a.street.includes(a.complement)) segs.push(a.complement)
  if (a.neighborhood && !a.street.includes(a.neighborhood)) segs.push(a.neighborhood)
  if (a.city && !a.street.includes(a.city)) segs.push(a.city)
  const base = segs.join(", ")
  return a.zipCode && !a.street.includes(a.zipCode) ? `${base} (CEP: ${a.zipCode})` : base
}

function DeliveryClientSearchResults({
  customers,
  onSelectCustomer,
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
          <Box
            w="full"
            paddingY={2.5}
            paddingX={2.5}
            radius="none"
            hoverBg="primary/10"
            cursor="pointer"
            onClick={() => onSelectCustomer(client)}
          >
            <Stack direction="row" align="center" justify="between" w="full">
              <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
                <Avatar fallback={client.name ? client.name.charAt(0).toUpperCase() : "C"} />
                <Stack gap={0} align="start" flex="1" minW="0">
                  <Font variant="body" text={client.name} />
                  {(client.document || client.phone) && (
                    <Font variant="auxiliary" color="muted" truncate={true} text={client.document || client.phone || ""} />
                  )}
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
  name, setName,
  email, setEmail,
  document, setDocument,
  phone, setPhone,
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

async function persistClientRecord(p: PersistClientParams) {
  if (p.selectedCustomerId && p.tenantId && p.name.trim()) {
    try {
      await dal.customers.update({
        id: p.selectedCustomerId,
        tenant_id: p.tenantId,
        company_id: p.tenantId,
        name: p.name.trim(),
        phone: p.phone.trim(),
        email: p.email.trim() || undefined,
        document: p.document.trim() || "",
        type: p.document.length > 14 ? "PJ" : "PF",
        addresses: p.clientAddresses.map((a, i) => ({ ...a, customerId: p.selectedCustomerId, isDefault: i === 0 })),
      })
      return p.selectedCustomerId
    } catch (err) {
      console.error("Erro ao atualizar cliente:", err)
      return p.selectedCustomerId
    }
  }

  if ((p.saveClient || !p.showSaveSwitch) && !p.selectedCustomerId && p.tenantId && p.name.trim()) {
    const newCustId = `cli-${Date.now()}`
    try {
      await dal.customers.create({
        id: newCustId,
        tenant_id: p.tenantId,
        company_id: p.tenantId,
        name: p.name.trim(),
        phone: p.phone.trim(),
        email: p.email.trim() || undefined,
        document: p.document.trim() || "",
        type: p.document.length > 14 ? "PJ" : "PF",
        addresses: p.clientAddresses.map((a, i) => ({ ...a, customerId: newCustId, isDefault: i === 0 })),
      })
      return newCustId
    } catch (err) {
      console.error("Erro ao salvar cliente:", err)
      return undefined
    }
  }

  return p.selectedCustomerId
}

function useDeliveryClientHeaderSync(
  title: string,
  searchQuery: string,
  setSearchQuery: (v: string) => void,
  showSearchInHeader: boolean,
  showDelete: boolean,
  onBack: () => void,
  onSubmit: () => void,
  onDelete: () => void,
  setCustomBack?: (cb: (() => void) | null) => void,
  setCustomTitle?: (t: string | null) => void,
  setCustomActions?: (a: React.ReactNode | null) => void
) {
  const cust = UI_STRINGS.customers
  const common = UI_STRINGS.common
  const onBackRef = React.useRef(onBack)
  const onSubmitRef = React.useRef(onSubmit)
  const onDeleteRef = React.useRef(onDelete)
  const setCustomBackRef = React.useRef(setCustomBack)
  const setCustomTitleRef = React.useRef(setCustomTitle)
  const setCustomActionsRef = React.useRef(setCustomActions)

  React.useEffect(() => {
    onBackRef.current = onBack
    onSubmitRef.current = onSubmit
    onDeleteRef.current = onDelete
    setCustomBackRef.current = setCustomBack
    setCustomTitleRef.current = setCustomTitle
    setCustomActionsRef.current = setCustomActions
  })

  React.useEffect(() => {
    setCustomTitleRef.current?.(title)
    setCustomBackRef.current?.(() => () => onBackRef.current())

    const actions = (
      <Stack direction="row" align="center" gap={2.5}>
        {showDelete && (
          <Button
            type="button"
            variant="danger-pill-icon-confirm"
            confirmTitle={cust.deleteCustomerConfirmTitle}
            confirmSubtitle={cust.deleteCustomerConfirmSubtitle}
            confirmParagraph={cust.deleteCustomerConfirmParagraph}
            onConfirm={() => onDeleteRef.current()}
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
      ) : (
        actions
      )
    )

    return () => setCustomActionsRef.current?.(null)
  }, [searchQuery, title, showSearchInHeader, showDelete, cust, common])
}

export function DeliveryClientFormScreen({
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
}: DeliveryClientFormScreenProps) {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "default"
  const rawCustomers = useCustomers(tenantId)
  const customers = React.useMemo(() => (Array.isArray(rawCustomers) ? rawCustomers : []), [rawCustomers])

  const initialKey = initialCustomer?.id || initialClient?.customerId || initialClient?.name || initialClient?.phone || ""
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

  const formRef = React.useRef<HTMLFormElement>(null)
  const cust = UI_STRINGS.customers
  const common = UI_STRINGS.common

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
        id: `addr-${Date.now()}`, customerId: selectedCustomerId || "",
        name: addrData.name, street: addrData.street, number: addrData.number, complement: addrData.complement,
        neighborhood: addrData.neighborhood, city: addrData.city, state: "", zipCode: addrData.zip,
        reference_point: addrData.reference_point, isDefault: clientAddresses.length === 0,
      }])
    }
    setIsAddressModalOpen(false)
    setEditingAddress(null)
  }

  const handleSubmit = React.useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (formRef.current && !formRef.current.reportValidity()) return
    if (!name.trim()) return

    const formattedAddress = formatCustomerPrimaryAddress(clientAddresses)
    const finalCustId = await persistClientRecord({
      tenantId, selectedCustomerId, saveClient, showSaveSwitch, name, phone, email, document, clientAddresses
    })

    onSelectClient?.({
      name: name.trim(), phone: phone.trim(), address: formattedAddress,
      customerId: finalCustId, email: email.trim(), document: document.trim(),
    })
  }, [name, phone, email, document, selectedCustomerId, tenantId, clientAddresses, saveClient, showSaveSwitch, onSelectClient])

  const handleDelete = async () => {
    if (selectedCustomerId && tenantId) {
      await dal.customers.delete(selectedCustomerId, tenantId).catch(() => {})
    }
    onBack()
  }

  const showDelete = Boolean(initialCustomer) && !title.toLowerCase().includes("identificar") && !title.toLowerCase().includes("novo")

  useDeliveryClientHeaderSync(
    title, searchQuery, setSearchQuery, showSearchInHeader, showDelete,
    onBack, handleSubmit, handleDelete, setCustomBack, setCustomTitle, setCustomActions
  )

  const filteredCustomers = React.useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return customers.filter((c) => c.name.toLowerCase().includes(q) || (c.phone && c.phone.includes(q)) || (c.document && c.document.includes(q)))
  }, [customers, searchQuery])

  return (
    <Box display="flex" direction="col" flex="1" minH="0" overflow="auto" w="full">
      <Stack gap={5} w="full">
        {searchQuery.trim().length === 0 && (showSaveSwitch || showSkip) && (
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
                <Button
                  type="button"
                  variant="outline-sm"
                  label={common.skip}
                  iconRight={ArrowRight}
                  onClick={() => {
                    const formatted = formatCustomerPrimaryAddress(clientAddresses)
                    onSelectClient?.({
                      name: name.trim() || "Cliente Balcão",
                      phone: phone.trim(),
                      address: formatted !== "Endereço não informado" ? formatted : "Entrega a combinar",
                      customerId: selectedCustomerId,
                    })
                  }}
                />
              </Box>
            )}
          </Stack>
        )}

        {searchQuery.trim().length > 0 ? (
          <Box w="full" position="relative">
            <DeliveryClientSearchResults customers={filteredCustomers} onSelectCustomer={handleSelectCustomer} />
          </Box>
        ) : (
          <Box padding={5} bg="bg-surface" radius="default" border borderColor="border-border" w="full">
            <Box as="form" ref={formRef} onSubmit={handleSubmit} w="full">
              <Stack gap={5} w="full">
                <Font variant="body-bold" text={cust.personalDataTitle} />
                <DeliveryClientPersonalFields name={name} setName={setName} email={email} setEmail={setEmail} document={document} setDocument={setDocument} phone={phone} setPhone={setPhone} />
                <Stack gap={2.5} w="full">
                  <Stack direction="row" align="center" gap={2.5}>
                    <Font variant="body-bold" text={cust.addressTitle} />
                    {clientAddresses.length === 0 && (
                      <Button
                        type="button"
                        variant="primary-icon-xs"
                        icon={Plus}
                        onClick={() => {
                          setEditingAddress(null)
                          setIsAddressModalOpen(true)
                        }}
                        title={cust.addAddressTitle}
                      />
                    )}
                  </Stack>
                  {clientAddresses.length > 0 && (
                    <Box paddingY={2.5} w="full">
                      <AddressList
                        addresses={clientAddresses}
                        onEdit={(addr) => {
                          setEditingAddress(addr)
                          setIsAddressModalOpen(true)
                        }}
                        onDelete={(addr) => setClientAddresses((prev) => prev.filter((a) => a.id !== addr.id))}
                      />
                    </Box>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Box>
        )}
      </Stack>

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
