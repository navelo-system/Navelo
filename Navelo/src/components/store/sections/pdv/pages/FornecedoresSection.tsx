"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Avatar } from "@/components/store/base/Avatar"
import { ViewTransition } from "@/components/store/base/ViewTransition"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { Check, Trash2, Building, Plus } from "lucide-react"
import { useSuppliers, dal, Supplier } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import { UI_STRINGS } from "@/constants/strings"

export interface FornecedoresSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onSelectSupplier?: (supplier: Supplier) => void
}

interface SupplierFormData {
  name: string
  document: string
  stateRegistration: string
  phone: string
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
}

const EMPTY_FORM: SupplierFormData = {
  name: "",
  document: "",
  stateRegistration: "",
  phone: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
}

function getSafeString(val?: string): string {
  return val || ""
}

function mapSupplierToFormData(s?: Supplier | null): SupplierFormData {
  if (!s) return EMPTY_FORM
  return {
    name: getSafeString(s.name || s.trade_name),
    document: getSafeString(s.document),
    stateRegistration: getSafeString(s.state_registration),
    phone: getSafeString(s.phone),
    cep: getSafeString(s.cep),
    street: getSafeString(s.street),
    number: getSafeString(s.number),
    complement: getSafeString(s.complement),
    neighborhood: getSafeString(s.neighborhood),
    city: getSafeString(s.city),
  }
}

function checkSupplierDirty(formData: SupplierFormData, initial: SupplierFormData): boolean {
  for (const k of Object.keys(formData)) {
    if (formData[k as keyof SupplierFormData] !== initial[k as keyof SupplierFormData]) return true
  }
  return false
}

function useSupplierFormState(editingSupplier: Supplier | null) {
  const initialForm = React.useMemo(() => mapSupplierToFormData(editingSupplier), [editingSupplier])
  const [formData, setFormData] = React.useState<SupplierFormData>(initialForm)

  const updateField = (field: keyof SupplierFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCepChange = (value: string) => {
    updateField("cep", value)
    const cleanCep = value.replace(/\D/g, "")
    if (cleanCep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.erro) {
            setFormData((prev) => ({
              ...prev,
              street: data.logradouro || prev.street,
              neighborhood: data.bairro || prev.neighborhood,
              city: data.localidade ? (data.uf ? `${data.localidade} - ${data.uf}` : data.localidade) : prev.city,
            }))
          }
        })
        .catch((err) => console.error("Erro ao buscar CEP:", err))
    }
  }

  const resetForm = (s?: Supplier | null) => {
    setFormData(mapSupplierToFormData(s))
  }

  const isDirty = checkSupplierDirty(formData, initialForm)
  return { formData, updateField, handleCepChange, resetForm, isDirty }
}

