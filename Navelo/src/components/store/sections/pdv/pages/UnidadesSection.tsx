"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Plus, Edit2, Trash2, Binary, Clipboard } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { useUnits, dal } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"

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

export const UnidadesSection: React.FC<UnidadesSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id

  const dbUnits = useUnits(tenantId)

  const units: UnitItem[] = React.useMemo(() => {
    if (dbUnits && dbUnits.length > 0) {
      return dbUnits.map(u => ({
        id: u.id,
        name: u.name,
        decimals: u.decimals ?? 0
      }))
    }
    return []
  }, [dbUnits])

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

    if (mode === "list") {
      setCustomActions?.(
        <MobileHeaderSearch
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          placeholder="Buscar por unidade..."
        />
      )
    } else {
      setCustomActions?.(null)
    }

    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [mode, editingUnit, searchQuery, setCustomBack, setCustomTitle, setCustomActions, handleBack])

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

  const handleDelete = async (id: string) => {
    await dal.units.delete(id, tenantId)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    const decimalsVal = parseInt(formDecimals, 10) || 0
    const unitId = editingUnit ? editingUnit.id : `uni-${Date.now()}`
    
    const unitPayload = {
      id: unitId,
      name: formName.toUpperCase(),
      symbol: formName.toUpperCase().substring(0, 3), // default fallback
      company_id: tenantId || "demo-tenant",
      tenant_id: tenantId || "demo-tenant",
      decimals: decimalsVal
    }

    if (editingUnit) {
      await dal.units.update(unitPayload)
    } else {
      await dal.units.create(unitPayload)
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
          <Stack direction="row" align="center" justify="end" w="full">
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
                          variant="primary-icon-xs"
                          icon={Edit2}
                          onClick={() => handleEdit(unit)}
                        />
                        <Button
                          variant="danger-icon-xs"
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
            <FormActions
              confirmLabel={editingUnit ? "Salvar alterações" : "Salvar unidade"}
              onConfirm={() => {}}
              onCancel={() => setMode("list")}
              isSubmit={true}
            />
          </Stack>
        </Box>
      )}
    </Box>
  )
}
