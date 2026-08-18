"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Form } from "@/components/store/base/Form"
import { Button } from "@/components/store/base/Button"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { Plus, Edit2, Truck } from "lucide-react"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { UI_STRINGS } from "@/constants/strings"

export interface DeliveryFeeItem {
  id: string
  name: string
  value: string
}

export interface TaxaEntregaSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const TaxaEntregaSection: React.FC<TaxaEntregaSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [fees, setFees] = React.useState<DeliveryFeeItem[]>([
    { id: "1", name: "Taxa Centro", value: "5,00" },
    { id: "2", name: "Taxa Bairros Adjacentes", value: "10,00" },
    { id: "3", name: "Taxa Zonas Distantes", value: "15,00" }
  ])

  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [editingFee, setEditingFee] = React.useState<DeliveryFeeItem | null>(null)
  const s = UI_STRINGS.fees

  // Form states
  const [formName, setFormName] = React.useState("")
  const [formValue, setFormValue] = React.useState("0,00")

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
    setCustomTitle?.(mode === "form" ? (editingFee ? "Editar taxa de entrega" : "Nova taxa de entrega") : s.deliveryFeeTitle)

    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, handleBack, mode, editingFee, s.deliveryFeeTitle])

  const handleAddClick = () => {
    setEditingFee(null)
    setFormName("")
    setFormValue("0,00")
    setMode("form")
  }

  const handleEditClick = (fee: DeliveryFeeItem) => {
    setEditingFee(fee)
    setFormName(fee.name)
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
          item.id === editingFee.id ? { ...item, name: formName, value: formValue } : item
        )
      )
    } else {
      const newFee: DeliveryFeeItem = {
        id: Date.now().toString(),
        name: formName,
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
                label={UI_STRINGS.deliveryFees.nameLabel}
                placeholder={UI_STRINGS.deliveryFees.namePlaceholder}
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />

              <Input
                label={UI_STRINGS.deliveryFees.valueLabel}
                placeholder={UI_STRINGS.deliveryFees.valuePlaceholder}
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                required
              />

              {/* Botões de Ações no Rodapé do Formulário */}
              <FormActions
                confirmLabel={editingFee ? UI_STRINGS.pdv.cart.saveChangesButton : UI_STRINGS.deliveryFees.addFeeFormButton}
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
              title={UI_STRINGS.deliveryFees.emptyTitle}
              subtitle={UI_STRINGS.deliveryFees.emptySubtitle}
              icon={Truck}
            />
            <Button
              variant="primary"
              label={UI_STRINGS.deliveryFees.addFeeButton}
              icon={Plus}
              onClick={handleAddClick}
            />
          </Stack>
        </Box>
      ) : (
        <Stack gap={5} w="full">
          {/* Cabeçalho de Controle */}
          <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" w="full" gap={2.5}>
            <Font variant="body-bold" text={s.deliveryFeeTitle} />
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
                      <Font variant="body" text={`R$ ${fee.value}`} />
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
                          confirmTitle="Excluir Taxa"
                          confirmSubtitle="Confirmar exclusão de taxa"
                          confirmParagraph="Tem certeza que deseja excluir esta taxa de entrega?"
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
