"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Button } from "../../base/Button"
import { Input } from "../../base/Input"
import { CustomSelect, CustomSelectItem } from "../../base/CustomSelect"
import { Search, Plus, Edit2, Trash2, Binary, Clipboard } from "lucide-react"

export interface UnitItem {
  id: string
  name: string
  decimals: number
}

export interface UnidadesSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const UnidadesSection: React.FC<UnidadesSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [units, setUnits] = React.useState<UnitItem[]>([
    { id: "1", name: "KG", decimals: 3 },
    { id: "2", name: "LT", decimals: 3 },
    { id: "3", name: "MT", decimals: 2 },
    { id: "4", name: "MT²", decimals: 2 },
    { id: "5", name: "MT³", decimals: 2 },
    { id: "6", name: "PC", decimals: 0 },
    { id: "7", name: "PR", decimals: 0 },
    { id: "8", name: "UN", decimals: 0 }
  ])

  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [editingUnit, setEditingUnit] = React.useState<UnitItem | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Form states
  const [formName, setFormName] = React.useState("")
  const [formDecimals, setFormDecimals] = React.useState("0")

  const handleBack = React.useCallback(() => {
    if (mode === "form") {
      setMode("list")
      setEditingUnit(null)
    } else {
      onCancel()
    }
  }, [mode, onCancel])

  React.useEffect(() => {
    setCustomBack?.(() => handleBack)
    setCustomTitle?.(mode === "form" ? (editingUnit ? "Editar Unidade" : "Nova Unidade") : "Unidades")

    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [mode, editingUnit, setCustomBack, setCustomTitle, handleBack])

  const handleCreateNew = () => {
    setEditingUnit(null)
    setFormName("")
    setFormDecimals("0")
    setMode("form")
  }

  const handleEdit = (unit: UnitItem) => {
    setEditingUnit(unit)
    setFormName(unit.name)
    setFormDecimals(unit.decimals.toString())
    setMode("form")
  }

  const handleDelete = (id: string) => {
    setUnits((prev) => prev.filter((u) => u.id !== id))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    const decimalsVal = parseInt(formDecimals, 10) || 0

    if (editingUnit) {
      setUnits((prev) =>
        prev.map((u) =>
          u.id === editingUnit.id
            ? { ...u, name: formName.toUpperCase(), decimals: decimalsVal }
            : u
        )
      )
    } else {
      const newUnit: UnitItem = {
        id: Date.now().toString(),
        name: formName.toUpperCase(),
        decimals: decimalsVal
      }
      setUnits((prev) => [...prev, newUnit])
    }

    setMode("list")
    setEditingUnit(null)
  }

  const filtered = units.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDecimalText = (decimals: number) => {
    if (decimals === 0) return "Nenhuma casa decimal"
    if (decimals === 1) return "1 casa decimal"
    return `${decimals} casas decimais`
  }

  return (
    <Box position="relative" w="full">
      {mode === "list" ? (
        <Stack gap={5} w="full">
          {/* Barra de Busca e Botão de Adição no topo */}
          <Stack direction="row" align="center" gap={5} w="full">
            <Box flex="1">
              <Input
                placeholder="Buscar por unidade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </Box>
            <Button
              variant="primary"
              label="Adicionar unidade"
              icon={Plus}
              onClick={handleCreateNew}
            />
          </Stack>

          {/* Listagem de Unidades */}
          <Box
            bg="bg-white"
            border={true}
            borderColor="border-border"
            radius="default"
            w="full"
            overflow="hidden"
          >
            <Stack gap={0} w="full">
              {filtered.map((unit, idx) => (
                <React.Fragment key={unit.id}>
                  {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
                  <Box
                    padding={5}
                    hoverBg="primary/10"
                    w="full"
                  >
                    <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                      <Stack gap={1} flex="1">
                        <Font variant="body-bold" text={unit.name} />
                        <Font
                          variant="description"
                          text={getDecimalText(unit.decimals)}
                          color="muted"
                        />
                      </Stack>

                      {/* Ações de Edição/Deleção */}
                      <Stack direction="row" gap={2.5} justify="end">
                        <Button
                          variant="outline-icon-xs"
                          icon={Edit2}
                          onClick={() => handleEdit(unit)}
                        />
                        <Button
                          variant="outline-danger-icon-xs"
                          icon={Trash2}
                          onClick={() => handleDelete(unit.id)}
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
              label="* Sigla/Nome da Unidade"
              placeholder="Ex: KG"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              icon={Clipboard}
              required
            />

            <Stack gap={1} w="full">
              <Font variant="sub-tiny-bold" text="* Casas Decimais" />
              <CustomSelect
                value={formDecimals}
                onChange={(val) => setFormDecimals(val)}
              >
                <CustomSelectItem value="0" text="Nenhuma casa decimal" icon={Binary} />
                <CustomSelectItem value="1" text="1 casa decimal" icon={Binary} />
                <CustomSelectItem value="2" text="2 casas decimais" icon={Binary} />
                <CustomSelectItem value="3" text="3 casas decimais" icon={Binary} />
              </CustomSelect>
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
                  label={editingUnit ? "Salvar alterações" : "Salvar unidade"}
                />
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  )
}