function SupplierListItem({
  supplier,
  onClick,
}: {
  supplier: Supplier
  onClick: () => void
}) {
  const initialLetter = supplier.name ? supplier.name.charAt(0).toLowerCase() : "f"
  return (
    <Box w="full" padding={2.5} radius="none" hoverBg="secondary/10" cursor="pointer" onClick={onClick}>
      <Stack direction="row" align="center" justify="between" w="full">
        <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
          <Avatar fallback={initialLetter} />
          <Stack gap={1} align="start" flex="1" minW="0">
            <Font variant="body" text={supplier.name || supplier.trade_name || "Sem nome"} />
            {supplier.document && <Font variant="auxiliary" color="muted" text={supplier.document} />}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

function SupplierAddressFields({
  formData,
  updateField,
  handleCepChange,
}: {
  formData: SupplierFormData
  updateField: (field: keyof SupplierFormData, value: string) => void
  handleCepChange: (value: string) => void
}) {
  const s = UI_STRINGS.settings.fornecedores
  return (
    <Stack gap={5} w="full">
      <Font variant="body-bold" text={s.addressTitle} />
      <Grid cols={2} gap={5}>
        <Input
          mask="cep"
          placeholder={s.cepPlaceholder}
          value={formData.cep}
          onChange={(e) => handleCepChange(e.target.value)}
        />
        <Box />
      </Grid>
      <Input
        placeholder={s.streetPlaceholder}
        value={formData.street}
        onChange={(e) => updateField("street", e.target.value)}
      />
      <Grid cols={2} gap={5}>
        <Input
          placeholder={s.numberPlaceholder}
          value={formData.number}
          onChange={(e) => updateField("number", e.target.value)}
        />
        <Input
          placeholder={s.complementPlaceholder}
          value={formData.complement}
          onChange={(e) => updateField("complement", e.target.value)}
        />
      </Grid>
      <Input
        placeholder={s.neighborhoodPlaceholder}
        value={formData.neighborhood}
        onChange={(e) => updateField("neighborhood", e.target.value)}
      />
      <Input
        placeholder={s.cityPlaceholder}
        value={formData.city}
        onChange={(e) => updateField("city", e.target.value)}
      />
    </Stack>
  )
}

function SupplierFormView({
  formData,
  updateField,
  handleCepChange,
  formRef,
  onSave,
}: {
  formData: SupplierFormData
  updateField: (field: keyof SupplierFormData, value: string) => void
  handleCepChange: (value: string) => void
  formRef: React.RefObject<HTMLFormElement | null>
  onSave: (e: React.FormEvent) => void
}) {
  const s = UI_STRINGS.settings.fornecedores
  return (
    <Box as="form" id="supplier-form" ref={formRef} onSubmit={onSave} w="full">
      <Stack gap={5} w="full">
        <Input
          placeholder={`* ${s.tradeNamePlaceholder}`}
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          required
        />
        <Input
          mask="cpf-cnpj"
          placeholder={`* ${s.documentPlaceholder}`}
          value={formData.document}
          onChange={(e) => updateField("document", e.target.value)}
          required
        />
        <Input
          placeholder={s.stateRegPlaceholder}
          value={formData.stateRegistration}
          onChange={(e) => updateField("stateRegistration", e.target.value)}
        />
        <Input
          mask="phone"
          placeholder={s.phonePlaceholder}
          value={formData.phone}
          onChange={(e) => updateField("phone", e.target.value)}
        />
        <SupplierAddressFields formData={formData} updateField={updateField} handleCepChange={handleCepChange} />
      </Stack>
    </Box>
  )
}

function SupplierHeaderActions({
  editingSupplier,
  onDelete,
}: {
  editingSupplier: Supplier | null
  onDelete: (id: string) => void
}) {
  const s = UI_STRINGS.settings.fornecedores
  return (
    <Stack direction="row" gap={2.5} align="center">
      {editingSupplier && (
        <Button
          type="button"
          variant="danger-pill-icon-confirm"
          icon={Trash2}
          title={s.deleteSupplierTitle}
          confirmModal={{
            title: s.deleteSupplierTitle,
            subtitle: "Confirmar exclusão de fornecedor",
            paragraph: `Tem certeza de que deseja excluir o fornecedor "${editingSupplier.name}"? Esta ação não poderá ser desfeita.`,
            icon: Trash2,
            successText: "Confirmar Exclusão",
          }}
          onConfirm={() => onDelete(editingSupplier.id)}
        />
      )}
      <Button
        type="submit"
        form="supplier-form"
        variant="primary-pill-icon"
        icon={Check}
        title={s.saveSupplierTitle}
      />
    </Stack>
  )
}

interface SupplierSyncProps {
  mode: "list" | "form"
  editingSupplier: Supplier | null
  searchQuery: string
  setSearchQuery: (q: string) => void
  onDelete: (id: string) => void
  handleBack: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function useSupplierHeaderSync({
  mode,
  editingSupplier,
  searchQuery,
  setSearchQuery,
  onDelete,
  handleBack,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}: SupplierSyncProps) {
  const s = UI_STRINGS.settings.fornecedores

  const setCustomBackRef = React.useRef(setCustomBack)
  const setCustomTitleRef = React.useRef(setCustomTitle)
  const setCustomActionsRef = React.useRef(setCustomActions)
  const handleBackRef = React.useRef(handleBack)
  const onDeleteRef = React.useRef(onDelete)
  const setSearchQueryRef = React.useRef(setSearchQuery)

  React.useEffect(() => {
    setCustomBackRef.current = setCustomBack
    setCustomTitleRef.current = setCustomTitle
    setCustomActionsRef.current = setCustomActions
    handleBackRef.current = handleBack
    onDeleteRef.current = onDelete
    setSearchQueryRef.current = setSearchQuery
  })

  React.useEffect(() => {
    setCustomBackRef.current?.(() => () => handleBackRef.current())
    setCustomTitleRef.current?.(mode === "form" ? (editingSupplier ? s.editSupplierTitle : s.newSupplierTitle) : s.title)
    if (mode === "list") {
      setCustomActionsRef.current?.(
        <MobileHeaderSearch
          searchQuery={searchQuery}
          onSearchQueryChange={(q) => setSearchQueryRef.current(q)}
          placeholder={s.searchPlaceholder}
        />
      )
    } else {
      setCustomActionsRef.current?.(
        <SupplierHeaderActions
          editingSupplier={editingSupplier}
          onDelete={(id) => onDeleteRef.current(id)}
        />
      )
    }
  }, [mode, editingSupplier, searchQuery, s])

  React.useEffect(() => {
    return () => {
      setCustomBackRef.current?.(null)
      setCustomTitleRef.current?.(null)
      setCustomActionsRef.current?.(null)
    }
  }, [])
}

function SupplierListView({
  suppliers,
  onAdd,
  onEdit,
}: {
  suppliers: Supplier[]
  onAdd: () => void
  onEdit: (s: Supplier) => void
}) {
  const s = UI_STRINGS.settings.fornecedores
  return (
    <Box position="relative" w="full">
      {suppliers.length > 0 ? (
        <Box display="flex" direction="col" w="full">
          {suppliers.map((supplier, idx) => (
            <Box key={supplier.id}>
              <SupplierListItem supplier={supplier} onClick={() => onEdit(supplier)} />
              {idx < suppliers.length - 1 && (
                <Box h="h-[2px]" w="full" bg="bg-border" />
              )}
            </Box>
          ))}
        </Box>
      ) : (
        <EmptyState
          icon={Building}
          title={s.emptyTitle}
          subtitle={s.emptySubtitle}
        />
      )}
      <Box position="fixed" bottom="24px" right="24px" zIndex="30">
        <Button
          variant="secondary-pill-icon"
          icon={Plus}
          onClick={onAdd}
          title={s.newSupplierButton}
        />
      </Box>
    </Box>
  )
}

function buildSupplierPayload(formData: SupplierFormData, tenantId: string): Omit<Supplier, "id"> {
  return {
    name: formData.name.trim(),
    trade_name: formData.name.trim(),
    document: formData.document.trim(),
    state_registration: formData.stateRegistration.trim(),
    phone: formData.phone.trim(),
    cep: formData.cep.trim(),
    street: formData.street.trim(),
    number: formData.number.trim(),
    complement: formData.complement.trim(),
    neighborhood: formData.neighborhood.trim(),
    city: formData.city.trim(),
    company_id: tenantId,
    tenant_id: tenantId,
  }
}

async function persistSupplier(
  formData: SupplierFormData,
  tenantId: string,
  editingSupplier: Supplier | null
): Promise<Supplier> {
  const payload = buildSupplierPayload(formData, tenantId)
  if (editingSupplier) {
    const updated: Supplier = { ...payload, id: editingSupplier.id }
    await dal.suppliers.update(updated)
    return updated
  }
  const created: Supplier = { ...payload, id: `sup-${Date.now()}` }
  await dal.suppliers.create(created)
  return created
}

function filterSuppliers(suppliers: Supplier[], searchQuery: string): Supplier[] {
  if (!searchQuery.trim()) return suppliers
  const q = searchQuery.toLowerCase()
  return suppliers.filter((item) => (
    (item.name ?? "").toLowerCase().includes(q) ||
    (item.trade_name ?? "").toLowerCase().includes(q) ||
    Boolean(item.document && item.document.includes(q)) ||
    Boolean(item.phone && item.phone.includes(q))
  ))
}

function useSupplierCrud(
  tenantId: string,
  onCancel: () => void,
  suppliers: Supplier[],
  onSelectSupplier?: (supplier: Supplier) => void
) {
  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [editingSupplier, setEditingSupplier] = React.useState<Supplier | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement | null>(null)

  const formState = useSupplierFormState(editingSupplier)
  const isDirtyRef = React.useRef(formState.isDirty)
  React.useEffect(() => { isDirtyRef.current = formState.isDirty }, [formState.isDirty])

  const onCancelRef = React.useRef(onCancel)
  React.useEffect(() => { onCancelRef.current = onCancel }, [onCancel])

  const handleBack = React.useCallback(() => {
    if (mode === "form") {
      if (isDirtyRef.current) setIsDiscardModalOpen(true)
      else { setMode("list"); setEditingSupplier(null) }
    } else onCancelRef.current()
  }, [mode])

  const handleConfirmDiscard = React.useCallback(() => {
    setIsDiscardModalOpen(false)
    setMode("list")
    setEditingSupplier(null)
  }, [])

  const handleCreateNew = () => { setEditingSupplier(null); formState.resetForm(null); setMode("form") }
  const handleEdit = (supplier: Supplier) => { setEditingSupplier(supplier); formState.resetForm(supplier); setMode("form") }
  const handleDelete = React.useCallback(async (id: string) => {
    await dal.suppliers.delete(id, tenantId)
    setMode("list")
    setEditingSupplier(null)
  }, [tenantId])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState.formData.name.trim() || !formState.formData.document.trim()) return
    const saved = await persistSupplier(formState.formData, tenantId, editingSupplier)
    if (!editingSupplier && onSelectSupplier) {
      onSelectSupplier(saved)
    } else {
      setMode("list")
      setEditingSupplier(null)
    }
  }

  const filteredSuppliers = React.useMemo(() => filterSuppliers(suppliers, searchQuery), [suppliers, searchQuery])

  return {
    mode, editingSupplier, searchQuery, setSearchQuery, isDiscardModalOpen,
    setIsDiscardModalOpen, formRef, formState, filteredSuppliers, handleBack,
    handleConfirmDiscard, handleCreateNew, handleEdit, handleDelete, handleSave,
  }
}

export const FornecedoresSection: React.FC<FornecedoresSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
  onSelectSupplier,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "11111111-1111-1111-1111-111111111111"
  const rawSuppliers = useSuppliers(tenantId)
  const suppliers = React.useMemo(() => (Array.isArray(rawSuppliers) ? rawSuppliers : []), [rawSuppliers])

  const crud = useSupplierCrud(tenantId, onCancel, suppliers, onSelectSupplier)

  useSupplierHeaderSync({
    mode: crud.mode,
    editingSupplier: crud.editingSupplier,
    searchQuery: crud.searchQuery,
    setSearchQuery: crud.setSearchQuery,
    onDelete: crud.handleDelete,
    handleBack: crud.handleBack,
    setCustomBack,
    setCustomTitle,
    setCustomActions,
  })

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <ViewTransition viewKey={crud.mode} flex="1" minH="0">
        <Stack gap={5} w="full" h="full">
          {crud.mode === "list" && (
            <SupplierListView
              suppliers={crud.filteredSuppliers}
              onAdd={crud.handleCreateNew}
              onEdit={onSelectSupplier || crud.handleEdit}
            />
          )}

          {crud.mode === "form" && (
            <SupplierFormView
              formData={crud.formState.formData}
              updateField={crud.formState.updateField}
              handleCepChange={crud.formState.handleCepChange}
              formRef={crud.formRef}
              onSave={crud.handleSave}
            />
          )}
        </Stack>
      </ViewTransition>

      <DiscardChangesModal
        isOpen={crud.isDiscardModalOpen}
        onClose={() => crud.setIsDiscardModalOpen(false)}
        onConfirmDiscard={crud.handleConfirmDiscard}
      />
    </Box>
  )
}
