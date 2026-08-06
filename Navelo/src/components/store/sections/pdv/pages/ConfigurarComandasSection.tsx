"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { Badge } from "@/components/store/base/Badge"
import { Form } from "@/components/store/advanced/Form"
import { Plus, Edit2, Trash2, Receipt } from "lucide-react"
import { FormActions } from "@/components/store/intermediary/FormActions"

export interface ComandaItem {
  id: string
  number: string
  status: "available" | "busy"
}

export interface ConfigurarComandasSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const ConfigurarComandasSection: React.FC<ConfigurarComandasSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [comandas, setComandas] = React.useState<ComandaItem[]>([
    { id: "1", number: "01", status: "available" },
    { id: "2", number: "02", status: "busy" },
    { id: "3", number: "03", status: "available" },
    { id: "4", number: "04", status: "available" }
  ])

  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [editingComanda, setEditingComanda] = React.useState<ComandaItem | null>(null)
  
  // Form states
  const [formNumber, setFormNumber] = React.useState("")

  const handleBack = React.useCallback(() => {
    if (mode === "form") {
      setMode("list")
      setEditingComanda(null)
    } else {
      onCancel()
    }
  }, [mode, onCancel])

  React.useEffect(() => {
    setCustomBack?.(() => handleBack)
    setCustomTitle?.(mode === "form" ? (editingComanda ? "Editar comanda" : "Nova comanda") : "Configurar comandas")

    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, handleBack, mode, editingComanda])

  const handleAddClick = () => {
    setEditingComanda(null)
    setFormNumber("")
    setMode("form")
  }

  const handleEditClick = (comanda: ComandaItem) => {
    setEditingComanda(comanda)
    setFormNumber(comanda.number)
    setMode("form")
  }

  const handleDeleteClick = (id: string) => {
    setComandas((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formNumber.trim()) return

    if (editingComanda) {
      setComandas((prev) =>
        prev.map((item) =>
          item.id === editingComanda.id ? { ...item, number: formNumber } : item
        )
      )
    } else {
      const newComanda: ComandaItem = {
        id: Date.now().toString(),
        number: formNumber,
        status: "available"
      }
      setComandas((prev) => [...prev, newComanda])
    }

    setMode("list")
    setEditingComanda(null)
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
                label="* Número/Código da Comanda"
                placeholder="Ex: 05"
                value={formNumber}
                onChange={(e) => setFormNumber(e.target.value)}
                required
              />

              {/* Botões de Ações no Rodapé do Formulário */}
              <FormActions
                confirmLabel={editingComanda ? "Salvar alterações" : "Adicionar comanda"}
                onConfirm={() => {}}
                onCancel={() => {
                  setMode("list")
                  setEditingComanda(null)
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
      {comandas.length === 0 ? (
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
              title="Nenhuma comanda cadastrada"
              subtitle="Cadastre comandas para gerenciar o lançamento de pedidos."
              icon={Receipt}
            />
            <Button
              variant="primary"
              label="Adicionar comanda"
              icon={Plus}
              onClick={handleAddClick}
            />
          </Stack>
        </Box>
      ) : (
        <Stack gap={5} w="full">
          {/* Cabeçalho de Controle */}
          <Stack direction="row" align="center" justify="between" w="full">
            <Font variant="body-bold" text="Comandas" />
            <Button
              variant="primary"
              label="Adicionar comanda"
              icon={Plus}
              onClick={handleAddClick}
            />
          </Stack>

          {/* Listagem de Comandas */}
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
                  <TableHead text="Identificação" />
                  <TableHead text="Status" />
                  <TableHead text="Ações" align="right" w="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {comandas.map((comanda) => (
                  <TableRow key={comanda.id}>
                    <TableCell>
                      <Font variant="body-bold" text={`Comanda ${comanda.number}`} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={comanda.status === "available" ? "success" : "secondary"}
                        label={comanda.status === "available" ? "Disponível" : "Em uso"}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" gap={2.5} justify="end">
                        <Button
                          variant="ghost-primary"
                          icon={Edit2}
                          onClick={() => handleEditClick(comanda)}
                        />
                        <Button
                          variant="danger-icon-xs-confirm"
                          confirmTitle="Excluir Comanda"
                          confirmSubtitle="Confirmar exclusão de comanda"
                          confirmParagraph="Tem certeza que deseja excluir esta comanda?"
                          onConfirm={() => handleDeleteClick(comanda.id)}
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
