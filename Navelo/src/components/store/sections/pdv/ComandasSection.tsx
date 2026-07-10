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
import { Modal } from "../../base/Modal"
import { Sidebar } from "../../base/Sidebar"
import { EmptyState } from "../../intermediary/EmptyState"
import { Search, Receipt, Menu, Cloud } from "lucide-react"

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
          variant="primary-pill-icon"
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
        <Stack direction="row" wrap={true} gap={5} justify="start">
          {filtered.map((comanda) => (
            <Box
              key={comanda.id}
              as="button"
              onClick={() => onSelectComanda(comanda.id)}
              position="relative"
              padding={0}
              bg="bg-surface"
              radius="lg"
              border={true}
              borderColor="border-brand-secondary"
              overflow="hidden"
              minW="min-w-[130px]"
              h="h-[170px]"
              hoverBg="secondary/10"
              display="flex"
              flex="1"
              direction="col"
            >
              {/* Tag fold */}
              <Box position="absolute" top={0} left={0} w="w-12" h="h-12">
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', color: 'var(--brand-secondary)' }} fill="currentColor">
                  <path d="M0 0 H100 L0 100 V0" />
                  <circle cx="28" cy="28" r="14" fill="var(--surface)" />
                </svg>
              </Box>

              {/* Identifier */}
              <Box position="absolute" top={3} right={3}>
                <Font variant="body-sm-medium" text={comanda.label} />
              </Box>

              {/* Time */}
              <Stack w="full" h="full" justify="center" align="center">
                <Font variant="body-medium" text={comanda.time} />
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} title="Menu">
        <Stack gap={5}>
          {/* Sincronizacao */}
          <Box w="full" bg="bg-surface-sunken" padding={2.5} radius="default">
            <Stack direction="row" align="center" justify="between" w="full">
              <Stack direction="row" align="center" gap={2.5}>
                <Icon icon={Cloud} size={16} color="primary" />
                <Font variant="body-sm-semibold" text="Sincronizacao" />
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
      </Sidebar>

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
