"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Input } from "../../base/Input"
import { Form } from "../../base/Form"
import { Button } from "../../base/Button"
import { EmptyState } from "../../intermediary/EmptyState"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../base/Table"
import { Icon } from "../../base/Icon"
import { CustomSelect, CustomSelectItem } from "../../base/CustomSelect"
import { Plus, Edit2, Trash2, Coins, Percent } from "lucide-react"

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
    setCustomTitle?.(mode === "form" ? (editingFee ? "Editar taxa de serviço" : "Nova taxa de serviço") : "Taxas de serviço")

    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, handleBack, mode, editingFee])

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
                label="* Nome"
                placeholder="Ex: Taxa de Serviço 10%"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />

              <Stack gap={2.5} w="full">
                <Font variant="description" text="Tipo de taxa" color="muted" />
                <CustomSelect
                  value={formType}
                  onChange={(val) => setFormType(val as "fixed" | "percentage")}
                >
                  <CustomSelectItem value="percentage" text="Percentual (%)" icon={Percent} />
                  <CustomSelectItem value="fixed" text="Valor Fixo (R$)" icon={Coins} />
                </CustomSelect>
              </Stack>

              <Input
                label={formType === "percentage" ? "* Percentual (%)" : "* Valor Fixo (R$)"}
                placeholder={formType === "percentage" ? "10,00" : "R$ 0,00"}
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                required
              />

              {/* Botões de Ações no Rodapé do Formulário */}
              <Box paddingY={2.5} w="full">
                <Stack direction="row" justify="end" gap={2.5} w="full">
                  <Button
                    type="button"
                    variant="outline"
                    label="Cancelar"
                    onClick={() => {
                      setMode("list")
                      setEditingFee(null)
                    }}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    label={editingFee ? "Salvar alterações" : "Adicionar taxa"}
                  />
                </Stack>
              </Box>
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
              title="Nenhuma taxa de serviço cadastrada"
              subtitle="Cadastre taxas de serviço (fixas ou percentuais) para aplicar aos atendimentos."
              icon={Coins}
            />
            <Button
              variant="primary"
              label="Adicionar taxa de serviço"
              icon={Plus}
              onClick={handleAddClick}
            />
          </Stack>
        </Box>
      ) : (
        <Stack gap={5} w="full">
          {/* Cabeçalho de Controle */}
          <Stack direction="row" align="center" justify="between" w="full">
            <Font variant="body-bold" text="Taxas de serviço" />
            <Button
              variant="primary"
              label="Adicionar taxa"
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
                  <TableHead text="Nome" />
                  <TableHead text="Tipo" />
                  <TableHead text="Valor" />
                  <TableHead text="Ações" align="right" w="w-[100px]" />
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
                        <Box
                          as="button"
                          type="button"
                          onClick={() => handleEditClick(fee)}
                          cursor="pointer"
                          padding={1}
                          radius="default"
                          hoverBg="primary/10"
                          display="flex"
                          justify="center"
                        >
                          <Icon icon={Edit2} size={16} color="muted" />
                        </Box>
                        <Box
                          as="button"
                          type="button"
                          onClick={() => handleDeleteClick(fee.id)}
                          cursor="pointer"
                          padding={1}
                          radius="default"
                          hoverBg="primary/10"
                          display="flex"
                          justify="center"
                        >
                          <Icon icon={Trash2} size={16} color="danger" />
                        </Box>
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
