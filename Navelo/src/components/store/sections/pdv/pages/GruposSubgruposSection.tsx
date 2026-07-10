"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Icon } from "@/components/store/base/Icon"
import { Search, Plus, Edit2, Trash2, Folder, Layers, X } from "lucide-react"

export interface GroupItem {
  id: string
  name: string
  subgroups: string[]
}

export interface GruposSubgruposSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const GruposSubgruposSection: React.FC<GruposSubgruposSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [groups, setGroups] = React.useState<GroupItem[]>([
    { id: "1", name: "BEBIDAS", subgroups: ["ÁGUA", "REFRIGERANTE", "SUCO", "ENERGÉTICO"] },
    { id: "2", name: "CAPELA", subgroups: ["Geral"] },
    { id: "3", name: "CERVEJAS", subgroups: ["COM ALCOOL", "SEM ALCOOL"] },
    { id: "4", name: "CERVEJAS ARTESANAIS", subgroups: ["UNICO"] },
    { id: "5", name: "CHURRASCO", subgroups: ["BOVINA", "AVE", "PORCO", "MISTO"] },
    { id: "6", name: "JANTINHAS", subgroups: ["1 ESPETOS", "2 ESPETOS", "3 ESPETOS"] }
  ])

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

  React.useEffect(() => {
    setCustomBack?.(() => handleBack)
    setCustomTitle?.(mode === "form" ? (editingGroup ? "Editar Grupo" : "Novo Grupo") : "Grupos e subgrupos")

    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [mode, editingGroup, setCustomBack, setCustomTitle, handleBack])

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

  const handleDelete = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id))
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    const cleanedSubgroups = formSubgroups
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    if (editingGroup) {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === editingGroup.id
            ? { ...g, name: formName.toUpperCase(), subgroups: cleanedSubgroups }
            : g
        )
      )
    } else {
      const newGroup: GroupItem = {
        id: Date.now().toString(),
        name: formName.toUpperCase(),
        subgroups: cleanedSubgroups
      }
      setGroups((prev) => [...prev, newGroup])
    }

    setMode("list")
    setEditingGroup(null)
  }

  const filtered = groups.filter((g) => {
    const query = searchQuery.toLowerCase()
    return (
      g.name.toLowerCase().includes(query) ||
      g.subgroups.some((s) => s.toLowerCase().includes(query))
    )
  })

  return (
    <Box position="relative" w="full">
      {mode === "list" ? (
        <Stack gap={5} w="full">
          {/* Barra de Busca e Botão de Adição no topo */}
          <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" gap={5} w="full">
            <Box flex="1">
              <Input
                placeholder="Buscar por grupo ou subgrupo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </Box>
            <Button
              variant="primary"
              label="Adicionar grupo"
              icon={Plus}
              onClick={handleCreateNew}
            />
          </Stack>

          {/* Listagem de Grupos */}
          <Box
            bg="bg-white"
            border={true}
            borderColor="border-border"
            radius="default"
            w="full"
            overflow="hidden"
          >
            <Stack gap={0} w="full">
              {filtered.map((group, idx) => (
                <React.Fragment key={group.id}>
                  {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
                  <Box
                    padding={5}
                    hoverBg="primary/10"
                    w="full"
                  >
                    <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                      <Stack gap={1} flex="1">
                        <Font variant="body-bold" text={group.name} />
                        <Font
                          variant="description"
                          text={group.subgroups.join(", ") || "Nenhum subgrupo cadastrado"}
                          color="muted"
                        />
                      </Stack>

                      {/* Ações de Edição/Deleção */}
                      <Stack direction="row" gap={2.5} justify="end">
                        <Button
                          variant="primary-icon-xs"
                          icon={Edit2}
                          onClick={() => handleEdit(group)}
                        />
                        <Button
                          variant="danger-icon-xs"
                          icon={Trash2}
                          onClick={() => handleDelete(group.id)}
                        />
                      </Stack>
                    </Stack>
                  </Box>
                </React.Fragment>
              ))}
            </Stack>
          </Box>
        </Stack>
      ) : (
        /* Form de Cadastro / Edição */
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
              <Font variant="body-bold" text="Subgrupos" />
              <Font
                variant="description"
                text="Cadastre os subgrupos associados a este grupo principal."
                color="muted"
              />

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
                    {formSubgroups.length > 1 && (
                      <Box
                        cursor="pointer"
                        onClick={() => handleRemoveSubgroupField(idx)}
                        padding={1}
                        hoverBg="secondary/10"
                        radius="default"
                      >
                        <Icon icon={X} size={18} color="danger" />
                      </Box>
                    )}
                  </Stack>
                ))}
              </Stack>

              <Box w="full" display="flex" justify="start">
                <Button
                  type="button"
                  variant="outline"
                  label="Adicionar subgrupo"
                  icon={Plus}
                  onClick={handleAddSubgroupField}
                />
              </Box>
            </Stack>

            {/* Ações de Formulário */}
            <Box paddingY={2.5} w="full">
              <Stack direction="row" justify="end" gap={2.5} w="full">
                <Button
                  type="button"
                  variant="outline"
                  label="Cancelar"
                  onClick={() => setMode("list")}
                />
                <Button
                  type="submit"
                  variant="primary"
                  label={editingGroup ? "Salvar alterações" : "Salvar grupo"}
                />
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
