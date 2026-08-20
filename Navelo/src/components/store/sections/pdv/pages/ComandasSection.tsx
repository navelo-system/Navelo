"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { TagFoldSvg } from "@/components/store/base/TagFoldSvg"
import { Button } from "@/components/store/base/Button"
import { CreateComandaModal } from "@/components/store/sections/pdv/modals/CreateComandaModal"
import { ComandasMenuSidebar } from "@/components/store/sections/pdv/modals/ComandasMenuSidebar"
import { FinalizarAtendimentosSection } from "@/components/store/sections/pdv/pages/FinalizarAtendimentosSection"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Receipt, Menu } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { UI_STRINGS } from "@/constants/strings"

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
  onStartAvulsoService?: () => void
  onBatchCheckoutComandas?: (comandaIds: string[]) => void
  setCustomTitle?: (title: string | null) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12

function toGridCols(count: number): GridCols {
  const clamped = Math.max(1, Math.min(count, 10))
  if (clamped <= 6) return clamped as 1 | 2 | 3 | 4 | 5 | 6
  if (clamped <= 8) return 8
  return 10
}

function useGridColumnCount(minCardWidth: number, gap: number) {
  const [columns, setColumns] = React.useState<GridCols>(3)
  const observerRef = React.useRef<ResizeObserver | null>(null)

  const refCallback = React.useCallback((node: HTMLElement | null) => {
    if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null }
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
  }, [minCardWidth, gap])

  return [columns, refCallback] as const
}

function ComandaGridCard({ comanda, onSelect }: { comanda: ComandaItem; onSelect: () => void }) {
  return (
    <Box onClick={onSelect} position="relative" padding={0} bg="bg-surface" radius="lg" border borderColor="border-brand-secondary" overflow="hidden" w="full" h="h-[170px]" hoverBg="secondary/10" display="flex" direction="col" cursor="pointer">
      <TagFoldSvg />
      <Box position="absolute" top={3} right={3}>
        <Font variant="body-sm-medium" text={comanda.label} />
      </Box>
      <Stack w="full" h="full" justify="center" align="center">
        <Font variant="body-medium" text={comanda.time} />
      </Stack>
    </Box>
  )
}

function ComandasGridContent({
  filtered,
  gridContainerRef,
  gridColumns,
  onSelectComanda,
  onOpenCreateModal,
}: {
  filtered: ComandaItem[]
  gridContainerRef: React.RefCallback<HTMLElement>
  gridColumns: GridCols
  onSelectComanda: (id: string) => void
  onOpenCreateModal: () => void
}) {
  const s = UI_STRINGS.tables
  if (filtered.length === 0) {
    return (
      <Stack align="center" gap={5} w="full">
        <EmptyState icon={Receipt} title={s.emptyComandasTitle} subtitle={s.emptyComandasSubtitle} />
        <Button variant="primary" label={s.newComandaButton} onClick={onOpenCreateModal} />
      </Stack>
    )
  }
  return (
    <Box ref={gridContainerRef} w="full">
      <Grid cols={gridColumns} responsive={false} gap={5} w="full">
        {filtered.map((c) => (
          <ComandaGridCard key={c.id} comanda={c} onSelect={() => onSelectComanda(c.id)} />
        ))}
      </Grid>
    </Box>
  )
}

export const ComandasSection: React.FC<ComandasSectionProps> = ({
  onSelectComanda,
  comandas,
  onAddComanda,
  onStartAvulsoService,
  onBatchCheckoutComandas,
  setCustomTitle,
  setCustomBack,
  setCustomActions,
}) => {
  const [viewMode, setViewMode] = React.useState<"grid" | "finish-all">("grid")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [gridColumns, gridContainerRef] = useGridColumnCount(130, 20)
  const s = UI_STRINGS.tables

  const filtered = comandas.filter((c) => c.label.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.includes(searchQuery))

  const handleCreate = (name: string) => {
    onAddComanda(name.startsWith("#") ? name : `#${name}`)
    setIsCreateModalOpen(false)
  }

  React.useEffect(() => {
    if (viewMode === "finish-all") return
    setCustomActions?.(
      <MobileHeaderSearch searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} placeholder={s.searchComandaPlaceholder}>
        <Button variant="primary-pill-icon" icon={Menu} onClick={() => setIsSidebarOpen(true)} />
      </MobileHeaderSearch>
    )
    return () => setCustomActions?.(null)
  }, [viewMode, setCustomActions, searchQuery, s.searchComandaPlaceholder])

  if (viewMode === "finish-all") {
    return (
      <FinalizarAtendimentosSection
        comandas={comandas}
        onBack={() => setViewMode("grid")}
        onFinalize={(selectedIds) => onBatchCheckoutComandas?.(selectedIds)}
        setCustomTitle={setCustomTitle}
        setCustomBack={setCustomBack}
        setCustomActions={setCustomActions}
      />
    )
  }

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <Stack gap={5} w="full">
        <ComandasGridContent
          filtered={filtered}
          gridContainerRef={gridContainerRef}
          gridColumns={gridColumns}
          onSelectComanda={onSelectComanda}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />
        <ComandasMenuSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNewComanda={() => setIsCreateModalOpen(true)}
          onStartAvulsoService={onStartAvulsoService}
          onFinishAll={() => setViewMode("finish-all")}
        />
        <CreateComandaModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreate} />
      </Stack>
    </Box>
  )
}
