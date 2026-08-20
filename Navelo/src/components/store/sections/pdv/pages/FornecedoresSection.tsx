"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Edit2, Trash2, Building, ShieldCheck, CreditCard, Phone, MapPin } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { ListSectionLayout } from "@/components/store/intermediary/ListSectionLayout"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { UI_STRINGS } from "@/constants/strings"

export interface SupplierItem {
  id: string
  tradeName: string
  companyName: string
  document: string
  stateRegistration: string
  phone: string
  address: {
    cep: string
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
  }
}

export interface FornecedoresSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

interface SupplierFormData {
  tradeName: string
  companyName: string
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
  tradeName: "", companyName: "", document: "", stateRegistration: "", phone: "",
  cep: "", street: "", number: "", complement: "", neighborhood: "", city: "",
}

function mapSupplierToFormData(s?: SupplierItem | null): SupplierFormData {
  if (!s) return EMPTY_FORM
  return {
    tradeName: s.tradeName, companyName: s.companyName, document: s.document,
    stateRegistration: s.stateRegistration, phone: s.phone,
    cep: s.address.cep, street: s.address.street, number: s.address.number,
    complement: s.address.complement, neighborhood: s.address.neighborhood, city: s.address.city,
  }
}

function checkSupplierDirty(formData: SupplierFormData, initial: SupplierFormData): boolean {
  for (const k of Object.keys(formData)) {
    if (formData[k as keyof SupplierFormData] !== initial[k as keyof SupplierFormData]) return true
  }
  return false
}

function useSupplierFormState(editingSupplier: SupplierItem | null) {
  const initialForm = React.useMemo(() => mapSupplierToFormData(editingSupplier), [editingSupplier])
  const [formData, setFormData] = React.useState<SupplierFormData>(initialForm)
  const updateField = (field: keyof SupplierFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  const resetForm = (s?: SupplierItem | null) => {
    setFormData(mapSupplierToFormData(s))
  }
  const isDirty = checkSupplierDirty(formData, initialForm)
  return { formData, updateField, resetForm, isDirty }
}

function SupplierAddressFields({
  formData, updateField,
}: {
  formData: SupplierFormData
  updateField: (field: keyof SupplierFormData, value: string) => void
}) {
  const s = UI_STRINGS.settings.fornecedores
  return (
    <Stack gap={2.5} w="full">
      <Box paddingY={2.5}><Font variant="body-bold" text={s.addressTitle} /></Box>
      <Grid cols={2} gap={5}>
        <Input label={s.cepLabel} placeholder={s.cepPlaceholder} value={formData.cep} onChange={(e) => updateField("cep", e.target.value)} icon={MapPin} />
        <Input label={s.streetLabel} placeholder={s.streetPlaceholder} value={formData.street} onChange={(e) => updateField("street", e.target.value)} icon={MapPin} />
        <Input label={s.numberLabel} placeholder={s.numberPlaceholder} value={formData.number} onChange={(e) => updateField("number", e.target.value)} />
        <Input label={s.complementLabel} placeholder={s.complementPlaceholder} value={formData.complement} onChange={(e) => updateField("complement", e.target.value)} />
        <Input label={s.neighborhoodLabel} placeholder={s.neighborhoodPlaceholder} value={formData.neighborhood} onChange={(e) => updateField("neighborhood", e.target.value)} icon={MapPin} />
        <Input label={s.cityLabel} placeholder={s.cityPlaceholder} value={formData.city} onChange={(e) => updateField("city", e.target.value)} icon={MapPin} />
      </Grid>
    </Stack>
  )
}

function SupplierFormCard({
  formData, updateField, editingSupplier, onCancel, onSave, onDelete,
}: {
  formData: SupplierFormData
  updateField: (field: keyof SupplierFormData, value: string) => void
  editingSupplier: SupplierItem | null
  onCancel: () => void
  onSave: (e: React.FormEvent) => void
  onDelete: (id: string) => void
}) {
  const s = UI_STRINGS.settings.fornecedores
  return (
    <Box as="form" onSubmit={onSave} bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Grid cols={2} gap={5}>
          <Input label={s.tradeNameLabel} placeholder={s.tradeNamePlaceholder} value={formData.tradeName} onChange={(e) => updateField("tradeName", e.target.value)} icon={Building} required />
          <Input label={s.companyNameLabel} placeholder={s.companyNamePlaceholder} value={formData.companyName} onChange={(e) => updateField("companyName", e.target.value)} icon={ShieldCheck} required />
          <Input label={s.documentLabel} placeholder={s.documentPlaceholder} value={formData.document} onChange={(e) => updateField("document", e.target.value)} icon={CreditCard} required />
          <Input label={s.stateRegLabel} placeholder={s.stateRegPlaceholder} value={formData.stateRegistration} onChange={(e) => updateField("stateRegistration", e.target.value)} icon={ShieldCheck} />
          <Input label={s.phoneLabel} placeholder={s.phonePlaceholder} value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} icon={Phone} />
        </Grid>
        <SupplierAddressFields formData={formData} updateField={updateField} />
        <FormActions
          confirmLabel={editingSupplier ? UI_STRINGS.pdv.cart.saveChangesButton : s.saveSupplierTitle}
          onConfirm={() => {}} isSubmit={true} onCancel={onCancel}
          leftAction={editingSupplier ? (
            <Button type="button" variant="outline" label={s.deleteSupplierTitle} icon={Trash2} onClick={() => onDelete(editingSupplier.id)} />
          ) : undefined}
        />
      </Stack>
    </Box>
  )
}

