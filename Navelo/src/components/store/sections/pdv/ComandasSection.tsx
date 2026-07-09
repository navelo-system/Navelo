"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Grid } from "../../base/Grid"
import { Font } from "../../base/Font"
import { Icon } from "../../base/Icon"
import { Button } from "../../base/Button"
import { Input } from "../../base/Input"
import { Badge } from "../../base/Badge"
import { Modal } from "../../base/Modal"
import { EmptyState } from "../../intermediary/EmptyState"
import { Search, Clock, Receipt, Menu, X, Maximize2, Cloud } from "lucide-react"

interface ComandaItem {
  id: string
  label: string
  time: string
  total: number
}

interface ComandasSectionProps {
  onSelectComanda: (id: string) => void
  comandas: ComandaItem[]
  onAddComanda: (label: string) => void
}

export const ComandasSection: React.FC<ComandasSectionProps> = ({
  onSelectComanda,
  comandas,
  onAddComanda,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [newComandaName, setNewComandaName] = React.useState("")
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)

  const filtered = comandas.filter((c) =>
    c.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComandaName.trim()) return
    const formatted = newComandaName.startsWith("#") ? newComandaName : `#${newComandaName}`
    onAddComanda(formatted)
    setNewComandaName("")
    setIsCreateModalOpen(false)
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Stack gap={5} w="full">
      {/* Barra de Pesquisa + Hambúrguer */}
      <Stack direction="row" gap={2.5} align="center" w="full">
        <Box flex="1" padding={0}>
          <Input
            placeholder="Pesquisar comanda ativa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </Box>
        <Button
          variant="outline-secondary-pill-icon"
          icon={Menu}
          onClick={() => setIsSidebarOpen(true)}
        />
      </Stack>

      {/* Grade de Comandas Ativas */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Nenhuma comanda ativa"
          subtitle="Abra uma comanda pelo menu para iniciar o consumo."
        />
      ) : (
        <Grid cols={4} gap={5}>
          {filtered.map((comanda) => (
            <Box
              key={comanda.id}
              as="button"
              onClick={() => onSelectComanda(comanda.id)}
              padding={5}
              bg="bg-surface"
              radius="default"
              border={true}
              borderColor="border-brand-secondary"
              w="full"
              hoverBg="secondary/10"
            >
              <Stack gap={5} w="full" align="start">
                <Badge variant="secondary" label="Ativo" />

                <Stack gap={1} align="start" w="full">
                  <Font variant="body-bold" text={comanda.label} />
                  <Stack direction="row" align="center" gap={1}>
                    <Icon icon={Clock} size={14} color="muted" />
                    <Font variant="auxiliary" color="muted" text={comanda.time} />
                  </Stack>
                </Stack>

                <Box h="h-[2px]" bg="bg-border" w="full" />

                <Stack direction="row" justify="between" align="center" w="full">
                  <Font variant="sub-tiny" color="muted" text="Consumo" />
                  <Font variant="body-sm-semibold" color="secondary" text={formatPrice(comanda.total)} />
                </Stack>
              </Stack>
            </Box>
          ))}
        </Grid>
      )}

      {/* Sidebar Drawer */}
      {isSidebarOpen && (
        <Box position="fixed" top={0} left={0} right={0} bottom={0} zIndex="50" display="flex" justify="end">
          {/* Backdrop */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Drawer Body */}
          <Box
            w="w-full max-w-xs"
            h="full"
            bg="bg-surface"
            display="flex"
            direction="col"
            position="relative"
            zIndex="50"
            border={true}
            borderColor="border-border"
            shadow="default"
          >
            {/* Header */}
            <Box padding={5}>
              <Stack direction="row" align="center" justify="between" w="full">
                <Font variant="h3" text="Menu" />
                <Stack direction="row" gap={2.5}>
                  <Button variant="outline" icon={Maximize2} />
                  <Button variant="outline" icon={X} onClick={() => setIsSidebarOpen(false)} />
                </Stack>
              </Stack>
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />

            {/* Scrollable Content */}
            <Box flex="1" overflow="x-hidden y-auto" padding={5}>
              <Stack gap={5}>
                {/* Sincronização */}
                <Box w="full" bg="bg-surface-sunken" padding={2.5} radius="default">
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Stack direction="row" align="center" gap={2.5}>
                      <Icon icon={Cloud} size={16} color="primary" />
                      <Font variant="body-sm-semibold" text="Sincronização" />
                    </Stack>
                    <Font variant="body-sm-medium" color="muted" text="Sincronizado" />
                  </Stack>
                </Box>

                {/* Atendimento */}
                <Stack gap={2.5}>
                  <Font variant="body-xs-bold" color="muted" text="ATENDIMENTO" />
                  <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
                    <Box 
                      as="button" 
                      w="full" 
                      padding={2.5} 
                      hoverBg="surface-sunken" 
                      display="flex" 
                      justify="start"
                      onClick={() => {
                        setIsSidebarOpen(false)
                        setIsCreateModalOpen(true)
                      }}
                    >
                      <Font variant="body-sm-semibold" text="Novo atendimento avulso" />
                    </Box>
                    <Box h="h-[1px]" w="full" bg="bg-border" />
                    <Box 
                      as="button" 
                      w="full" 
                      padding={2.5} 
                      hoverBg="surface-sunken" 
                      display="flex" 
                      justify="start"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <Font variant="body-sm-semibold" text="Finalizar atendimentos" />
                    </Box>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Box>
      )}

      {/* Modal Novo Atendimento */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <Box padding={5} bg="bg-surface" radius="default">
          <Stack gap={5}>
            <Font variant="h3" text="Novo Atendimento" />
            <Box h="h-[2px]" bg="bg-border" w="full" />
            <Box as="form" onSubmit={handleCreate} w="full" padding={0}>
              <Stack gap={5}>
                <Stack gap={1}>
                  <Font variant="body-sm-semibold" text="Identificador da Comanda" />
                  <Input
                    placeholder="Ex: #mesa_14, #pedro..."
                    value={newComandaName}
                    onChange={(e) => setNewComandaName(e.target.value)}
                    autoFocus
                  />
                </Stack>
                <Stack direction="row" gap={2.5} justify="end" w="full">
                  <Button 
                    variant="outline" 
                    label="Cancelar" 
                    onClick={() => setIsCreateModalOpen(false)} 
                  />
                  <Button 
                    variant="primary" 
                    label="Confirmar e Abrir" 
                    type="submit" 
                  />
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </Stack>
  )
}
