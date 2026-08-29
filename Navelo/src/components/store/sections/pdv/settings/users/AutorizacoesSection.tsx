"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Avatar } from "@/components/store/base/Avatar"
import { Badge } from "@/components/store/base/Badge"
import { Search, Filter, ShieldCheck, ShieldAlert } from "lucide-react"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { FilterPanel, FilterStatusOption } from "@/components/store/intermediary/FilterPanel"
import { Modal } from "@/components/store/base/Modal"
import { UI_STRINGS } from "@/constants/strings"
import { db, AuditLog } from "@/lib/dal/db"
import { useLiveQuery } from "dexie-react-hooks"
import { useTenant } from "@/lib/context/TenantContext"

export interface AutorizacoesSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

const STATUS_OPTIONS: FilterStatusOption[] = [
  { id: "ALLOWED", label: "Autorizados" },
  { id: "DENIED", label: "Negados" },
]

function AutorizacoesFilterInputs({
  operator,
  setOperator,
  authorizer,
  setAuthorizer,
  device,
  setDevice,
}: {
  operator: string
  setOperator: (v: string) => void
  authorizer: string
  setAuthorizer: (v: string) => void
  device: string
  setDevice: (v: string) => void
}) {
  const s = UI_STRINGS.authorizations
  return (
    <Stack gap={2.5} w="full">
      <Input label={s.operatorLabel} placeholder={s.operatorLabel} value={operator} onChange={(e) => setOperator(e.target.value)} />
      <Input label={s.authorizerLabel} placeholder={s.authorizerLabel} value={authorizer} onChange={(e) => setAuthorizer(e.target.value)} />
      <Input label={s.deviceLabel} placeholder={s.deviceLabel} value={device} onChange={(e) => setDevice(e.target.value)} />
    </Stack>
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
  const [selectedStatusIds, setSelectedStatusIds] = React.useState<string[]>([])
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)

  const [appliedFilters, setAppliedFilters] = React.useState({
    period: "Hoje",
    dateStart: initialDates.start,
    dateEnd: initialDates.end,
    operator: "",
    authorizer: "",
    device: "",
    selectedStatusIds: [] as string[],
  })

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
    const { start, end } = getPeriodDates(newPeriod)
    setDateStart(start)
    setDateEnd(end)
  }

  const handleStatusToggle = (id: string) => {
    setSelectedStatusIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleApplyFilters = () => {
    setAppliedFilters({
      period,
      dateStart,
      dateEnd,
      operator,
      authorizer,
      device,
      selectedStatusIds,
    })
  }

  return {
    period, dateStart, setDateStart, dateEnd, setDateEnd,
    operator, setOperator, authorizer, setAuthorizer,
    device, setDevice, selectedStatusIds, handleStatusToggle,
    isFilterDrawerOpen, setIsFilterDrawerOpen,
    appliedFilters, handlePeriodChange, handleApplyFilters,
  }
}

function parseBrDateTime(str: string): number | null {
  if (!str) return null
  const parts = str.trim().split(" ")
  if (!parts[0]) return null
  const dateSegments = parts[0].split("/").map(Number)
  if (dateSegments.length < 3) return null
  const [d, m, y] = dateSegments
  let h = 0
  let min = 0
  if (parts[1]) {
    const timeSegments = parts[1].split(":").map(Number)
    h = timeSegments[0] || 0
    min = timeSegments[1] || 0
  }
  const dt = new Date(y, m - 1, d, h, min, 0)
  return dt.getTime()
}

function useFilteredAuditLogs(
  logs: AuditLog[],
  applied: ReturnType<typeof useAutorizacoesFilterState>["appliedFilters"]
) {
  return React.useMemo(() => {
    if (!logs || logs.length === 0) return []

    const startTs = parseBrDateTime(applied.dateStart)
    const endTs = parseBrDateTime(applied.dateEnd)

    return logs.filter((log) => {
      if (log.created_at) {
        const logTs = new Date(log.created_at).getTime()
        if (startTs !== null && logTs < startTs) return false
        if (endTs !== null && logTs > endTs) return false
      }

      if (applied.selectedStatusIds.length > 0) {
        if (!applied.selectedStatusIds.includes(log.status)) return false
      }

      if (applied.operator.trim()) {
        const q = applied.operator.toLowerCase().trim()
        const opName = (log.operator_name || "").toLowerCase()
        if (!opName.includes(q)) return false
      }

      if (applied.authorizer.trim()) {
        const q = applied.authorizer.toLowerCase().trim()
        const authName = (log.authorizer_name || "").toLowerCase()
        if (!authName.includes(q)) return false
      }

      if (applied.device.trim()) {
        const q = applied.device.toLowerCase().trim()
        const dev = (log.device_id || "").toLowerCase()
        if (!dev.includes(q)) return false
      }

      return true
    })
  }, [logs, applied])
}