function SupplierListItemView({
  supplier, onEdit, onDelete,
}: {
  supplier: SupplierItem
  onEdit: (s: SupplierItem) => void
  onDelete: (id: string) => void
}) {
  const s = UI_STRINGS.settings.fornecedores
  return (
    <Box padding={5} hoverBg="primary/10" w="full">
      <Stack direction="row" align="center" justify="between" w="full" gap={5}>
        <Stack direction="row" align="center" gap={5} flex="1">
          <Box w="w-10" h="h-10" bg="bg-brand-primary/10" radius="full">
            <Stack w="full" h="full" align="center" justify="center">
              <Font variant="body-bold" color="primary" text={supplier.tradeName.charAt(0).toUpperCase()} />
            </Stack>
          </Box>
          <Stack gap={1}>
            <Font variant="body-bold" text={supplier.tradeName} />
            <Font variant="description" text={supplier.document} color="muted" />
          </Stack>
        </Stack>
        <Stack direction="row" gap={2.5} justify="end">
          <Button variant="primary-icon-xs" icon={Edit2} onClick={() => onEdit(supplier)} />
          <Button variant="danger-icon-xs-confirm" confirmTitle={s.deleteSupplierTitle} confirmSubtitle={s.deleteSupplierTitle} confirmParagraph="Tem certeza que deseja excluir este fornecedor?" onConfirm={() => onDelete(supplier.id)} />
        </Stack>
      </Stack>
    </Box>
  )
}

export const FornecedoresSection: React.FC<FornecedoresSectionProps> = ({
  onCancel, setCustomBack, setCustomTitle, setCustomActions,
}) => {
  const s = UI_STRINGS.settings.fornecedores
  const [suppliers, setSuppliers] = React.useState<SupplierItem[]>([
    { id: "1", tradeName: "teste", companyName: "teste ltda", document: "38.383.365/0001-90", stateRegistration: "", phone: "", address: { cep: "", street: "", number: "", complement: "", neighborhood: "", city: "" } },
  ])
  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [editingSupplier, setEditingSupplier] = React.useState<SupplierItem | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)
  const { formData, updateField, resetForm, isDirty } = useSupplierFormState(editingSupplier)

  const handleBack = React.useCallback(() => {
    if (mode === "form") {
      if (isDirty) {
        setIsDiscardModalOpen(true)
      } else {
        setMode("list")
        setEditingSupplier(null)
      }
    } else {
      onCancel()
    }
  }, [mode, isDirty, onCancel])

  React.useEffect(() => {
    setCustomBack?.(() => handleBack)
    setCustomTitle?.(mode === "form" ? (editingSupplier ? s.editSupplierTitle : s.newSupplierTitle) : s.title)
    if (mode === "list") setCustomActions?.(<MobileHeaderSearch searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} placeholder={s.searchPlaceholder} />)
    else setCustomActions?.(null)
    return () => { setCustomBack?.(null); setCustomTitle?.(null); setCustomActions?.(null) }
  }, [mode, editingSupplier, searchQuery, setCustomBack, setCustomTitle, setCustomActions, handleBack, s])

  const handleCreateNew = () => { setEditingSupplier(null); resetForm(null); setMode("form") }
  const handleEdit = (supplier: SupplierItem) => { setEditingSupplier(supplier); resetForm(supplier); setMode("form") }
  const handleDelete = (id: string) => {
    setSuppliers((prev) => prev.filter((item) => item.id !== id))
    if (mode === "form") { setMode("list"); setEditingSupplier(null) }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.tradeName.trim() || !formData.companyName.trim() || !formData.document.trim()) return
    const supplierData: Omit<SupplierItem, "id"> = {
      tradeName: formData.tradeName, companyName: formData.companyName, document: formData.document,
      stateRegistration: formData.stateRegistration, phone: formData.phone,
      address: { cep: formData.cep, street: formData.street, number: formData.number, complement: formData.complement, neighborhood: formData.neighborhood, city: formData.city },
    }
    if (editingSupplier) setSuppliers((prev) => prev.map((item) => (item.id === editingSupplier.id ? { ...item, ...supplierData } : item)))
    else setSuppliers((prev) => [...prev, { id: Date.now().toString(), ...supplierData }])
    setMode("list"); setEditingSupplier(null)
  }

  return (
    <Box position="relative" w="full">
      {mode === "list" ? (
        <ListSectionLayout<SupplierItem>
          title={s.title} items={suppliers} searchPlaceholder={s.searchPlaceholder}
          searchFilterFn={(item, query) => item.tradeName.toLowerCase().includes(query.toLowerCase()) || item.companyName.toLowerCase().includes(query.toLowerCase()) || item.document.includes(query)}
          emptyIcon={Building} emptyTitle={s.emptyTitle} emptySubtitle={s.emptySubtitle}
          onAdd={handleCreateNew} getItemKey={(item) => item.id}
          setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions}
          renderItem={(supplier) => <SupplierListItemView supplier={supplier} onEdit={handleEdit} onDelete={handleDelete} />}
        />
      ) : (
        <SupplierFormCard formData={formData} updateField={updateField} editingSupplier={editingSupplier} onCancel={handleBack} onSave={handleSave} onDelete={handleDelete} />
      )}
      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          setIsDiscardModalOpen(false)
          setMode("list")
          setEditingSupplier(null)
        }}
      />
    </Box>
  )
}
