"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Icon } from "@/components/store/base/Icon"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Plus, Folder, Layers, X, FolderOpen, Check } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { useCategories, dal } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import { ViewTransition } from "@/components/store/base/ViewTransition"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { UI_STRINGS } from "@/constants/strings"

export interface GroupItem {
  id: string
  name: string
  subgroups: string[]
}

export interface GruposSubgruposSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function GruposSubgroupsInputList({
  formSubgroups, onAdd, onRemove, onChange,
}: {
  formSubgroups: string[]
  onAdd: () => void
  onRemove: (idx: number) => void
  onChange: (idx: number, val: string) => void
}) {
  const s = UI_STRINGS.settings.gruposSubgrupos
  return (
    <Stack gap={2.5} w="full">
      <Stack direction="row" align="center" justify="between" w="full">
        <Stack gap={1} flex="1">
          <Font variant="body-bold" text={s.subgroupsTitle} />
          <Font variant="description" text={s.subgroupsDesc} color="muted" />
        </Stack>
        <Button type="button" variant="primary-icon-xs" icon={Plus} onClick={onAdd} title={s.addSubgroupButton} />
      </Stack>
      <Stack gap={2.5} w="full">
        {formSubgroups.map((subgroup, idx) => (
          <Stack key={idx} direction="row" align="center" gap={2.5} w="full">
            <Box flex="1">
              <Input placeholder={s.subgroupPlaceholder} value={subgroup} onChange={(e) => onChange(idx, e.target.value)} icon={Layers} />
            </Box>
            <Button type="button" variant="danger-icon-xs" icon={X} onClick={() => onRemove(idx)} title={s.deleteGroupTitle} />
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}

function GruposFormCard({
  formName, setFormName, formSubgroups, onAddSubgroup, onRemoveSubgroup, onSubgroupChange, onSave,
}: {
  formName: string
  setFormName: (v: string) => void
  formSubgroups: string[]
  onAddSubgroup: () => void
  onRemoveSubgroup: (idx: number) => void
  onSubgroupChange: (idx: number, val: string) => void
  onSave: (e?: React.FormEvent) => void
}) {
  const s = UI_STRINGS.settings.gruposSubgrupos
  return (
    <Box as="form" onSubmit={onSave} bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Input label={s.groupNameLabel} placeholder={s.groupNamePlaceholder} value={formName} onChange={(e) => setFormName(e.target.value)} icon={Folder} required />
        <GruposSubgroupsInputList formSubgroups={formSubgroups} onAdd={onAddSubgroup} onRemove={onRemoveSubgroup} onChange={onSubgroupChange} />
      </Stack>
    </Box>
  )
}

function GruposItemRow({
  group, isLast, onEdit, onDelete,
}: {
  group: GroupItem
  isLast: boolean
  onEdit: (g: GroupItem) => void
  onDelete: (id: string) => void
}) {
  const s = UI_STRINGS.settings.gruposSubgrupos
  return (
    <Box key={group.id}>
      <Box w="full" paddingY={2.5} paddingX={2.5} radius="none" hoverBg="primary/10" cursor="pointer" onClick={() => onEdit(group)}>
        <Stack direction="row" align="center" justify="between" w="full">
          <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
            <Icon icon={Folder} variant="circular-secondary" />
            <Stack gap={0} align="start" flex="1" minW="0">
              <Font variant="body" text={group.name} />
              <Font variant="auxiliary" color="muted" truncate={true} text={group.subgroups.length > 0 ? group.subgroups.join(", ") : UI_STRINGS.common.empty} />
            </Stack>
          </Stack>
          <Button type="button" variant="danger-icon-xs-confirm" confirmTitle={s.deleteGroupTitle} confirmSubtitle={s.deleteGroupTitle} confirmParagraph="Tem certeza que deseja excluir este grupo?" onConfirm={() => onDelete(group.id)} title={s.deleteGroupTitle} />
        </Stack>
      </Box>
      {!isLast && <Box borderBottom={true} borderColor="border-border" w="full" />}
    </Box>
  )
}

function GruposListView({
  filtered, onEdit, onDelete, onAdd,
}: {
  filtered: GroupItem[]
  onEdit: (g: GroupItem) => void
  onDelete: (id: string) => void
  onAdd: () => void
}) {
  const s = UI_STRINGS.settings.gruposSubgrupos
  return (
    <Box position="relative" w="full">
      <Stack gap={5} w="full">
        <Box position="relative" w="full">
          {filtered.length > 0 ? (
            <Box display="flex" direction="col" w="full">
              {filtered.map((group, idx) => (
                <GruposItemRow key={group.id} group={group} isLast={idx === filtered.length - 1} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </Box>
          ) : (
            <EmptyState icon={FolderOpen} title={s.emptyTitle} subtitle={s.emptySubtitle} />
          )}
          <Box position="fixed" bottom="24px" right="24px" zIndex="30">
            <Button variant="secondary-pill-icon" icon={Plus} onClick={onAdd} title={s.newGroupButton} />
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}

function checkGroupsDirty(
  editingGroup: GroupItem | null,
  formName: string,
  formSubgroups: string[]
): boolean {
  if (editingGroup) {
    if (formName !== editingGroup.name) return true
    const currentSubs = formSubgroups.filter((s) => s.trim() !== "")
    if (currentSubs.length !== editingGroup.subgroups.length) return true
    return currentSubs.some((s, idx) => s.toUpperCase() !== editingGroup.subgroups[idx]?.toUpperCase())
  }
  return Boolean(formName.trim() || formSubgroups.some((s) => s.trim() !== ""))
}

interface GruposHeaderSyncOpts {
  mode: "list" | "form"
  editingGroup: GroupItem | null
  searchQuery: string
  setSearchQuery: (q: string) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  handleBack: () => void
  handleSave: (e?: React.FormEvent) => void
}

function useGruposHeaderSync(opts: GruposHeaderSyncOpts) {
  const {
    mode, editingGroup, searchQuery, setSearchQuery,
    setCustomBack, setCustomTitle, setCustomActions, handleBack, handleSave,
  } = opts
  const s = UI_STRINGS.settings.gruposSubgrupos

  const handleSaveRef = React.useRef(handleSave)
  React.useEffect(() => { handleSaveRef.current = handleSave }, [handleSave])

  React.useEffect(() => {
    setCustomBack?.(() => handleBack)
    setCustomTitle?.(mode === "form" ? (editingGroup ? s.editGroupTitle : s.newGroupTitle) : s.title)
    if (mode === "list") setCustomActions?.(<MobileHeaderSearch searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} placeholder={s.searchPlaceholder} />)
    else setCustomActions?.(<Button type="button" variant="primary-pill-icon" icon={Check} onClick={() => handleSaveRef.current()} title={s.saveGroupTitle} />)
    return () => { setCustomBack?.(null); setCustomTitle?.(null); setCustomActions?.(null) }
  }, [mode, editingGroup, searchQuery, setSearchQuery, setCustomBack, setCustomTitle, setCustomActions, handleBack, s])
}

export const GruposSubgruposSection: React.FC<GruposSubgruposSectionProps> = ({
  onCancel, setCustomBack, setCustomTitle, setCustomActions,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id
  const dbCategories = useCategories(tenantId)

  const groups: GroupItem[] = React.useMemo(() => {
    if (!dbCategories || dbCategories.length === 0) return []
    return dbCategories.map((c) => ({ id: c.id, name: c.name, subgroups: c.subgroups || [] }))
  }, [dbCategories])

  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [editingGroup, setEditingGroup] = React.useState<GroupItem | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [formName, setFormName] = React.useState("")
  const [formSubgroups, setFormSubgroups] = React.useState<string[]>([""])
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  const isDirty = checkGroupsDirty(editingGroup, formName, formSubgroups)

  const handleBack = React.useCallback(() => {
    if (mode === "form") {
      if (isDirty) {
        setIsDiscardModalOpen(true)
      } else {
        setMode("list")
        setEditingGroup(null)
      }
    } else {
      onCancel()
    }
  }, [mode, isDirty, onCancel])

  const handleSave = React.useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!formName.trim()) return
    const categoryId = editingGroup ? editingGroup.id : `cat-${Date.now()}`
    const categoryPayload = {
      id: categoryId, name: formName.toUpperCase(), company_id: tenantId || "demo-tenant",
      tenant_id: tenantId || "demo-tenant", active: true,
      subgroups: formSubgroups.filter((item) => item.trim() !== "").map((item) => item.toUpperCase()),
    }
    if (editingGroup) await dal.categories.update(categoryPayload)
    else await dal.categories.create(categoryPayload)
    setMode("list"); setEditingGroup(null)
  }, [formName, formSubgroups, editingGroup, tenantId])

  useGruposHeaderSync({
    mode, editingGroup, searchQuery, setSearchQuery,
    setCustomBack, setCustomTitle, setCustomActions, handleBack, handleSave,
  })

  const handleCreateNew = () => { setEditingGroup(null); setFormName(""); setFormSubgroups([""]); setMode("form") }
  const handleEdit = (group: GroupItem) => { setEditingGroup(group); setFormName(group.name); setFormSubgroups(group.subgroups.length > 0 ? group.subgroups : [""]); setMode("form") }
  const handleDelete = (id: string) => { dal.categories.delete(id, tenantId) }

  const filtered = groups.filter((g) => {
    const q = searchQuery.toLowerCase()
    return g.name.toLowerCase().includes(q) || g.subgroups.some((item) => item.toLowerCase().includes(q))
  })

  return (
    <ViewTransition viewKey={mode} flex="1" minH="0">
      {mode === "form" ? (
        <GruposFormCard
          formName={formName} setFormName={setFormName} formSubgroups={formSubgroups}
          onAddSubgroup={() => setFormSubgroups((prev) => [...prev, ""])}
          onRemoveSubgroup={(idx) => setFormSubgroups((prev) => prev.filter((_, i) => i !== idx))}
          onSubgroupChange={(idx, val) => setFormSubgroups((prev) => prev.map((item, i) => (i === idx ? val : item)))}
          onSave={handleSave}
        />
      ) : (
        <GruposListView filtered={filtered} onEdit={handleEdit} onDelete={handleDelete} onAdd={handleCreateNew} />
      )}
      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          setIsDiscardModalOpen(false)
          setMode("list")
          setEditingGroup(null)
        }}
      />
    </ViewTransition>
  )
}
