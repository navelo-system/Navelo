"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { TagFoldSvg } from "@/components/store/base/TagFoldSvg"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { CreateComandaModal } from "@/components/store/sections/pdv/modals/CreateComandaModal"
import { ComandasMenuSidebar } from "@/components/store/sections/pdv/modals/ComandasMenuSidebar"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Search, Receipt, Menu } from "lucide-react"

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
  setCustomActions?: (actions: React.ReactNode | null) => void
}

export const ComandasSection: React.FC<ComandasSectionProps> = ({
  onSelectComanda,
  comandas,
  onAddComanda,
  setCustomActions,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)

  const filtered = comandas.filter((c) =>
    c.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = (name: string) => {
    const formatted = name.startsWith("#") ? name : `#${name}`
    onAddComanda(formatted)
    setIsCreateModalOpen(false)
  }

  React.useEffect(() => {
    setCustomActions?.(
      <Button
        variant="primary-pill-icon"
        icon={Menu}
        onClick={() => setIsSidebarOpen(true)}
      />
    )

    return () => setCustomActions?.(null)
  }, [setCustomActions])


  return (
    <Stack gap={5} w="full">
      <Box flex="1" padding={0} w="full">
        <Input
          placeholder="Pesquisar comanda ativa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
        />
      </Box>

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
              <TagFoldSvg />

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

      <ComandasMenuSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewComanda={() => setIsCreateModalOpen(true)}
        onFinishAll={() => { /* handle finish all */ }}
      />

      {/* Modal Novo Atendimento */}
      <CreateComandaModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
      />
    </Stack>
  )
}
