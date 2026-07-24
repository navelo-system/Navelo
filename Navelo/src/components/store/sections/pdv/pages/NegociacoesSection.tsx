"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Modal } from "@/components/store/base/Modal"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { FilterPanel } from "@/components/store/intermediary/FilterPanel"
import { FileText, Filter } from "lucide-react"

interface NegociacoesSectionProps {
  title?: string
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onBack: () => void
}

export const NegociacoesSection: React.FC<NegociacoesSectionProps> = ({
  title,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
  onBack,
}) => {
  const [period, setPeriod] = React.useState("Hoje")
  const [startDate, setStartDate] = React.useState("24/07/2026 00:00")
  const [endDate, setEndDate] = React.useState("24/07/2026 23:59")
  const [cliente, setCliente] = React.useState("")
  const [usuario, setUsuario] = React.useState("")
  const [dispositivo, setDispositivo] = React.useState("")
  const [mesa, setMesa] = React.useState("")
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)

  const onBackRef = React.useRef(onBack)
  React.useEffect(() => {
    onBackRef.current = onBack
  }, [onBack])

  React.useEffect(() => {
    setCustomTitle?.(title || "Últimas negociações")
    setCustomBack?.(() => () => onBackRef.current())

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
      setCustomTitle?.(null)
      setCustomBack?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, title])

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

      <Input
        label="Mesa"
        placeholder="Mesa"
        value={mesa}
        onChange={(e) => setMesa(e.target.value)}
      />
    </>
  )

  return (
    <Stack direction="col" gap={5} w="full" flex="1" minH="0">
      <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch" flex="1" minH="0" h="full">
        {/* Painel Esquerdo: Lista de Registros / Estado Vazio */}
        <Box flex="1" w="full" h="full" bg="bg-surface" padding={5} radius="default" direction="col" justify="center" minH="0">
          <EmptyState
            variant="transparent"
            icon={FileText}
            title="Nenhum registro encontrado."
            subtitle=""
          />
        </Box>

        {/* Painel Direito Desktop: FilterPanel Inline */}
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

        {/* Painel Drawer Mobile: FilterPanel dentro de Modal Sidebar */}
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
