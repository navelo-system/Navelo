"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Trash2, Binary, Clipboard, Check, Scale } from "lucide-react"
import { ListSectionLayout } from "@/components/store/intermediary/ListSectionLayout"
import { ViewTransition } from "@/components/store/base/ViewTransition"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { useUnits, dal } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import { UI_STRINGS } from "@/constants/strings"

export interface UnitItem {
  id: string
  name: string
  decimals: number
}

export interface UnidadesSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function getDecimalText(decimals: number) {
  const s = UI_STRINGS.settings.unidades
  if (decimals === 0) return s.zeroDecimals
  if (decimals === 1) return s.oneDecimal
  if (decimals === 2) return s.twoDecimals
  return s.threeDecimals
}

function UnitFormCard({
  formName,
  setFormName,
  formDecimals,
  setFormDecimals,
  onSubmit,
}: {
  formName: string
  setFormName: (v: string) => void
  formDecimals: string
  setFormDecimals: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  const s = UI_STRINGS.settings.unidades
  return (
    <Box as="form" id="unit-form" onSubmit={onSubmit} bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Input label={s.nameLabel} placeholder={s.namePlaceholder} value={formName} onChange={(e) => setFormName(e.target.value)} icon={Clipboard} required />
        <Stack gap={1} w="full">
          <Font variant="sub-tiny-bold" text={s.decimalsLabel} />
          <CustomSelect value={formDecimals} onChange={setFormDecimals}>
            <CustomSelectItem value="0" text={s.zeroDecimals} icon={Binary} />
            <CustomSelectItem value="1" text={s.oneDecimal} icon={Binary} />
            <CustomSelectItem value="2" text={s.twoDecimals} icon={Binary} />
            <CustomSelectItem value="3" text={s.threeDecimals} icon={Binary} />
          </CustomSelect>
        </Stack>
      </Stack>
    </Box>
  )
}

function UnitListItem({ unit, onClick }: { unit: UnitItem; onClick: () => void }) {
  return (
    <Box paddingY={2.5} paddingX={2.5} hoverBg="primary/10" w="full" cursor="pointer" onClick={onClick}>
      <Stack gap={1} w="full">
        <Font variant="body" text={unit.name} />
        <Font variant="auxiliary" text={getDecimalText(unit.decimals)} color="muted" />
      </Stack>
    </Box>
  )
}

function checkUnitDirty(
  editingUnit: UnitItem | null,
  formName: string,
  formDecimals: string
): boolean {
  if (editingUnit) {
    return formName !== editingUnit.name || formDecimals !== String(editingUnit.decimals)
  }
  return Boolean(formName.trim() || (formDecimals !== "0" && formDecimals !== ""))
}

interface UnidadesHeaderSyncOpts {
  mode: "list" | "form"
  editingUnit: UnitItem | null
  tenantId?: string
  handleBack: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  setMode: (m: "list" | "form") => void
  setEditingUnit: (u: UnitItem | null) => void
}

function useUnidadesHeaderSync(opts: UnidadesHeaderSyncOpts) {
  const {
    mode, editingUnit, tenantId, handleBack,
    setCustomBack, setCustomTitle, setCustomActions, setMode, setEditingUnit,
  } = opts
  const s = UI_STRINGS.settings.unidades

  React.useEffect(() => {
    if (mode === "form") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.(editingUnit ? s.editUnitTitle : s.newUnitTitle)
      setCustomActions?.(
        <Stack direction="row" gap={2.5} align="center">
          {editingUnit && (
            <Button
              type="button"
              variant="danger-pill-icon-confirm"
              icon={Trash2}
              confirmModal={{
                title: "Excluir Unidade",
                subtitle: "Confirmar exclusão de unidade",
                paragraph: `Tem certeza de que deseja excluir a unidade "${editingUnit.name}"? Esta ação não poderá ser desfeita.`,
                icon: Trash2,
                successText: "Confirmar Exclusão",
              }}
              onConfirm={async () => { await dal.units.delete(editingUnit.id, tenantId); setMode("list"); setEditingUnit(null) }}
              title={s.deleteUnitTitle}
            />
          )}
          <Button type="submit" form="unit-form" variant="primary-pill-icon" icon={Check} title={s.saveUnitTitle} />
        </Stack>
      )
    }
    return () => { setCustomBack?.(null); setCustomTitle?.(null); setCustomActions?.(null) }
  }, [mode, editingUnit, tenantId, setCustomBack, setCustomTitle, setCustomActions, handleBack, s, setMode, setEditingUnit])
}

