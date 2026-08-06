"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Icon } from "@/components/store/base/Icon"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Plus, Trash2, Folder, Layers, X, FolderOpen, Check } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"

import { useCategories, dal } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import { ViewTransition } from "@/components/store/base/ViewTransition"

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

export const GruposSubgruposSection: React.FC<GruposSubgruposSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id

  // Categorias vindas do banco local IndexedDB
  const dbCategories = useCategories(tenantId)

  // Agrupa categorias locais do Dexie
  const groups: GroupItem[] = React.useMemo(() => {
    if (dbCategories && dbCategories.length > 0) {
      return dbCategories.map(c => ({
        id: c.id,
        name: c.name,
        subgroups: c.subgroups || []
      }))
    }
    return []
  }, [dbCategories])

  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [editingGroup, setEditingGroup] = React.useState<GroupItem | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Form states
  const [formName, setFormName] = React.useState("")
  const [formSubgroups, setFormSubgroups] = React.useState<string[]>([""])

  const handleBack = React.useCallback(() => {
    if (mode === "form") {
      setMode("list")
      setEditingGroup(null)
    } else {
      onCancel()
    }
  }, [mode, onCancel])

  const handleSave = React.useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!formName.trim()) return

    const categoryId = editingGroup ? editingGroup.id : `cat-${Date.now()}`
    const categoryPayload = {
      id: categoryId,
      name: formName.toUpperCase(),
      company_id: tenantId || "demo-tenant",
      tenant_id: tenantId || "demo-tenant",
      active: true,
      subgroups: formSubgroups.filter(s => s.trim() !== "").map(s => s.toUpperCase())
    }

    if (editingGroup) {
      await dal.categories.update(categoryPayload)
    } else {
      await dal.categories.create(categoryPayload)
    }

    setMode("list")
    setEditingGroup(null)
  }, [formName, formSubgroups, editingGroup, tenantId])

  const handleSaveRef = React.useRef(handleSave)
  React.useEffect(() => {
    handleSaveRef.current = handleSave
  }, [handleSave])

  React.useEffect(() => {
    setCustomBack?.(() => handleBack)
    setCustomTitle?.(mode === "form" ? (editingGroup ? "Editar Grupo" : "Novo Grupo") : "Grupos e subgrupos")

    if (mode === "list") {
      setCustomActions?.(
        <MobileHeaderSearch
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          placeholder="Buscar por grupo ou subgrupo..."
        />
      )
    } else {
      setCustomActions?.(
        <Button
          type="button"
          variant="primary-pill-icon"
          icon={Check}
          onClick={() => handleSaveRef.current()}
          title="Salvar grupo"
        />
      )
    }

    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [mode, editingGroup, searchQuery, setCustomBack, setCustomTitle, setCustomActions, handleBack])

  const handleCreateNew = () => {
    setEditingGroup(null)
    setFormName("")
    setFormSubgroups([""])
    setMode("form")
  }

  const handleEdit = (group: GroupItem) => {
    setEditingGroup(group)
    setFormName(group.name)
    setFormSubgroups(group.subgroups.length > 0 ? group.subgroups : [""])
    setMode("form")
  }

  const handleDelete = async (id: string) => {
    await dal.categories.delete(id, tenantId)
  }

  const handleAddSubgroupField = () => {
    setFormSubgroups((prev) => [...prev, ""])
  }

  const handleRemoveSubgroupField = (idx: number) => {
    setFormSubgroups((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubgroupChange = (idx: number, val: string) => {
    setFormSubgroups((prev) =>
      prev.map((s, i) => (i === idx ? val : s))
    )
  }

  const filtered = groups.filter((g) => {
    const query = searchQuery.toLowerCase()
    return (
      g.name.toLowerCase().includes(query) ||
      g.subgroups.some((s) => s.toLowerCase().includes(query))
    )
  })

  return (
    <ViewTransition viewKey={mode} flex="1" minH="0">
      {mode === "form" ? (
        <Box
          as="form"
          onSubmit={handleSave}
          bg="bg-white"
          border={true}
          borderColor="border-border"
          radius="default"
          padding={5}
          w="full"
        >
          <Stack gap={5} w="full">
            <Input
              label="* Nome do Grupo"
              placeholder="Ex: BEBIDAS"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              icon={Folder}
              required
            />

            <Stack gap={2.5} w="full">
              <Stack direction="row" align="center" justify="between" w="full">
                <Stack gap={1} flex="1">
                  <Font variant="body-bold" text="Subgrupos" />
                  <Font
                    variant="description"
                    text="Cadastre os subgrupos associados a este grupo principal."
                    color="muted"
                  />
                </Stack>
                <Button
                  type="button"
                  variant="primary-icon-xs"
                  icon={Plus}
                  onClick={handleAddSubgroupField}
                  title="Adicionar subgrupo"
                />
              </Stack>

              <Stack gap={2.5} w="full">
                {formSubgroups.map((subgroup, idx) => (
                  <Stack key={idx} direction="row" align="center" gap={2.5} w="full">
                    <Box flex="1">
                      <Input
                        placeholder={`Subgrupo ${idx + 1}`}
                        value={subgroup}
                        onChange={(e) => handleSubgroupChange(idx, e.target.value)}
                        icon={Layers}
                      />
                    </Box>
                    <Button
                      type="button"
                      variant="danger-icon-xs"
                      icon={X}
                      onClick={() => handleRemoveSubgroupField(idx)}
                      title="Remover subgrupo"
                    />
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Box>
      ) : (
        <Box position="relative" w="full">
          <Stack gap={5} w="full">
            <Box position="relative" w="full">
              {filtered.length > 0 ? (
                <Box display="flex" direction="col" w="full">
                  {filtered.map((group, idx) => (
                    <Box key={group.id}>
                      <Box
                        w="full"
                        paddingY={2.5}
                        paddingX={2.5}
                        radius="none"
                        hoverBg="primary/10"
                        cursor="pointer"
                        onClick={() => handleEdit(group)}
                      >
                        <Stack direction="row" align="center" justify="between" w="full">
                          {/* Lado Esquerdo: Ícone + Nome e Subgrupos */}
                          <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
                            <Icon icon={Folder} variant="circular-secondary" />

                            <Stack gap={0} align="start" flex="1" minW="0">
                              <Font variant="body" text={group.name} />
                              <Font
                                variant="auxiliary"
                                color="muted"
                                truncate={true}
                                text={
                                  group.subgroups.length > 0
                                    ? group.subgroups.join(", ")
                                    : "Nenhum subgrupo cadastrado"
                                }
                              />
                            </Stack>
                          </Stack>

                          {/* Ação de Deleção */}
                          <Button
                            type="button"
                            variant="danger-icon-xs-confirm"
                            confirmTitle="Excluir Grupo"
                            confirmSubtitle="Confirmar exclusão de grupo"
                            confirmParagraph="Tem certeza que deseja excluir este grupo?"
                            onConfirm={() => handleDelete(group.id)}
                            title="Excluir grupo"
                          />
                        </Stack>
                      </Box>
                      {idx < filtered.length - 1 && (
                        <Box borderBottom={true} borderColor="border-border" w="full" />
                      )}
                    </Box>
                  ))}
                </Box>
              ) : (
                <EmptyState
                  icon={FolderOpen}
                  title="Nenhum grupo encontrado"
                  subtitle={
                    searchQuery
                      ? "Tente pesquisar com outro termo."
                      : "Cadastre seu primeiro grupo de produtos."
                  }
                />
              )}

              {/* Botão FAB fixo no canto inferior direito */}
              <Box position="fixed" bottom={6} right={6} zIndex="50">
                <Button
                  variant="secondary-pill-icon"
                  icon={Plus}
                  onClick={handleCreateNew}
                  title="Novo grupo"
                />
              </Box>
            </Box>
          </Stack>
        </Box>
      )}
    </ViewTransition>
  )
}
