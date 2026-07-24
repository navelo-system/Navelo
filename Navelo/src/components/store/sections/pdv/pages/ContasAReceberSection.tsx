"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { FilterPanel } from "@/components/store/intermediary/FilterPanel"
import { Modal } from "@/components/store/base/Modal"
import { PackageSearch, Filter } from "lucide-react"

export interface ContasAReceberSectionProps {
  onBackToDashboard: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

export const ContasAReceberSection: React.FC<ContasAReceberSectionProps> = ({
  onBackToDashboard,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const [period, setPeriod] = React.useState("Hoje")
  const [periodType, setPeriodType] = React.useState<"Emissão" | "Vencimento" | "Liquidação">("Emissão")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [cliente, setCliente] = React.useState("")
  const [dispositivo, setDispositivo] = React.useState("")
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)

  const onBackToDashboardRef = React.useRef(onBackToDashboard)
  React.useEffect(() => {
    onBackToDashboardRef.current = onBackToDashboard
  }, [onBackToDashboard])

  React.useEffect(() => {
    setCustomBack?.(() => () => onBackToDashboardRef.current())
    setCustomTitle?.("Contas a receber")
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

  const periodTypes: Array<"Emissão" | "Vencimento" | "Liquidação"> = [
    "Emissão", "Vencimento", "Liquidação"
  ]

  const renderFilterInputs = () => (
    <>
      {/* Tipo de Período */}
      <Stack gap={2.5} w="full">
        <Font variant="auxiliary" color="muted" text="Tipo de período" />
        <Stack direction="row" wrap gap={2.5} w="full">
          {periodTypes.map((pt) => (
            <Button
              key={pt}
              variant={periodType === pt ? "primary-pill-xs" : "outline-pill-xs"}
              label={pt}
              onClick={() => setPeriodType(pt)}
              type="button"
            />
          ))}
        </Stack>
      </Stack>

      <Input
        label="Cliente"
        placeholder="Cliente"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
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
    <Stack direction="col" gap={5} w="full" flex="1" minH="0">
      <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch" flex="1" minH="0" h="full">
        {/* Painel Esquerdo: Lista Vazia */}
        <Box flex="1" w="full" h="full" bg="bg-surface" padding={5} radius="default" direction="col" justify="center" minH="0">
          <EmptyState
            variant="transparent"
            icon={PackageSearch}
            title="Nenhum registro encontrado."
            subtitle="Utilize os filtros ao lado para pesquisar lançamentos de contas a receber."
          />
        </Box>

        {/* Sidebar Direita Desktop: FilterPanel Inline */}
        <Box display="hidden md:block">
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
