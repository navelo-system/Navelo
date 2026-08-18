"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Form } from "@/components/store/base/Form"
import { Button } from "@/components/store/base/Button"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Plus, Edit2, Coins, Percent } from "lucide-react"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { UI_STRINGS } from "@/constants/strings"

export interface ServiceFeeItem {
  id: string
  name: string
  type: "fixed" | "percentage"
  value: string
}

export interface TaxaServicoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const TaxaServicoSection: React.FC<TaxaServicoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [fees, setFees] = React.useState<ServiceFeeItem[]>([
    { id: "1", name: "Taxa de Serviço Padrão", type: "percentage", value: "10,00" },
    { id: "2", name: "Acoplagem/Couvert", type: "fixed", value: "15,00" }
  ])

  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [editingFee, setEditingFee] = React.useState<ServiceFeeItem | null>(null)
  const s = UI_STRINGS.fees
  
  // Form states
  const [formName, setFormName] = React.useState("")
  const [formType, setFormType] = React.useState<"fixed" | "percentage">("percentage")
  const [formValue, setFormValue] = React.useState("10,00")

  const handleBack = React.useCallback(() => {
    if (mode === "form") {
      setMode("list")
      setEditingFee(null)
    } else {
      onCancel()
    }
  }, [mode, onCancel])

  React.useEffect(() => {
    setCustomBack?.(() => handleBack)
    setCustomTitle?.(mode === "form" ? (editingFee ? "Editar taxa de serviço" : "Nova taxa de serviço") : s.serviceFeeTitle)

    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, handleBack, mode, editingFee, s.serviceFeeTitle])

  const handleAddClick = () => {
    setEditingFee(null)
    setFormName("")
    setFormType("percentage")
    setFormValue("10,00")
    setMode("form")
  }

  const handleEditClick = (fee: ServiceFeeItem) => {
    setEditingFee(fee)
    setFormName(fee.name)
    setFormType(fee.type)
    setFormValue(fee.value)
    setMode("form")
  }

  const handleDeleteClick = (id: string) => {
    setFees((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    if (editingFee) {
      setFees((prev) =>
        prev.map((item) =>
          item.id === editingFee.id ? { ...item, name: formName, type: formType, value: formValue } : item
        )
      )
    } else {
      const newFee: ServiceFeeItem = {
        id: Date.now().toString(),
        name: formName,
        type: formType,
        value: formValue
      }
      setFees((prev) => [...prev, newFee])
    }

    setMode("list")
    setEditingFee(null)
  }

  if (mode === "form") {
    return (
      <Stack gap={5} w="full">
        <Box
          bg="bg-white"
          border={true}
          borderColor="border-border"
          radius="default"
          padding={5}
          w="full"
        >
          <Form onSubmit={handleSave}>
            <Stack gap={5} w="full">
              <Input
                label={UI_STRINGS.serviceCharges.nameLabel}
                placeholder={UI_STRINGS.serviceCharges.namePlaceholder}
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />

              <Stack gap={2.5} w="full">
                <Font variant="description" text={UI_STRINGS.serviceCharges.chargeTypeLabel} color="muted" />
                <CustomSelect
                  value={formType}
                  onChange={(val) => setFormType(val as "fixed" | "percentage")}
                >
                  <CustomSelectItem value="percentage" text={UI_STRINGS.serviceCharges.percentualOption} icon={Percent} />
                  <CustomSelectItem value="fixed" text={UI_STRINGS.serviceCharges.fixedOption} icon={Coins} />
                </CustomSelect>
              </Stack>

              <Input
                label={formType === "percentage" ? UI_STRINGS.serviceCharges.percentualLabel : UI_STRINGS.serviceCharges.fixedLabel}
                placeholder={formType === "percentage" ? UI_STRINGS.serviceCharges.percentualPlaceholder : UI_STRINGS.serviceCharges.fixedPlaceholder}
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                required
              />

              {/* Botões de Ações no Rodapé do Formulário */}
              <FormActions
                confirmLabel={editingFee ? UI_STRINGS.pdv.cart.saveChangesButton : UI_STRINGS.serviceCharges.addFeeFormButton}
                onConfirm={() => {}}
                onCancel={() => {
                  setMode("list")
                  setEditingFee(null)
                }}
                isSubmit={true}
              />
            </Stack>
          </Form>
        </Box>
      </Stack>
    )
  }

  return (
    <Stack gap={5} w="full">
      {fees.length === 0 ? (
        <Box
          bg="bg-white"
          border={true}
          borderColor="border-border"
          radius="default"
          padding={5}
          w="full"
        >
          <Stack gap={5} align="center" justify="center" w="full">
            <EmptyState
              title={UI_STRINGS.serviceCharges.emptyTitle}
              subtitle={UI_STRINGS.serviceCharges.emptySubtitle}
              icon={Coins}
            />
            <Button
              variant="primary"
              label={UI_STRINGS.serviceCharges.addFeeButton}
              icon={Plus}
              onClick={handleAddClick}
            />
          </Stack>
        </Box>
      ) : (
        <Stack gap={5} w="full">
          {/* Cabeçalho de Controle */}
          <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" w="full" gap={2.5}>
            <Font variant="body-bold" text={s.serviceFeeTitle} />
            <Button
              variant="primary"
              label={UI_STRINGS.deliveryFees.addFeeFormButton}
              icon={Plus}
              onClick={handleAddClick}
            />
          </Stack>

          {/* Listagem de Taxas */}
          <Box
            bg="bg-white"
            border={true}
            borderColor="border-border"
            radius="default"
            w="full"
            overflow="hidden"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead text={UI_STRINGS.deliveryFees.nameColumnHeader} />
                  <TableHead text={UI_STRINGS.serviceCharges.typeColumnHeader} />
                  <TableHead text={UI_STRINGS.deliveryFees.valueColumnHeader} />
                  <TableHead text={UI_STRINGS.tabsConfig.actionsCol} align="right" w="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>
                      <Font variant="body-bold" text={fee.name} />
                    </TableCell>
                    <TableCell>
                      <Font
                        variant="body"
                        text={fee.type === "percentage" ? "Percentual" : "Valor Fixo"}
                      />
                    </TableCell>
                    <TableCell>
                      <Font
                        variant="body"
                        text={fee.type === "percentage" ? `${fee.value}%` : `R$ ${fee.value}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" gap={2.5} justify="end">
                        <Button
                          variant="ghost-primary"
                          icon={Edit2}
                          onClick={() => handleEditClick(fee)}
                        />
                        <Button
                          variant="danger-icon-xs-confirm"
                          confirmTitle="Excluir Taxa de Serviço"
                          confirmSubtitle="Confirmar exclusão de taxa"
                          confirmParagraph="Tem certeza que deseja excluir esta taxa de serviço?"
                          onConfirm={() => handleDeleteClick(fee.id)}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Stack>
      )}
    </Stack>
  )
}
