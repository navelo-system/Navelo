"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Switch } from "@/components/store/base/Switch"
import { Search, Filter } from "lucide-react"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { FilterPanel } from "@/components/store/intermediary/FilterPanel"
import { Modal } from "@/components/store/base/Modal"
import { UI_STRINGS } from "@/constants/strings"

export interface AutorizacoesSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

const CustomCheckbox = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
  <Stack direction="col" mobileDirection="row" gap={5} align="start" mobileAlign="center" justify="start" mobileJustify="between" w="full">
    <Box order="2" mdOrder="1">
      <Font variant="body-sm-medium" text={label} align="left" />
    </Box>
    <Box order="1" mdOrder="2">
      <Switch checked={checked} onChange={onChange} />
    </Box>
  </Stack>
)

function AutorizacoesFilterInputs({
  operator,
  setOperator,
  authorizer,
  setAuthorizer,
  device,
  setDevice,
  showDenied,
  setShowDenied,
}: {
  operator: string
  setOperator: (v: string) => void
  authorizer: string
  setAuthorizer: (v: string) => void
  device: string
  setDevice: (v: string) => void
  showDenied: boolean
  setShowDenied: (v: boolean) => void
}) {
  const s = UI_STRINGS.authorizations
  return (
    <>
      <Input label={s.operatorLabel} placeholder={s.operatorLabel} value={operator} onChange={(e) => setOperator(e.target.value)} />
      <Input label={s.authorizerLabel} placeholder={s.authorizerLabel} value={authorizer} onChange={(e) => setAuthorizer(e.target.value)} />
      <Input label={s.deviceLabel} placeholder={s.deviceLabel} value={device} onChange={(e) => setDevice(e.target.value)} />
      <CustomCheckbox checked={showDenied} onChange={() => setShowDenied(!showDenied)} label={s.showDeniedLabel} />
    </>
  )
}

function formatDateTimeBr(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

function getPeriodDates(period: string): { start: string; end: string } {
  const now = new Date()
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
  const monthsMap: Record<string, number> = { "1M": 1, "3M": 3, "6M": 6, "1A": 12 }
  let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)

  if (period === "7D") {
    start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    start.setHours(0, 0, 0, 0)
  } else if (monthsMap[period]) {
    start = new Date(now.getFullYear(), now.getMonth() - monthsMap[period], now.getDate(), 0, 0, 0)
  }
  return { start: formatDateTimeBr(start), end: formatDateTimeBr(end) }
}

function useAutorizacoesFilterState() {
  const initialDates = React.useMemo(() => getPeriodDates("Hoje"), [])
  const [period, setPeriod] = React.useState("Hoje")
  const [dateStart, setDateStart] = React.useState(initialDates.start)
  const [dateEnd, setDateEnd] = React.useState(initialDates.end)
  const [operator, setOperator] = React.useState("")
  const [authorizer, setAuthorizer] = React.useState("")
  const [device, setDevice] = React.useState("")
  const [showDenied, setShowDenied] = React.useState(false)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)

  const [appliedFilters, setAppliedFilters] = React.useState({
    period: "Hoje",
    dateStart: initialDates.start,
    dateEnd: initialDates.end,
    operator: "",
    authorizer: "",
    device: "",
    showDenied: false,
  })

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
    const { start, end } = getPeriodDates(newPeriod)
    setDateStart(start)
    setDateEnd(end)
  }

  const handleApplyFilters = () => {
    setAppliedFilters({
      period,
      dateStart,
      dateEnd,
      operator,
      authorizer,
      device,
      showDenied,
    })
  }

  return {
    period, dateStart, setDateStart, dateEnd, setDateEnd,
    operator, setOperator, authorizer, setAuthorizer,
    device, setDevice, showDenied, setShowDenied,
    isFilterDrawerOpen, setIsFilterDrawerOpen,
    appliedFilters, handlePeriodChange, handleApplyFilters,
  }
}

export const AutorizacoesSection: React.FC<AutorizacoesSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const s = UI_STRINGS.authorizations
  const f = useAutorizacoesFilterState()

  const onCancelRef = React.useRef(onCancel)
  React.useEffect(() => { onCancelRef.current = onCancel }, [onCancel])

  const onFilterDrawerRef = React.useRef(() => f.setIsFilterDrawerOpen(true))
  React.useEffect(() => { onFilterDrawerRef.current = () => f.setIsFilterDrawerOpen(true) })

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancelRef.current())
    setCustomTitle?.(s.title)
    setCustomActions?.(
      <Box display="block md:hidden">
        <Button variant="primary-pill-icon" icon={Filter} onClick={() => onFilterDrawerRef.current()} />
      </Box>
    )
    return () => { setCustomBack?.(null); setCustomTitle?.(null); setCustomActions?.(null) }
  }, [setCustomBack, setCustomTitle, setCustomActions, s.title])

  const filterInputs = (
    <AutorizacoesFilterInputs
      operator={f.operator} setOperator={f.setOperator}
      authorizer={f.authorizer} setAuthorizer={f.setAuthorizer}
      device={f.device} setDevice={f.setDevice}
      showDenied={f.showDenied} setShowDenied={f.setShowDenied}
    />
  )

  return (
    <Stack direction="col" gap={5} w="full" flex="1" minH="0">
      <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch" flex="1" minH="0" h="full">
        <Box flex="1" w="full" h="full" bg="bg-surface" radius="default" padding={5} direction="col" justify="center" minH="0">
          <EmptyState icon={Search} title={s.emptyTitle} subtitle={s.emptySubtitle} />
        </Box>

        <Box display="hidden md:flex" direction="col" h="full" minH="0" shrink="0">
          <FilterPanel
            title={UI_STRINGS.common.filter}
            selectedPeriod={f.period}
            onPeriodChange={f.handlePeriodChange}
            startDate={f.dateStart}
            onStartDateChange={f.setDateStart}
            endDate={f.dateEnd}
            onEndDateChange={f.setDateEnd}
            onFilter={f.handleApplyFilters}
          >
            {filterInputs}
          </FilterPanel>
        </Box>

        <Modal isOpen={f.isFilterDrawerOpen} onClose={() => f.setIsFilterDrawerOpen(false)} title={UI_STRINGS.common.filter} variant="sidebar">
          <FilterPanel
            hideTitle
            borderless
            selectedPeriod={f.period}
            onPeriodChange={f.handlePeriodChange}
            startDate={f.dateStart}
            onStartDateChange={f.setDateStart}
            endDate={f.dateEnd}
            onEndDateChange={f.setDateEnd}
            onFilter={() => { f.handleApplyFilters(); f.setIsFilterDrawerOpen(false) }}
          >
            {filterInputs}
          </FilterPanel>
        </Modal>
      </Stack>
    </Stack>
  )
}
