"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { Switch } from "@/components/store/base/Switch"
import { Checkbox } from "@/components/store/base/Checkbox"
import { Icon } from "@/components/store/base/Icon"
import {
  ShoppingBag,
  Globe,
  Package,
  Smartphone,
  ExternalLink,
} from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface ContaDigitalSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

interface DigitalAccountConfig {
  enabled: boolean
  caixaPix: boolean
  catalogoCartao: boolean
  catalogoPix: boolean
  entregadorPix: boolean
  autoatendimentoPix: boolean
}

const STORAGE_KEY = "navelo_digital_account_config"

function loadInitialConfig(): DigitalAccountConfig {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
  }
  return {
    enabled: false,
    caixaPix: false,
    catalogoCartao: false,
    catalogoPix: false,
    entregadorPix: false,
    autoatendimentoPix: false,
  }
}

function ContaDigitalHeaderCard({
  enabled,
  setEnabled,
}: {
  enabled: boolean
  setEnabled: (v: boolean) => void
}) {
  const s = UI_STRINGS.digitalAccount
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack gap={1}>
            <Font variant="body-bold" text={s.enableToggle} />
            <Font variant="description" text={s.enableDesc} />
          </Stack>
          <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        </Stack>

        <Box
          bg="bg-surface-sunken"
          border
          borderColor="border-border"
          radius="default"
          padding={2.5}
          w="full"
          display="flex"
          justify="between"
          cursor={enabled ? "pointer" : undefined}
          opacity={enabled ? "100" : "50"}
          onClick={() => enabled && window.open("https://contadigital.navelo.com.br", "_blank")}
        >
          <Font variant="body" text={s.accessPlatformButton} color={enabled ? "primary" : "muted"} />
          <Icon icon={ExternalLink} size={16} color={enabled ? "primary" : "muted"} />
        </Box>
      </Stack>
    </Box>
  )
}

function ContaDigitalChannelsCard({
  enabled,
  config,
  setConfig,
}: {
  enabled: boolean
  config: DigitalAccountConfig
  setConfig: React.Dispatch<React.SetStateAction<DigitalAccountConfig>>
}) {
  const s = UI_STRINGS.digitalAccount
  const setField = (field: keyof DigitalAccountConfig) => (v: boolean) =>
    setConfig((prev) => ({ ...prev, [field]: v }))

  return (
    <>
      <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full" opacity={enabled ? "100" : "50"}>
        <Stack gap={2.5} w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={ShoppingBag} size={20} color="muted" />
            <Stack gap={2.5}>
              <Font variant="body-bold" text={s.cashierCardTitle} />
              <Font variant="description" text={s.cashierCardDesc} />
            </Stack>
          </Stack>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Checkbox label={s.pixLabel} checked={config.caixaPix} onChange={(e) => setField("caixaPix")(e.target.checked)} disabled={!enabled} />
        </Stack>
      </Box>

      <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full" opacity={enabled ? "100" : "50"}>
        <Stack gap={2.5} w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Globe} size={20} color="muted" />
            <Stack gap={2.5}>
              <Font variant="body-bold" text={s.catalogCardTitle} />
              <Font variant="description" text={s.catalogCardDesc} />
            </Stack>
          </Stack>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Stack gap={2.5}>
            <Checkbox label={s.cardLabel} checked={config.catalogoCartao} onChange={(e) => setField("catalogoCartao")(e.target.checked)} disabled={!enabled} />
            <Checkbox label={s.pixLabel} checked={config.catalogoPix} onChange={(e) => setField("catalogoPix")(e.target.checked)} disabled={!enabled} />
          </Stack>
        </Stack>
      </Box>

      <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full" opacity={enabled ? "100" : "50"}>
        <Stack gap={2.5} w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Package} size={20} color="muted" />
            <Stack gap={1}>
              <Font variant="body-bold" text={s.driverCardTitle} />
              <Font variant="description" text={s.driverCardDesc} />
            </Stack>
          </Stack>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Checkbox label={s.pixLabel} checked={config.entregadorPix} onChange={(e) => setField("entregadorPix")(e.target.checked)} disabled={!enabled} />
        </Stack>
      </Box>

      <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full" opacity={enabled ? "100" : "50"}>
        <Stack gap={2.5} w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Smartphone} size={20} color="muted" />
            <Stack gap={1}>
              <Font variant="body-bold" text={s.selfServiceCardTitle} />
              <Font variant="description" text={s.selfServiceCardDesc} />
            </Stack>
          </Stack>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Checkbox label={s.pixLabel} checked={config.autoatendimentoPix} onChange={(e) => setField("autoatendimentoPix")(e.target.checked)} disabled={!enabled} />
        </Stack>
      </Box>
    </>
  )
}

export const ContaDigitalSection: React.FC<ContaDigitalSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
}) => {
  const [config, setConfig] = React.useState<DigitalAccountConfig>(loadInitialConfig)
  const s = UI_STRINGS.digitalAccount

  const onCancelRef = React.useRef(onCancel)
  React.useEffect(() => {
    onCancelRef.current = onCancel
  }, [onCancel])

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancelRef.current())
    setCustomTitle?.(s.title)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, s.title])

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
      window.dispatchEvent(new Event("digital-account-updated"))
    }
    onCancel()
  }

  return (
    <Stack gap={5} w="full">
      <ContaDigitalHeaderCard
        enabled={config.enabled}
        setEnabled={(v) => setConfig((prev) => ({ ...prev, enabled: v }))}
      />
      <ContaDigitalChannelsCard
        enabled={config.enabled}
        config={config}
        setConfig={setConfig}
      />
      <FormActions confirmLabel={UI_STRINGS.common.save} onConfirm={handleSave} onCancel={onCancel} />
    </Stack>
  )
}
