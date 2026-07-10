"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
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

type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12

function toGridCols(count: number): GridCols {
  const clamped = Math.max(1, Math.min(count, 10))
  if (clamped <= 6) return clamped as 1 | 2 | 3 | 4 | 5 | 6
  if (clamped <= 8) return 8
  return 10
}

function useGridColumnCount(
  minCardWidth: number,
  gap: number
) {
  const [columns, setColumns] = React.useState<GridCols>(3)
  const observerRef = React.useRef<ResizeObserver | null>(null)

  const refCallback = React.useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }

      if (node) {
        const updateColumns = () => {
          const width = node.getBoundingClientRect().width
          const next = Math.floor((width + gap) / (minCardWidth + gap))
          setColumns(toGridCols(next))
        }

        updateColumns()
        const observer = new ResizeObserver(updateColumns)
        observer.observe(node)
        observerRef.current = observer
      }
    },
    [minCardWidth, gap]
  )

  return [columns, refCallback] as const
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
  const [gridColumns, gridContainerRef] = useGridColumnCount(130, 20)

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
        <Box ref={gridContainerRef} w="full">
          <Grid cols={gridColumns} responsive={false} gap={5} w="full">
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
                w="full"
                h="h-[170px]"
                hoverBg="secondary/10"
                display="flex"
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
          </Grid>
        </Box>
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
