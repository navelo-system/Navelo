"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { Icon } from "@/components/store/base/Icon"
import { Button } from "@/components/store/base/Button"
import { Warning } from "@/components/store/base/Warning"
import { Laptop, Server, ChevronRight, CheckCircle } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface CompanySyncFormProps {
  onCancel?: () => void
}

function SyncSettingsCard({
  isEnabled,
  onToggle,
}: {
  isEnabled: boolean
  onToggle: (checked: boolean) => void
}) {
  const cs = UI_STRINGS.companySync
  return (
    <Box bg="bg-white" border={true} borderColor="border-border" radius="default" padding={0} w="full" overflow="hidden">
      <Stack gap={0} w="full">
        <Box padding={5}>
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack gap={1}>
              <Font variant="body-bold" text={cs.enableTitle} />
              <Font variant="description" text={cs.enableDesc} />
            </Stack>
            <Switch checked={isEnabled} onChange={(e) => onToggle(e.target.checked)} />
          </Stack>
        </Box>

        <Box h="h-[1px]" w="full" bg="bg-border" />

        <Box padding={5} cursor="pointer" hoverBg="primary/10" onClick={() => {}}>
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack direction="row" align="center" gap={5}>
              <Icon icon={Laptop} size={20} color="muted" />
              <Stack gap={1}>
                <Font variant="body-bold" text={cs.identificationTitle} />
                <Font variant="description" text={cs.defaultDeviceName} />
              </Stack>
            </Stack>
            <Icon icon={ChevronRight} size={20} color="muted" />
          </Stack>
        </Box>

        <Box h="h-[1px]" w="full" bg="bg-border" />

        <Box padding={5} cursor="pointer" hoverBg="primary/10" onClick={() => {}}>
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack direction="row" align="center" gap={5}>
              <Icon icon={Server} size={20} color="muted" />
              <Stack gap={1}>
                <Font variant="body-bold" text={cs.serverEnvironmentTitle} />
                <Font variant="description" text={cs.cloudEnvironment} />
              </Stack>
            </Stack>
            <Icon icon={ChevronRight} size={20} color="muted" />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

export function CompanySyncForm({ onCancel }: CompanySyncFormProps = {}) {
  const [isEnabled, setIsEnabled] = React.useState(true)
  const cs = UI_STRINGS.companySync

  return (
    <Stack gap={5} w="full">
      <SyncSettingsCard isEnabled={isEnabled} onToggle={setIsEnabled} />
      <Warning
        variant="success"
        icon={CheckCircle}
        title={cs.syncedStatusTitle}
        text={
          <Stack gap={1} w="full">
            <Font variant="description" color="success" text={cs.lastCheckText} align="left" />
            <Font variant="description" color="success" text={cs.lastDataUpdateText} align="left" />
          </Stack>
        }
      />
      <Font variant="description" color="muted" text={cs.syncDisclaimer} />
      {onCancel && (
        <Stack direction="row" justify="end">
          <Button variant="ghost" label={UI_STRINGS.common.back} onClick={onCancel} />
        </Stack>
      )}
    </Stack>
  )
}
