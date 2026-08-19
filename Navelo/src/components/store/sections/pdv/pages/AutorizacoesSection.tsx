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

export const AutorizacoesSection: React.FC<AutorizacoesSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const s = UI_STRINGS.authorizations
  const [operator, setOperator] = React.useState("")
  const [authorizer, setAuthorizer] = React.useState("")
  const [device, setDevice] = React.useState("")
  const [showDenied, setShowDenied] = React.useState(false)
  const [period, setPeriod] = React.useState("Hoje")
  const [dateStart, setDateStart] = React.useState("01/01/2026 00:00")
  const [dateEnd, setDateEnd] = React.useState("01/01/2026 23:59")
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    setCustomActions?.(
      <Box display="block md:hidden">
        <Button variant="primary-pill-icon" icon={Filter} onClick={() => setIsFilterDrawerOpen(true)} />
      </Box>
    )
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, onCancel, s.title])

  const filterInputs = (
    <AutorizacoesFilterInputs
      operator={operator}
      setOperator={setOperator}
      authorizer={authorizer}
      setAuthorizer={setAuthorizer}
      device={device}
      setDevice={setDevice}
      showDenied={showDenied}
      setShowDenied={setShowDenied}
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
            selectedPeriod={period}
            onPeriodChange={setPeriod}
            startDate={dateStart}
            onStartDateChange={setDateStart}
            endDate={dateEnd}
            onEndDateChange={setDateEnd}
            onFilter={() => {}}
          >
            {filterInputs}
          </FilterPanel>
        </Box>

        <Modal isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)} title={UI_STRINGS.common.filter} variant="sidebar">
          <FilterPanel
            hideTitle
            borderless
            selectedPeriod={period}
            onPeriodChange={setPeriod}
            startDate={dateStart}
            onStartDateChange={setDateStart}
            endDate={dateEnd}
            onEndDateChange={setDateEnd}
            onFilter={() => setIsFilterDrawerOpen(false)}
          >
            {filterInputs}
          </FilterPanel>
        </Modal>
      </Stack>
    </Stack>
  )
}
