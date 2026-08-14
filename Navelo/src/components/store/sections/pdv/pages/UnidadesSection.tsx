"use client"

/* eslint-disable max-lines-per-function */

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
    if (mode === "form") {
      setCustomBack?.(() => handleBack)
      setCustomTitle?.(editingUnit ? "Editar Unidade" : "Nova Unidade")
      setCustomActions?.(
        <Stack direction="row" gap={2.5} align="center">
          {editingUnit && (
            <Button
              type="button"
              variant="danger-pill-icon"
              icon={Trash2}
              onClick={async () => {
                await dal.units.delete(editingUnit.id, tenantId)
                setMode("list")
                setEditingUnit(null)
              }}
              title="Excluir unidade"
            />
          )}
          <Button
            type="submit"
            form="unit-form"
            variant="primary-pill-icon"
            icon={Check}
            title="Salvar unidade"
          />
        </Stack>
      )
    }
  }, [mode, editingUnit, tenantId, setCustomBack, setCustomTitle, setCustomActions, handleBack])

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



  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    const decimalsVal = parseInt(formDecimals, 10) || 0
    const unitId = editingUnit ? editingUnit.id : `uni-${Date.now()}`

    const unitPayload = {
      id: unitId,
      name: formName.toUpperCase(),
      symbol: formName.toUpperCase().substring(0, 3),
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

  const getDecimalText = (decimals: number) => {
    if (decimals === 0) return "Nenhuma casa decimal"
    if (decimals === 1) return "1 casa decimal"
    return `${decimals} casas decimais`
  }

  return (
    <ViewTransition viewKey={mode} flex="1" minH="0">
      {mode === "form" ? (
        <Box
          as="form"
          id="unit-form"
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
          </Stack>
        </Box>
      ) : (
        <ListSectionLayout<UnitItem>
          title="Unidades"
          items={units}
          searchPlaceholder="Buscar por unidade..."
          searchFilterFn={(unit, query) => unit.name.toLowerCase().includes(query.toLowerCase())}
          emptyIcon={Scale}
          emptyTitle="Nenhuma unidade cadastrada"
          emptySubtitle="Adicione novas unidades de medida para seus produtos."
          onAdd={handleCreateNew}
          getItemKey={(unit) => unit.id}
          setCustomBack={setCustomBack}
          setCustomTitle={setCustomTitle}
          setCustomActions={setCustomActions}
          onBackToDashboard={onCancel}
          renderItem={(unit) => (
            <Box
              paddingY={2.5}
              paddingX={2.5}
              hoverBg="primary/10"
              w="full"
              cursor="pointer"
              onClick={() => handleEdit(unit)}
            >
              <Stack gap={1} w="full">
                <Font variant="body" text={unit.name} />
                <Font
                  variant="auxiliary"
                  text={getDecimalText(unit.decimals)}
                  color="muted"
                />
              </Stack>
            </Box>
          )}
        />
      )}
    </ViewTransition>
  )
}
