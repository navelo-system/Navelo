"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Switch } from "@/components/store/base/Switch"
import { Avatar } from "@/components/store/base/Avatar"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Plus, Trash2, Bike, Check } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { useTenant } from "@/lib/context/TenantContext"
import { useRiders, dal, Rider } from "@/lib/dal"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { UI_STRINGS } from "@/constants/strings"

export interface DeliveryRidersScreenProps {
  onBack: () => void
  onSelectRider?: (rider: Rider) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

interface RiderFormViewProps {
  editingRider: Rider | null
  name: string
  setName: (v: string) => void
  document: string
  setDocument: (v: string) => void
  phone: string
  setPhone: (v: string) => void
  conectaEnabled: boolean
  setConectaEnabled: (v: boolean) => void
  conectaCode: string
  setConectaCode: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onDelete: () => void
}

function RiderFormView({
  editingRider,
  name, setName,
  document, setDocument,
  phone, setPhone,
  conectaEnabled, setConectaEnabled,
  conectaCode, setConectaCode,
  onSubmit, onDelete,
}: RiderFormViewProps) {
  const d = UI_STRINGS.delivery
  const cust = UI_STRINGS.customers

  return (
    <Box display="flex" direction="col" flex="1" minH="0" overflow="auto" w="full" padding={0}>
      <Box as="form" id="rider-form" onSubmit={onSubmit} w="full">
        <Stack gap={5} w="full">
          <Box padding={5} bg="bg-surface" radius="default" border borderColor="border-border" w="full">
            <Stack gap={5} w="full">
              <Font variant="body-bold" text={cust.personalDataTitle} />
              <Stack gap={2.5} w="full">
                <Input placeholder={d.riderNamePlaceholder} value={name} onChange={(e) => setName(e.target.value)} required />
                <Input mask="cpf-cnpj" placeholder={d.riderDocumentPlaceholder} value={document} onChange={(e) => setDocument(e.target.value)} />
                <Input mask="phone" placeholder={cust.phonePlaceholder} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Stack>
            </Stack>
          </Box>

          <Box padding={5} bg="bg-surface" radius="default" border borderColor="border-border" w="full">
            <Stack gap={5} w="full">
              <Stack direction="row" align="center" gap={2.5} w="full">
                <Switch checked={conectaEnabled} onChange={(e) => setConectaEnabled(e.target.checked)} />
                <Font variant="body-sm-medium" text={d.enableConectaToggle} />
              </Stack>
              <Stack gap={2.5} w="full">
                <Stack direction="row" align="center" gap={2.5} w="full">
                  <Box flex="1">
                    <Input placeholder={d.conectaCodePlaceholder} value={conectaCode} onChange={(e) => setConectaCode(e.target.value)} />
                  </Box>
                  <Button
                    variant="secondary-icon"
                    icon={Check}
                    title={d.linkRiderTitle}
                    type="button"
                    onClick={() => {
                      if (conectaCode.trim()) setConectaEnabled(true)
                    }}
                  />
                </Stack>
                <Font variant="auxiliary" color="muted" text={d.conectaCodeHelpText} />
              </Stack>
            </Stack>
          </Box>

          <Box paddingY={2.5} w="full">
            <Stack direction="row" gap={2.5} w="full">
              {editingRider && (
                <Button type="button" variant="danger-pill-icon" icon={Trash2} onClick={onDelete} title={d.deleteRiderTitle} />
              )}
              <Box flex="1">
                <Button variant="primary" label={d.saveRiderButton} type="submit" fullWidth={true} />
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

interface RidersListViewProps {
  filteredRiders: Rider[]
  onSelectRider?: (rider: Rider) => void
  onEdit: (rider: Rider) => void
  onCreateNew: () => void
}

function RidersListView({
  filteredRiders,
  onSelectRider,
  onEdit,
  onCreateNew,
}: RidersListViewProps) {
  const d = UI_STRINGS.delivery
  return (
    <Box display="flex" direction="col" flex="1" minH="0" overflow="auto" w="full" padding={0} position="relative">
      <Stack gap={5} w="full">
        {filteredRiders.length === 0 ? (
          <EmptyState icon={Bike} title={d.emptyRidersTitle} subtitle={d.emptyRidersSubtitle} />
        ) : (
          <Box display="flex" direction="col" w="full">
            {filteredRiders.map((rider, idx) => (
              <Box key={rider.id}>
                <Box
                  w="full"
                  paddingY={2.5}
                  paddingX={2.5}
                  radius="none"
                  hoverBg="primary/10"
                  cursor="pointer"
                  onClick={() => (onSelectRider ? onSelectRider(rider) : onEdit(rider))}
                >
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
                      <Avatar fallback={rider.name ? rider.name.charAt(0).toUpperCase() : "E"} />
                      <Stack gap={0} align="start" flex="1" minW="0">
                        <Font variant="body" text={rider.name} />
                        {(rider.phone || rider.document) && (
                          <Font variant="auxiliary" color="muted" truncate={true} text={rider.phone || rider.document || ""} />
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
                {idx < filteredRiders.length - 1 && (
                  <Box borderBottom={true} borderColor="border-border" w="full" />
                )}
              </Box>
            ))}
          </Box>
        )}
      </Stack>

      <Box position="fixed" bottom="24px" right="24px" zIndex="30">
        <Button variant="secondary-pill-icon" icon={Plus} title={d.newRiderTitle} onClick={onCreateNew} />
      </Box>
    </Box>
  )
}

interface RidersSyncParams {
  mode: "list" | "form"
  editingRider: Rider | null
  searchQuery: string
  setSearchQuery: (v: string) => void
  setMode: (m: "list" | "form") => void
  onBack: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (t: string | null) => void
  setCustomActions?: (a: React.ReactNode | null) => void
}

function useDeliveryRidersSync(params: RidersSyncParams) {
  const { mode, editingRider, searchQuery, setSearchQuery, setMode, onBack, setCustomBack, setCustomTitle, setCustomActions } = params
  const d = UI_STRINGS.delivery
  const onBackRef = React.useRef(onBack)
  const setCustomBackRef = React.useRef(setCustomBack)
  const setCustomTitleRef = React.useRef(setCustomTitle)
  const setCustomActionsRef = React.useRef(setCustomActions)

  React.useEffect(() => {
    onBackRef.current = onBack
    setCustomBackRef.current = setCustomBack
    setCustomTitleRef.current = setCustomTitle
    setCustomActionsRef.current = setCustomActions
  })

  React.useEffect(() => {
    return () => {
      setCustomBackRef.current?.(null)
      setCustomTitleRef.current?.(null)
      setCustomActionsRef.current?.(null)
    }
  }, [])

  React.useEffect(() => {
    if (mode === "form") {
      setCustomBackRef.current?.(() => () => setMode("list"))
      setCustomTitleRef.current?.(editingRider ? d.editRiderTitle : d.newRiderTitle)
      setCustomActionsRef.current?.(null)
    } else {
      setCustomBackRef.current?.(() => () => onBackRef.current?.())
      setCustomTitleRef.current?.(d.ridersTitle)
      setCustomActionsRef.current?.(
        <MobileHeaderSearch searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} placeholder={d.searchRiderPlaceholder}>
          <Box />
        </MobileHeaderSearch>
      )
    }
  }, [mode, searchQuery, editingRider, d, setMode, setSearchQuery])
}

function checkRiderDirty(
  editingRider: Rider | null,
  curr: { name: string; document: string; phone: string; conectaCode: string }
): boolean {
  if (editingRider) {
    if (curr.name !== (editingRider.name || "")) return true
    if (curr.document !== (editingRider.document || "")) return true
    if (curr.phone !== (editingRider.phone || "")) return true
    return curr.conectaCode !== (editingRider.conecta_code || "")
  }
  const hasContent = [curr.name, curr.document, curr.phone, curr.conectaCode].some((v) => v.trim() !== "")
  return hasContent
}

function useDeliveryRiderForm(tenantId: string, onSelectRider?: (r: Rider) => void) {
  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [editingRider, setEditingRider] = React.useState<Rider | null>(null)
  const [name, setName] = React.useState("")
  const [document, setDocument] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [conectaEnabled, setConectaEnabled] = React.useState(false)
  const [conectaCode, setConectaCode] = React.useState("")

  const handleEdit = (rider: Rider) => {
    setEditingRider(rider)
    setName(rider.name || "")
    setDocument(rider.document || "")
    setPhone(rider.phone || "")
    setConectaEnabled(!!rider.conecta_enabled)
    setConectaCode(rider.conecta_code || "")
    setMode("form")
  }

  const handleCreateNew = () => {
    setEditingRider(null)
    setName("")
    setDocument("")
    setPhone("")
    setConectaEnabled(false)
    setConectaCode("")
    setMode("form")
  }

  const handleDelete = async () => {
    if (editingRider) {
      await dal.riders.delete(editingRider.id, tenantId)
      setMode("list")
      setEditingRider(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const riderId = editingRider ? editingRider.id : `rider-${Date.now()}`
    const payload: Rider = {
      id: riderId, company_id: tenantId, tenant_id: tenantId,
      name: name.trim(), document: document.trim(), phone: phone.trim(),
      conecta_enabled: conectaEnabled, conecta_code: conectaCode.trim(), active: true,
    }
    try {
      if (editingRider) await dal.riders.update(payload)
      else await dal.riders.create(payload)
      if (onSelectRider) onSelectRider(payload)
      setMode("list")
    } catch (err) {
      console.error("Erro ao salvar entregador:", err)
    }
  }

  const isDirty = checkRiderDirty(editingRider, { name, document, phone, conectaCode })

  return {
    mode, setMode, editingRider, setEditingRider, name, setName, document, setDocument,
    phone, setPhone, conectaEnabled, setConectaEnabled, conectaCode, setConectaCode,
    handleEdit, handleCreateNew, handleDelete, handleSubmit, isDirty,
  }
}

export function DeliveryRidersScreen({
  onBack,
  onSelectRider,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}: DeliveryRidersScreenProps) {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "default"
  const dbRiders = useRiders(tenantId)
  const ridersList = React.useMemo(() => (Array.isArray(dbRiders) ? dbRiders : []), [dbRiders])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  const form = useDeliveryRiderForm(tenantId, onSelectRider)

  const handleRequestBack = React.useCallback(() => {
    if (form.mode === "form") {
      if (form.isDirty) {
        setIsDiscardModalOpen(true)
      } else {
        form.setMode("list")
        form.setEditingRider(null)
      }
    } else {
      onBack()
    }
  }, [form, onBack])

  useDeliveryRidersSync({
    mode: form.mode, editingRider: form.editingRider, searchQuery, setSearchQuery,
    setMode: form.setMode, onBack: handleRequestBack, setCustomBack, setCustomTitle, setCustomActions,
  })

  const filteredRiders = React.useMemo(() => {
    if (!searchQuery.trim()) return ridersList
    const q = searchQuery.toLowerCase()
    return ridersList.filter((r) => r.name.toLowerCase().includes(q))
  }, [ridersList, searchQuery])

  if (form.mode === "form") {
    return (
      <Box display="flex" direction="col" flex="1" minH="0" overflow="auto" w="full" padding={0}>
        <RiderFormView
          editingRider={form.editingRider}
          name={form.name} setName={form.setName}
          document={form.document} setDocument={form.setDocument}
          phone={form.phone} setPhone={form.setPhone}
          conectaEnabled={form.conectaEnabled} setConectaEnabled={form.setConectaEnabled}
          conectaCode={form.conectaCode} setConectaCode={form.setConectaCode}
          onSubmit={form.handleSubmit} onDelete={form.handleDelete}
        />
        <DiscardChangesModal
          isOpen={isDiscardModalOpen}
          onClose={() => setIsDiscardModalOpen(false)}
          onConfirmDiscard={() => {
            setIsDiscardModalOpen(false)
            form.setMode("list")
            form.setEditingRider(null)
          }}
        />
      </Box>
    )
  }

  return (
    <RidersListView
      filteredRiders={filteredRiders}
      onSelectRider={onSelectRider}
      onEdit={form.handleEdit}
      onCreateNew={form.handleCreateNew}
    />
  )
}