function UnidadesListView({
  units, onAdd, onEdit, setCustomBack, setCustomTitle, setCustomActions, onBackToDashboard,
}: {
  units: UnitItem[]
  onAdd: () => void
  onEdit: (unit: UnitItem) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onBackToDashboard: () => void
}) {
  const s = UI_STRINGS.settings.unidades
  return (
    <ListSectionLayout<UnitItem>
      title={s.title}
      items={units}
      searchPlaceholder={s.searchPlaceholder}
      searchFilterFn={(u, q) => u.name.toLowerCase().includes(q.toLowerCase())}
      emptyIcon={Scale}
      emptyTitle={s.emptyTitle}
      emptySubtitle={s.emptySubtitle}
      onAdd={onAdd}
      getItemKey={(u) => u.id}
      setCustomBack={setCustomBack}
      setCustomTitle={setCustomTitle}
      setCustomActions={setCustomActions}
      onBackToDashboard={onBackToDashboard}
      renderItem={(unit) => <UnitListItem unit={unit} onClick={() => onEdit(unit)} />}
    />
  )
}

export const UnidadesSection: React.FC<UnidadesSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id
  const dbUnits = useUnits(tenantId)
  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [editingUnit, setEditingUnit] = React.useState<UnitItem | null>(null)
  const [formName, setFormName] = React.useState("")
  const [formDecimals, setFormDecimals] = React.useState("0")
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  const isDirty = checkUnitDirty(editingUnit, formName, formDecimals)

  const units: UnitItem[] = React.useMemo(() => {
    if (dbUnits && dbUnits.length > 0) {
      return dbUnits.map((u) => ({ id: u.id, name: u.name, decimals: u.decimals ?? 0 }))
    }
    return []
  }, [dbUnits])

  const handleBack = React.useCallback(() => {
    if (mode === "form") {
      if (isDirty) {
        setIsDiscardModalOpen(true)
      } else {
        setMode("list")
        setEditingUnit(null)
      }
    } else {
      onCancel()
    }
  }, [mode, isDirty, onCancel])

  useUnidadesHeaderSync({
    mode, editingUnit, tenantId, handleBack,
    setCustomBack, setCustomTitle, setCustomActions, setMode, setEditingUnit,
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return
    const unitPayload = {
      id: editingUnit ? editingUnit.id : `uni-${Date.now()}`,
      name: formName.toUpperCase(), symbol: formName.toUpperCase().substring(0, 3),
      company_id: tenantId || "demo-tenant", tenant_id: tenantId || "demo-tenant",
      decimals: parseInt(formDecimals, 10) || 0,
    }
    if (editingUnit) await dal.units.update(unitPayload)
    else await dal.units.create(unitPayload)
    setMode("list")
    setEditingUnit(null)
  }

  return (
    <ViewTransition viewKey={mode} flex="1" minH="0">
      {mode === "form" ? (
        <UnitFormCard formName={formName} setFormName={setFormName} formDecimals={formDecimals} setFormDecimals={setFormDecimals} onSubmit={handleSave} />
      ) : (
        <UnidadesListView
          units={units}
          onAdd={() => { setEditingUnit(null); setFormName(""); setFormDecimals("0"); setMode("form") }}
          onEdit={(unit) => { setEditingUnit(unit); setFormName(unit.name); setFormDecimals(unit.decimals.toString()); setMode("form") }}
          setCustomBack={setCustomBack}
          setCustomTitle={setCustomTitle}
          setCustomActions={setCustomActions}
          onBackToDashboard={onCancel}
        />
      )}
      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          setIsDiscardModalOpen(false)
          setMode("list")
          setEditingUnit(null)
        }}
      />
    </ViewTransition>
  )
}
