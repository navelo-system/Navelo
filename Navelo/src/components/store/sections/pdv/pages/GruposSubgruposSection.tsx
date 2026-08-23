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
  onSelectGroup?: (group: GroupItem) => void
  onSelectSubgroup?: (subgroup: string, group: GroupItem) => void
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
  group, isLast, onEdit, onDelete, onSelectGroup,
}: {
  group: GroupItem
  isLast: boolean
  onEdit: (g: GroupItem) => void
  onDelete: (id: string) => void
  onSelectGroup?: (g: GroupItem) => void
}) {
  const s = UI_STRINGS.settings.gruposSubgrupos
  return (
    <Box key={group.id}>
      <Box w="full" padding={2.5} radius="none" hoverBg="secondary/10" cursor="pointer" onClick={() => (onSelectGroup ? onSelectGroup(group) : onEdit(group))}>
        <Stack direction="row" align="center" justify="between" w="full">
          <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
            <Icon icon={Folder} variant="circular-secondary" />
            <Stack gap={0} align="start" flex="1" minW="0">
              <Font variant="body" text={group.name} />
              <Font variant="auxiliary" color="muted" truncate={true} text={group.subgroups.length > 0 ? group.subgroups.join(", ") : UI_STRINGS.common.empty} />
            </Stack>
          </Stack>
          {!onSelectGroup && (
            <Button type="button" variant="danger-icon-xs-confirm" confirmTitle={s.deleteGroupTitle} confirmSubtitle={s.deleteGroupTitle} confirmParagraph="Tem certeza que deseja excluir este grupo?" onConfirm={() => onDelete(group.id)} title={s.deleteGroupTitle} />
          )}
        </Stack>
      </Box>
      {!isLast && <Box borderBottom={true} borderColor="border-border" w="full" />}
    </Box>
  )
}

