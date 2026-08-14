"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { FilterPanel } from "@/components/store/intermediary/FilterPanel"
import { Modal } from "@/components/store/base/Modal"
import { PackageSearch, Filter } from "lucide-react"

export interface VendasSectionProps {
  onBackToDashboard: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

export const VendasSection: React.FC<VendasSectionProps> = ({
  onBackToDashboard,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const [period, setPeriod] = React.useState("Hoje")
  const [startDate, setStartDate] = React.useState("23/07/2026 00:00")
  const [endDate, setEndDate] = React.useState("23/07/2026 23:59")
  const [cliente, setCliente] = React.useState("")
  const [usuario, setUsuario] = React.useState("")
  const [dispositivo, setDispositivo] = React.useState("")
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)

  const onBackToDashboardRef = React.useRef(onBackToDashboard)
  React.useEffect(() => {
    onBackToDashboardRef.current = onBackToDashboard
  }, [onBackToDashboard])

  React.useEffect(() => {
    setCustomBack?.(() => () => onBackToDashboardRef.current())
    setCustomTitle?.("Vendas")
    setCustomActions?.(
      <Box display="block md:hidden">
        <Button
          variant="primary-pill-icon"
          icon={Filter}
          onClick={() => setIsFilterDrawerOpen(true)}
        />
      </Box>
    )

    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions])

  const renderFilterInputs = () => (
    <>
      <Input
        label="Cliente"
        placeholder="Cliente"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
      />
      <Input
        label="Usuário"
        placeholder="Usuário"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />
      <Input
        label="Dispositivo"
        placeholder="Dispositivo"
        value={dispositivo}
        onChange={(e) => setDispositivo(e.target.value)}
      />
    </>
  )

  return (
    <Stack direction="col" gap={5} w="full" flex="1" minH="0" h="full" overflow="hidden">
      <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch" flex="1" minH="0" h="full" overflow="hidden">
        {/* Painel Esquerdo: Lista Vazia */}
        <Box flex="1" w="full" h="full" bg="bg-surface" padding={5} radius="default" direction="col" justify="center" minH="0">
          <EmptyState
            icon={PackageSearch}
            title="Nenhum registro encontrado."
            subtitle="Utilize os filtros ao lado para pesquisar vendas efetuadas no período."
          />
        </Box>

        {/* Sidebar Direita Desktop: FilterPanel Inline */}
        <Box display="hidden md:flex" direction="col" h="full" minH="0" shrink="0">
          <FilterPanel
            title="Filtros"
            selectedPeriod={period}
            onPeriodChange={setPeriod}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            onFilter={() => {}}
          >
            {renderFilterInputs()}
          </FilterPanel>
        </Box>

        {/* Drawer Mobile: FilterPanel dentro de Modal Sidebar */}
        <Modal
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          title="Filtros"
          variant="sidebar"
        >
          <FilterPanel
            hideTitle
            borderless
            selectedPeriod={period}
            onPeriodChange={setPeriod}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            onFilter={() => setIsFilterDrawerOpen(false)}
          >
            {renderFilterInputs()}
          </FilterPanel>
        </Modal>
      </Stack>
    </Stack>
  )
}
