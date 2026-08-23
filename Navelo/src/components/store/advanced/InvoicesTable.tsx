"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Button } from "@/components/store/base/Button"
import { Modal } from "@/components/store/base/Modal"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { FilterPanel, FilterStatusOption } from "@/components/store/intermediary/FilterPanel"
import { FileText, Filter } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface InvoiceItem {
  id: string
  number: string
  supplier: string
  value: number
  key: string
  status: string
}

export interface InvoicesManagerProps {
  invoices?: InvoiceItem[]
  onImportXml?: () => void
  onImportSefaz?: () => void
  onCancel?: () => void
  isFilterDrawerOpen?: boolean
  onCloseFilterDrawer?: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function formatFilterDateTime(d: Date): string {
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
  return { start: formatFilterDateTime(start), end: formatFilterDateTime(end) }
}

function useInvoicesFilterState() {
  const initialDates = React.useMemo(() => getPeriodDates("3M"), [])
  const [period, setPeriod] = React.useState("3M")
  const [startDate, setStartDate] = React.useState(initialDates.start)
  const [endDate, setEndDate] = React.useState(initialDates.end)
  const [selectedStatusIds, setSelectedStatusIds] = React.useState<string[]>([
    "aguardando_xml",
    "entrada_pendente",
    "entrada_realizada",
  ])

  const [appliedFilters, setAppliedFilters] = React.useState({
    period: "3M",
    startDate: initialDates.start,
    endDate: initialDates.end,
    selectedStatusIds: ["aguardando_xml", "entrada_pendente", "entrada_realizada"],
  })

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
    const { start, end } = getPeriodDates(newPeriod)
    setStartDate(start)
    setEndDate(end)
  }

  const handleStatusToggle = (id: string) => {
    setSelectedStatusIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleApplyFilters = () => {
    setAppliedFilters({
      period,
      startDate,
      endDate,
      selectedStatusIds,
    })
  }

  return {
    period, startDate, setStartDate, endDate, setEndDate,
    selectedStatusIds, handleStatusToggle, appliedFilters,
    handlePeriodChange, handleApplyFilters,
  }
}

function InvoicesActionsFooter({
  onImportXml,
  onImportSefaz,
}: {
  onImportXml?: () => void
  onImportSefaz?: () => void
}) {
  const inv = UI_STRINGS.inventory

  return (
    <Stack direction="col" mobileDirection="row" gap={2.5} w="full">
      <Button
        variant="secondary"
        label={inv.importXmlButton}
        fullWidth
        onClick={onImportXml}
      />
      <Button
        variant="primary"
        label={inv.importSefazButton}
        fullWidth
        onClick={onImportSefaz}
      />
    </Stack>
  )
}

function InvoicesMainView({
  onImportXml,
  onImportSefaz,
}: {
  onImportXml?: () => void
  onImportSefaz?: () => void
}) {
  const inv = UI_STRINGS.inventory

  return (
    <Stack
      direction="col"
      justify="between"
      gap={5}
      flex="1"
      h="full"
      w="full"
      minH="0"
    >
      <Box
        flex="1"
        display="flex"
        direction="col"
        w="full"
        minH="0"
      >
        <EmptyState
          icon={FileText}
          title={inv.noInvoicesFound}
          fullHeight
        />
      </Box>

      <InvoicesActionsFooter
        onImportXml={onImportXml}
        onImportSefaz={onImportSefaz}
      />
    </Stack>
  )
}

interface InvoicesHeaderSyncParams {
  onCancel?: () => void
  onOpenDrawer: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function useInvoicesHeaderSync(p: InvoicesHeaderSyncParams) {
  const { onCancel, onOpenDrawer, setCustomBack, setCustomTitle, setCustomActions } = p
  const inv = UI_STRINGS.inventory

  const onCancelRef = React.useRef(onCancel)
  React.useEffect(() => { onCancelRef.current = onCancel }, [onCancel])

  const onOpenDrawerRef = React.useRef(onOpenDrawer)
  React.useEffect(() => { onOpenDrawerRef.current = onOpenDrawer })

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancelRef.current?.())
    setCustomTitle?.(inv.invoicesTitle)
    setCustomActions?.(
      <Box display="block md:hidden">
        <Button variant="primary-pill-icon" icon={Filter} onClick={() => onOpenDrawerRef.current()} />
      </Box>
    )
    return () => { setCustomBack?.(null); setCustomTitle?.(null); setCustomActions?.(null) }
  }, [setCustomBack, setCustomTitle, setCustomActions, inv.invoicesTitle])
}

export function InvoicesTable(props: InvoicesManagerProps) {
  const common = UI_STRINGS.common
  const inv = UI_STRINGS.inventory
  const f = useInvoicesFilterState()
  const [internalDrawerOpen, setInternalDrawerOpen] = React.useState(false)

  const isDrawerOpen = props.isFilterDrawerOpen ?? internalDrawerOpen
  const handleCloseDrawer = props.onCloseFilterDrawer ?? (() => setInternalDrawerOpen(false))
  const handleOpenDrawer = () => setInternalDrawerOpen(true)

  useInvoicesHeaderSync({
    onCancel: props.onCancel,
    onOpenDrawer: handleOpenDrawer,
    setCustomBack: props.setCustomBack,
    setCustomTitle: props.setCustomTitle,
    setCustomActions: props.setCustomActions,
  })

  const statusOptions: FilterStatusOption[] = [
    { id: "aguardando_xml", label: inv.statusAguardandoXml },
    { id: "entrada_pendente", label: inv.statusEntradaPendente },
    { id: "entrada_realizada", label: inv.statusEntradaRealizada },
  ]

  return (
    <Stack direction="col" mobileDirection="row" gap={5} w="full" h="full" align="stretch" flex="1" minH="0">
      <InvoicesMainView
        onImportXml={props.onImportXml}
        onImportSefaz={props.onImportSefaz}
      />

      <Box display="hidden md:flex" direction="col" h="full" minH="0" shrink="0">
        <FilterPanel
          title={common.filter}
          selectedPeriod={f.period}
          onPeriodChange={f.handlePeriodChange}
          startDate={f.startDate}
          onStartDateChange={f.setStartDate}
          endDate={f.endDate}
          onEndDateChange={f.setEndDate}
          statusOptions={statusOptions}
          selectedStatusIds={f.selectedStatusIds}
          onStatusToggle={f.handleStatusToggle}
          onFilter={f.handleApplyFilters}
        />
      </Box>

      <Modal isOpen={isDrawerOpen} onClose={handleCloseDrawer} title={common.filter} variant="sidebar">
        <FilterPanel
          hideTitle
          borderless
          selectedPeriod={f.period}
          onPeriodChange={f.handlePeriodChange}
          startDate={f.startDate}
          onStartDateChange={f.setStartDate}
          endDate={f.endDate}
          onEndDateChange={f.setEndDate}
          statusOptions={statusOptions}
          selectedStatusIds={f.selectedStatusIds}
          onStatusToggle={f.handleStatusToggle}
          onFilter={() => {
            f.handleApplyFilters()
            handleCloseDrawer()
          }}
        />
      </Modal>
    </Stack>
  )
}
