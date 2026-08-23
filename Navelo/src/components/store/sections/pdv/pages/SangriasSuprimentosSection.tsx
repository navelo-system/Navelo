"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Modal } from "@/components/store/base/Modal"
import { Input } from "@/components/store/base/Input"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { FilterPanel } from "@/components/store/intermediary/FilterPanel"
import { Package, FileText, Filter } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
import { useCashMovements, dal } from "@/lib/dal"
import { CashMovement } from "@/lib/dal/db"

interface SangriasSuprimentosSectionProps {
  tenantId?: string
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onBack: () => void
}

type PeriodOption = "Hoje" | "7D" | "1M" | "3M" | "6M" | "1A"
type SituationOption = "Concluídas" | "Canceladas" | "Qualquer"

const PERIOD_OPTIONS: PeriodOption[] = ["Hoje", "7D", "1M", "3M", "6M", "1A"]

function formatBRL(v: number): string {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDateShort(dateStr?: string): string {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// ─── Modal de detalhes do movimento ──────────────────────────────────────────

function MovementDetailModal({
  movement,
  onClose,
  onDelete,
}: {
  movement: CashMovement | null
  onClose: () => void
  onDelete: (id: string) => void
}) {
  const s = UI_STRINGS.sangrias
  if (!movement) return null

  const isSupply = movement.type === "SUPPLY"
  const title = isSupply ? s.infoSupplyTitle : s.infoBleedTitle
  const deleteLabel = isSupply ? s.deleteSupplyButton : s.deleteBleedButton

  return (
    <Modal
      isOpen={Boolean(movement)}
      onClose={onClose}
      title={title}
      variant="default"
      showCancelButton={true}
      cancelText={s.backButton}
      cancelVariant="secondary"
      successText={deleteLabel}
      onSuccess={() => onDelete(movement.id)}
    >
      <Stack gap={5} w="full" align="start">
        <Stack gap={1} align="start" w="full">
          <Font variant="body-bold" text={s.dateLabel} />
          <Font variant="body" text={formatDateShort(movement.created_at)} />
        </Stack>
        <Stack gap={1} align="start" w="full">
          <Font variant="body-bold" text={s.valueLabel} />
          <Font variant="body" text={`R$ ${formatBRL(movement.amount)}`} />
        </Stack>
        <Stack gap={1} align="start" w="full">
          <Font variant="body-bold" text={s.observationLabel} />
          <Font variant="body" text={movement.description || "—"} />
        </Stack>
      </Stack>
    </Modal>
  )
}

// ─── Linha da lista de movimentos ────────────────────────────────────────────

function SangriasListRow({
  movement,
  onClick,
}: {
  movement: CashMovement
  onClick: () => void
}) {
  const s = UI_STRINGS.sangrias
  const isBleed = movement.type === "BLEED"
  const isSupply = movement.type === "SUPPLY"
  const typeName = isSupply ? s.supplyTitle : isBleed ? s.bleedTitle : "Movimento"
  const valFormatted = `${isBleed ? "-" : ""}R$ ${formatBRL(movement.amount)}`

  return (
    <Box padding={2.5} w="full" cursor="pointer" hoverBg="secondary/10" onClick={onClick}>
      <Stack gap={1} w="full">
        <Stack direction="row" align="center" justify="between" w="full">
          <Stack direction="row" gap={2.5} align="center">
            <Font variant="body-sm-medium" text={formatDateShort(movement.created_at)} />
            <Font variant="body-sm-medium" color="muted" text={typeName} />
          </Stack>
          <Font variant="body-bold" color={isBleed ? "danger" : "primary"} text={valFormatted} />
        </Stack>
        {movement.description && (
          <Stack gap={0} align="start" w="full">
            <Font variant="auxiliary" color="muted" text={s.observationLabel} />
            <Font variant="body-sm-medium" text={movement.description} />
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

// ─── Lista de movimentos + rodapé com saldo ──────────────────────────────────

function SangriasMovementsList({
  movements,
  totalBalance,
  onSelectMovement,
}: {
  movements: CashMovement[]
  totalBalance: number
  onSelectMovement: (m: CashMovement) => void
}) {
  const s = UI_STRINGS.sangrias
  return (
    <Stack direction="col" flex="1" h="full" minH="0" gap={0} w="full">
      <Box flex="1" overflow="x-hidden y-auto" minH="0" w="full">
        {movements.length === 0 ? (
          <EmptyState icon={Package} title={s.emptyTitle} subtitle={s.emptySubtitle} />
        ) : (
          <Box display="flex" direction="col" w="full">
            {movements.map((m, idx) => (
              <Box key={m.id}>
                <SangriasListRow movement={m} onClick={() => onSelectMovement(m)} />
                {idx < movements.length - 1 && <Box borderBottom borderColor="border-border" w="full" />}
              </Box>
            ))}
          </Box>
        )}
      </Box>
      <Box w="full" shrink="0" padding={2.5} borderTop borderColor="border-border">
        <Stack direction="row" gap={2.5} align="center" justify="between" w="full">
          <Box flex="1" bg="bg-white" padding={2.5} radius="default" border borderColor="border-border">
            <Stack gap={0} align="start">
              <Font variant="auxiliary" color="muted" text={s.filteredBalanceLabel} />
              <Font
                variant="body-bold"
                color={totalBalance < 0 ? "danger" : "primary"}
                text={`${totalBalance < 0 ? "-" : ""}R$ ${formatBRL(Math.abs(totalBalance))}`}
              />
            </Stack>
          </Box>
          <Button variant="primary-pill-icon" icon={FileText} title={s.exportButton} onClick={() => {}} />
        </Stack>
      </Box>
    </Stack>
  )
}

// ─── Filtros extras (usuário, dispositivo, situação) passados via children ───

function SangriasFilterChildren({
  userFilter,
  setUserFilter,
  deviceFilter,
  setDeviceFilter,
  selectedSituation,
  setSelectedSituation,
}: {
  userFilter: string
  setUserFilter: (v: string) => void
  deviceFilter: string
  setDeviceFilter: (v: string) => void
  selectedSituation: SituationOption
  setSelectedSituation: (v: SituationOption) => void
}) {
  const s = UI_STRINGS.sangrias
  const situationOptions: SituationOption[] = [s.completedPill, s.canceledPill, s.anyPill]

  return (
    <>
      <Input
        variant="outlined-label"
        label={s.userLabel}
        placeholder={s.userPlaceholder}
        value={userFilter}
        onChange={(e) => setUserFilter(e.target.value)}
      />
      <Input
        variant="outlined-label"
        label={s.deviceLabel}
        placeholder={s.devicePlaceholder}
        value={deviceFilter}
        onChange={(e) => setDeviceFilter(e.target.value)}
      />
      <Stack gap={2.5} w="full">
        <Font variant="auxiliary" color="muted" text={s.situationLabel} />
        <Stack direction="row" gap={1} wrap={true} w="full">
          {situationOptions.map((opt) => (
            <Button
              key={opt}
              variant={selectedSituation === opt ? "primary-pill-xs" : "outline-pill-xs"}
              label={opt}
              onClick={() => setSelectedSituation(opt)}
              type="button"
            />
          ))}
        </Stack>
      </Stack>
    </>
  )
}

// ─── Hook de estado dos filtros ───────────────────────────────────────────────

function useSangriasFilterState() {
  const [period, setPeriod] = React.useState<PeriodOption>("Hoje")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [userFilter, setUserFilter] = React.useState("")
  const [deviceFilter, setDeviceFilter] = React.useState("")
  const [selectedSituation, setSelectedSituation] = React.useState<SituationOption>("Qualquer")
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)
  const [appliedUserFilter, setAppliedUserFilter] = React.useState("")

  const handleApplyFilters = () => {
    setAppliedUserFilter(userFilter)
  }

  return {
    period, setPeriod,
    startDate, setStartDate,
    endDate, setEndDate,
    userFilter, setUserFilter,
    deviceFilter, setDeviceFilter,
    selectedSituation, setSelectedSituation,
    isFilterDrawerOpen, setIsFilterDrawerOpen,
    appliedUserFilter,
    handleApplyFilters,
  }
}

// ─── Hook de filtragem ────────────────────────────────────────────────────────

function useFilteredMovements(allMovements: CashMovement[] | undefined, userFilter: string) {
  return React.useMemo(() => {
    if (!allMovements) return []
    return allMovements.filter((m) => {
      if (m.type !== "BLEED" && m.type !== "SUPPLY") return false
      if (userFilter.trim() && m.operator_name && !m.operator_name.toLowerCase().includes(userFilter.toLowerCase())) {
        return false
      }
      return true
    })
  }, [allMovements, userFilter])
}

// ─── Componente principal ─────────────────────────────────────────────────────

export const SangriasSuprimentosSection: React.FC<SangriasSuprimentosSectionProps> = ({
  tenantId, setCustomBack, setCustomTitle, setCustomActions, onBack,
}) => {
  const s = UI_STRINGS.sangrias
  const allMovements = useCashMovements(tenantId)
  const [selectedMovement, setSelectedMovement] = React.useState<CashMovement | null>(null)
  const f = useSangriasFilterState()

  const onBackRef = React.useRef(onBack)
  const onFilterDrawerRef = React.useRef(() => f.setIsFilterDrawerOpen(true))
  React.useEffect(() => { onBackRef.current = onBack }, [onBack])
  React.useEffect(() => { onFilterDrawerRef.current = () => f.setIsFilterDrawerOpen(true) })

  React.useEffect(() => {
    setCustomTitle?.(s.sectionTitle)
    setCustomBack?.(() => () => onBackRef.current())
    setCustomActions?.(
      <Box display="block md:hidden">
        <Button variant="primary-pill-icon" icon={Filter} onClick={() => onFilterDrawerRef.current()} />
      </Box>
    )
    return () => { setCustomTitle?.(null); setCustomBack?.(null); setCustomActions?.(null) }
  }, [setCustomBack, setCustomTitle, setCustomActions, s.sectionTitle])

  const filteredMovements = useFilteredMovements(allMovements, f.appliedUserFilter)

  const totalBalance = React.useMemo(() => {
    return filteredMovements.reduce((acc, m) => {
      if (m.type === "SUPPLY") return acc + m.amount
      if (m.type === "BLEED") return acc - m.amount
      return acc
    }, 0)
  }, [filteredMovements])

  const handleDeleteMovement = async (id: string) => {
    await dal.cashMovements.delete(id, tenantId)
    setSelectedMovement(null)
  }

  const filterChildren = (
    <SangriasFilterChildren
      userFilter={f.userFilter}
      setUserFilter={f.setUserFilter}
      deviceFilter={f.deviceFilter}
      setDeviceFilter={f.setDeviceFilter}
      selectedSituation={f.selectedSituation}
      setSelectedSituation={f.setSelectedSituation}
    />
  )

  return (
    <>
      <Stack direction="col" mobileDirection="row" gap={5} w="full" h="full" align="stretch" flex="1" minH="0" overflow="hidden">
        {/* Lista — flex 1, 50% em desktop */}
        <Stack direction="col" flex="1" h="full" minH="0" gap={0} w="full">
          <SangriasMovementsList
            movements={filteredMovements}
            totalBalance={totalBalance}
            onSelectMovement={setSelectedMovement}
          />
        </Stack>

        {/* Painel de filtros — visível apenas em desktop (md+), largura fixa pelo FilterPanel */}
        <Box display="hidden md:flex" direction="col" h="full" minH="0" shrink="0">
          <FilterPanel
            title={s.filtersTitle}
            periodOptions={PERIOD_OPTIONS}
            selectedPeriod={f.period}
            onPeriodChange={(p) => f.setPeriod(p as PeriodOption)}
            startDate={f.startDate}
            onStartDateChange={f.setStartDate}
            endDate={f.endDate}
            onEndDateChange={f.setEndDate}
            onFilter={f.handleApplyFilters}
          >
            {filterChildren}
          </FilterPanel>
        </Box>

        {/* Drawer de filtros para mobile */}
        <Modal
          isOpen={f.isFilterDrawerOpen}
          onClose={() => f.setIsFilterDrawerOpen(false)}
          title={s.filtersTitle}
          variant="sidebar"
        >
          <FilterPanel
            hideTitle
            borderless
            periodOptions={PERIOD_OPTIONS}
            selectedPeriod={f.period}
            onPeriodChange={(p) => f.setPeriod(p as PeriodOption)}
            startDate={f.startDate}
            onStartDateChange={f.setStartDate}
            endDate={f.endDate}
            onEndDateChange={f.setEndDate}
            onFilter={() => { f.handleApplyFilters(); f.setIsFilterDrawerOpen(false) }}
          >
            {filterChildren}
          </FilterPanel>
        </Modal>
      </Stack>

      {/* Modal de detalhes do item */}
      <MovementDetailModal
        movement={selectedMovement}
        onClose={() => setSelectedMovement(null)}
        onDelete={handleDeleteMovement}
      />
    </>
  )
}