function GruposListView({
  filtered, onEdit, onDelete, onAdd, onSelectGroup,
}: {
  filtered: GroupItem[]
  onEdit: (g: GroupItem) => void
  onDelete: (id: string) => void
  onAdd: () => void
  onSelectGroup?: (g: GroupItem) => void
}) {
  const s = UI_STRINGS.settings.gruposSubgrupos
  return (
    <Box position="relative" w="full">
      <Stack gap={5} w="full">
        <Box position="relative" w="full">
          {filtered.length > 0 ? (
            <Box display="flex" direction="col" w="full">
              {filtered.map((group, idx) => (
                <GruposItemRow key={group.id} group={group} isLast={idx === filtered.length - 1} onEdit={onEdit} onDelete={onDelete} onSelectGroup={onSelectGroup} />
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

interface FlatSubgroupItem {
  id: string
  subgroup: string
  group: GroupItem
}

function SubgruposSelectListView({
  groups, searchQuery, onSelectSubgroup, onAdd,
}: {
  groups: GroupItem[]
  searchQuery: string
  onSelectSubgroup: (subgroup: string, group: GroupItem) => void
  onAdd: () => void
}) {
  const flatItems: FlatSubgroupItem[] = React.useMemo(() => {
    const list: FlatSubgroupItem[] = []
    groups.forEach((g) => {
      if (g.subgroups && g.subgroups.length > 0) {
        g.subgroups.forEach((sub, idx) => {
          list.push({ id: `${g.id}-${idx}`, subgroup: sub, group: g })
        })
      } else {
        list.push({ id: `${g.id}-default`, subgroup: g.name, group: g })
      }
    })
    return list
  }, [groups])

  const filtered = flatItems.filter((it) => {
    const q = searchQuery.toLowerCase()
    return it.subgroup.toLowerCase().includes(q) || it.group.name.toLowerCase().includes(q)
  })

  const s = UI_STRINGS.settings.gruposSubgrupos

  return (
    <Box position="relative" w="full">
      <Stack gap={5} w="full">
        {filtered.length > 0 ? (
          <Box display="flex" direction="col" w="full">
            {filtered.map((item, idx) => (
              <Box key={item.id}>
                <Box w="full" padding={2.5} radius="none" hoverBg="secondary/10" cursor="pointer" onClick={() => onSelectSubgroup(item.subgroup, item.group)}>
                  <Stack direction="row" align="center" gap={2.5} w="full">
                    <Icon icon={Layers} variant="circular-secondary" />
                    <Stack gap={0} align="start" flex="1" minW="0">
                      <Font variant="body" text={item.subgroup} />
                      <Font variant="auxiliary" color="muted" text={`Grupo: ${item.group.name}`} />
                    </Stack>
                  </Stack>
                </Box>
                {idx < filtered.length - 1 && <Box borderBottom={true} borderColor="border-border" w="full" />}
              </Box>
            ))}
          </Box>
        ) : (
          <EmptyState icon={Layers} title={s.emptySubgroupsTitle} subtitle={s.emptySubgroupsSubtitle} />
        )}
        <Box position="fixed" bottom="24px" right="24px" zIndex="30">
          <Button variant="secondary-pill-icon" icon={Plus} onClick={onAdd} title={s.newGroupButton} />
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

  const setCustomBackRef = React.useRef(setCustomBack)
  const setCustomTitleRef = React.useRef(setCustomTitle)
  const setCustomActionsRef = React.useRef(setCustomActions)
  const handleBackRef = React.useRef(handleBack)
  const handleSaveRef = React.useRef(handleSave)
  const setSearchQueryRef = React.useRef(setSearchQuery)

  React.useEffect(() => {
    setCustomBackRef.current = setCustomBack
    setCustomTitleRef.current = setCustomTitle
    setCustomActionsRef.current = setCustomActions
    handleBackRef.current = handleBack
    handleSaveRef.current = handleSave
    setSearchQueryRef.current = setSearchQuery
  })

  React.useEffect(() => {
    setCustomBackRef.current?.(() => () => handleBackRef.current())
    setCustomTitleRef.current?.(mode === "form" ? (editingGroup ? s.editGroupTitle : s.newGroupTitle) : s.title)
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
        <Button
          type="button"
          variant="primary-pill-icon"
          icon={Check}
          onClick={() => handleSaveRef.current()}
          title={s.saveGroupTitle}
        />
      )
    }
  }, [mode, editingGroup, searchQuery, s])

  React.useEffect(() => {
    return () => {
      setCustomBackRef.current?.(null)
      setCustomTitleRef.current?.(null)
      setCustomActionsRef.current?.(null)
    }
  }, [])
}

interface UseGruposSectionStateOpts {
  tenantId: string
  onCancel: () => void
  onSelectGroup?: (group: GroupItem) => void
  onSelectSubgroup?: (subgroup: string, group: GroupItem) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function useGruposSectionState(opts: UseGruposSectionStateOpts) {
  const { tenantId, onCancel, onSelectGroup, onSelectSubgroup, setCustomBack, setCustomTitle, setCustomActions } = opts
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
      if (isDirty) setIsDiscardModalOpen(true)
      else { setMode("list"); setEditingGroup(null) }
    } else onCancel()
  }, [mode, isDirty, onCancel])

  const handleSave = React.useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!formName.trim()) return
    const categoryId = editingGroup ? editingGroup.id : `cat-${Date.now()}`
    const categoryPayload = {
      id: categoryId, name: formName.toUpperCase(), company_id: tenantId,
      tenant_id: tenantId, active: true,
      subgroups: formSubgroups.filter((item) => item.trim() !== "").map((item) => item.toUpperCase()),
    }
    if (editingGroup) await dal.categories.update(categoryPayload)
    else await dal.categories.create(categoryPayload)
    if (!editingGroup && onSelectGroup) {
      onSelectGroup({ id: categoryId, name: categoryPayload.name, subgroups: categoryPayload.subgroups })
    } else if (!editingGroup && onSelectSubgroup) {
      const selectedSub = categoryPayload.subgroups[0] || categoryPayload.name
      onSelectSubgroup(selectedSub, { id: categoryId, name: categoryPayload.name, subgroups: categoryPayload.subgroups })
    } else {
      setMode("list"); setEditingGroup(null)
    }
  }, [formName, formSubgroups, editingGroup, tenantId, onSelectGroup, onSelectSubgroup])

  useGruposHeaderSync({
    mode, editingGroup, searchQuery, setSearchQuery,
    setCustomBack, setCustomTitle, setCustomActions, handleBack, handleSave,
  })

  return {
    groups, mode, setMode, editingGroup, setEditingGroup,
    searchQuery, formName, setFormName, formSubgroups, setFormSubgroups,
    isDiscardModalOpen, setIsDiscardModalOpen, handleSave,
    handleCreateNew: () => { setEditingGroup(null); setFormName(""); setFormSubgroups([""]); setMode("form") },
    handleEdit: (group: GroupItem) => { setEditingGroup(group); setFormName(group.name); setFormSubgroups(group.subgroups.length > 0 ? group.subgroups : [""]); setMode("form") },
    handleDelete: (id: string) => { dal.categories.delete(id, tenantId) },
  }
}

export const GruposSubgruposSection: React.FC<GruposSubgruposSectionProps> = ({
  onCancel, onSelectGroup, onSelectSubgroup, setCustomBack, setCustomTitle, setCustomActions,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "11111111-1111-1111-1111-111111111111"
  const s = useGruposSectionState({ tenantId, onCancel, onSelectGroup, onSelectSubgroup, setCustomBack, setCustomTitle, setCustomActions })

  const filtered = s.groups.filter((g) => {
    const q = s.searchQuery.toLowerCase()
    return g.name.toLowerCase().includes(q) || g.subgroups.some((item) => item.toLowerCase().includes(q))
  })

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <ViewTransition viewKey={s.mode} flex="1" minH="0">
        {s.mode === "form" ? (
          <GruposFormCard
            formName={s.formName} setFormName={s.setFormName} formSubgroups={s.formSubgroups}
            onAddSubgroup={() => s.setFormSubgroups((prev) => [...prev, ""])}
            onRemoveSubgroup={(idx) => s.setFormSubgroups((prev) => prev.filter((_, i) => i !== idx))}
            onSubgroupChange={(idx, val) => s.setFormSubgroups((prev) => prev.map((item, i) => (i === idx ? val : item)))}
            onSave={s.handleSave}
          />
        ) : onSelectSubgroup ? (
          <SubgruposSelectListView groups={s.groups} searchQuery={s.searchQuery} onSelectSubgroup={onSelectSubgroup} onAdd={s.handleCreateNew} />
        ) : (
          <GruposListView filtered={filtered} onEdit={s.handleEdit} onDelete={s.handleDelete} onAdd={s.handleCreateNew} onSelectGroup={onSelectGroup} />
        )}
        <DiscardChangesModal
          isOpen={s.isDiscardModalOpen}
          onClose={() => s.setIsDiscardModalOpen(false)}
          onConfirmDiscard={() => {
            s.setIsDiscardModalOpen(false)
            s.setMode("list")
            s.setEditingGroup(null)
          }}
        />
      </ViewTransition>
    </Box>
  )
}