function AuditLogRow({ log }: { log: AuditLog }) {
  const isAllowed = log.status === "ALLOWED"
  const formattedDate = log.created_at ? formatDateTimeBr(new Date(log.created_at)) : ""

  return (
    <Box w="full" padding={2.5} radius="none" hoverBg="secondary/10">
      <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
        <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
          <Avatar
            icon={isAllowed ? ShieldCheck : ShieldAlert}
            variant={isAllowed ? "primary" : "secondary"}
          />
          <Stack gap={1} align="start" flex="1" minW="0">
            <Font variant="body-bold" text={log.action} />
            <Font
              variant="auxiliary"
              color="muted"
              truncate
              text={`Operador: ${log.operator_name} • Autorizado por: ${log.authorizer_name || "Supervisor"}`}
            />
          </Stack>
        </Stack>

        <Box shrink="0">
          <Stack align="end" gap={1}>
            <Badge
              variant={isAllowed ? "success" : "danger"}
              label={isAllowed ? "AUTORIZADO" : "NEGADO"}
            />
            <Font variant="auxiliary" color="muted" text={formattedDate} />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

function AutorizacoesLayout({
  logs,
  f,
  filterInputs,
}: {
  logs: AuditLog[]
  f: ReturnType<typeof useAutorizacoesFilterState>
  filterInputs: React.ReactNode
}) {
  const s = UI_STRINGS.authorizations
  return (
    <Stack direction="col" gap={5} w="full" flex="1" minH="0">
      <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch" flex="1" minH="0" h="full">
        <Box flex="1" w="full" h="full" direction="col" minH="0" overflow="hidden">
          {logs.length === 0 ? (
            <Box w="full" h="full" direction="col" align="center" justify="center">
              <EmptyState icon={Search} title={s.emptyTitle} subtitle={s.emptySubtitle} />
            </Box>
          ) : (
            <Stack gap={0} w="full" overflow="auto" flex="1">
              {logs.map((log, idx) => (
                <React.Fragment key={log.id}>
                  <AuditLogRow log={log} />
                  {idx < logs.length - 1 && <Box borderBottom borderColor="border-border" w="full" />}
                </React.Fragment>
              ))}
            </Stack>
          )}
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
            statusOptions={STATUS_OPTIONS}
            selectedStatusIds={f.selectedStatusIds}
            onStatusToggle={f.handleStatusToggle}
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
            statusOptions={STATUS_OPTIONS}
            selectedStatusIds={f.selectedStatusIds}
            onStatusToggle={f.handleStatusToggle}
            onFilter={() => { f.handleApplyFilters(); f.setIsFilterDrawerOpen(false) }}
          >
            {filterInputs}
          </FilterPanel>
        </Modal>
      </Stack>
    </Stack>
  )
}

export const AutorizacoesSection: React.FC<AutorizacoesSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id
  const dbLogs = useLiveQuery(
    async () => (tenantId ? await db.audit_logs.where("tenant_id").equals(tenantId).reverse().toArray() : []),
    [tenantId]
  )

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

  const filteredLogs = useFilteredAuditLogs(dbLogs || [], f.appliedFilters)

  const filterInputs = (
    <AutorizacoesFilterInputs
      operator={f.operator} setOperator={f.setOperator}
      authorizer={f.authorizer} setAuthorizer={f.setAuthorizer}
      device={f.device} setDevice={f.setDevice}
    />
  )

  return <AutorizacoesLayout logs={filteredLogs} f={f} filterInputs={filterInputs} />
}

