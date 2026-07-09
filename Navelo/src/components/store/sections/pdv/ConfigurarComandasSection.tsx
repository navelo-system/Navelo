"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Input } from "../../base/Input"
import { Button } from "../../base/Button"
import { EmptyState } from "../../intermediary/EmptyState"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../base/Table"
import { Icon } from "../../base/Icon"
import { Badge } from "../../base/Badge"
import { Form } from "../../advanced/Form"
import { Plus, Edit2, Trash2, Receipt } from "lucide-react"

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
              <Box paddingY={2.5} w="full">
                <Stack direction="row" justify="end" gap={2.5} w="full">
                  <Button
                    type="button"
                    variant="outline"
                    label="Cancelar"
                    onClick={() => {
                      setMode("list")
                      setEditingComanda(null)
                    }}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    label={editingComanda ? "Salvar alterações" : "Adicionar comanda"}
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
                        variant={comanda.status === "available" ? "success" : "warning"}
                        label={comanda.status === "available" ? "Disponível" : "Em uso"}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" gap={2.5} justify="end">
                        <Box
                          as="button"
                          type="button"
                          onClick={() => handleEditClick(comanda)}
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
                          onClick={() => handleDeleteClick(comanda.id)}
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
