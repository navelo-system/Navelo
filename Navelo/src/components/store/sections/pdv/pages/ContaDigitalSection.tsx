"use client"

/* eslint-disable max-lines-per-function */

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
  ExternalLink
} from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface ContaDigitalSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const ContaDigitalSection: React.FC<ContaDigitalSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [enabled, setEnabled] = React.useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("navelo_digital_account_config")
        if (saved) return Boolean(JSON.parse(saved).enabled)
      } catch {
        return false
      }
    }
    return false
  })
  const [caixaPix, setCaixaPix] = React.useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("navelo_digital_account_config")
        if (saved) return Boolean(JSON.parse(saved).caixaPix)
      } catch {
        return false
      }
    }
    return false
  })
  const [catalogoCartao, setCatalogoCartao] = React.useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("navelo_digital_account_config")
        if (saved) return Boolean(JSON.parse(saved).catalogoCartao)
      } catch {
        return false
      }
    }
    return false
  })
  const [catalogoPix, setCatalogoPix] = React.useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("navelo_digital_account_config")
        if (saved) return Boolean(JSON.parse(saved).catalogoPix)
      } catch {
        return false
      }
    }
    return false
  })
  const [entregadorPix, setEntregadorPix] = React.useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("navelo_digital_account_config")
        if (saved) return Boolean(JSON.parse(saved).entregadorPix)
      } catch {
        return false
      }
    }
    return false
  })
  const [autoatendimentoPix, setAutoatendimentoPix] = React.useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("navelo_digital_account_config")
        if (saved) return Boolean(JSON.parse(saved).autoatendimentoPix)
      } catch {
        return false
      }
    }
    return false
  })
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
      const config = {
        enabled,
        caixaPix,
        catalogoCartao,
        catalogoPix,
        entregadorPix,
        autoatendimentoPix,
      }
      localStorage.setItem("navelo_digital_account_config", JSON.stringify(config))
      window.dispatchEvent(new Event("digital-account-updated"))
    }
    onCancel()
  }

  return (
    <Stack gap={5} w="full">
      {/* Card Habilitar */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack gap={1}>
              <Font variant="body-bold" text={s.enableToggle} />
              <Font variant="description" text={s.enableDesc} />
            </Stack>
            <Switch
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          </Stack>

          {/* Link de acesso à plataforma */}
          <Box
            bg="bg-surface-sunken"
            border={true}
            borderColor="border-border"
            radius="default"
            padding={2.5}
            w="full"
            display="flex"
            justify="between"
            cursor={enabled ? "pointer" : undefined}
            opacity={enabled ? "100" : "50"}
            onClick={() => {
              if (enabled) {
                window.open("https://contadigital.navelo.com.br", "_blank")
              }
            }}
          >
            <Font variant="body" text={s.accessPlatformButton} color={enabled ? "primary" : "muted"} />
            <Icon icon={ExternalLink} size={16} color={enabled ? "primary" : "muted"} />
          </Box>
        </Stack>
      </Box>

      {/* Card Caixa */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
        opacity={enabled ? "100" : "50"}
      >
        <Stack gap={2.5} w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={ShoppingBag} size={20} color="muted" />
            <Stack gap={2.5}>
              <Font variant="body-bold" text={s.cashierCardTitle} />
              <Font variant="description" text={s.cashierCardDesc} />
            </Stack>
          </Stack>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Box paddingY={1}>
            <Checkbox
              label={s.pixLabel}
              checked={caixaPix}
              onChange={(e) => setCaixaPix(e.target.checked)}
              disabled={!enabled}
            />
          </Box>
        </Stack>
      </Box>

      {/* Card Catálogo Online */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
        opacity={enabled ? "100" : "50"}
      >
        <Stack gap={2.5} w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Globe} size={20} color="muted" />
            <Stack gap={2.5}>
              <Font variant="body-bold" text={s.catalogCardTitle} />
              <Font variant="description" text={s.catalogCardDesc} />
            </Stack>
          </Stack>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Box paddingY={2.5}>
            <Stack gap={2.5}>
              <Checkbox
                label={s.cardLabel}
                checked={catalogoCartao}
                onChange={(e) => setCatalogoCartao(e.target.checked)}
                disabled={!enabled}
              />
              <Checkbox
                label={s.pixLabel}
                checked={catalogoPix}
                onChange={(e) => setCatalogoPix(e.target.checked)}
                disabled={!enabled}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Card Conecta Entregador */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
        opacity={enabled ? "100" : "50"}
      >
        <Stack gap={2.5} w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Package} size={20} color="muted" />
            <Stack gap={1}>
              <Font variant="body-bold" text={s.driverCardTitle} />
              <Font variant="description" text={s.driverCardDesc} />
            </Stack>
          </Stack>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Box paddingY={1}>
            <Checkbox
              label={s.pixLabel}
              checked={entregadorPix}
              onChange={(e) => setEntregadorPix(e.target.checked)}
              disabled={!enabled}
            />
          </Box>
        </Stack>
      </Box>

      {/* Card Autoatendimento */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
        opacity={enabled ? "100" : "50"}
      >
        <Stack gap={2.5} w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Smartphone} size={20} color="muted" />
            <Stack gap={1}>
              <Font variant="body-bold" text={s.selfServiceCardTitle} />
              <Font variant="description" text={s.selfServiceCardDesc} />
            </Stack>
          </Stack>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Box paddingY={1}>
            <Checkbox
              label={s.pixLabel}
              checked={autoatendimentoPix}
              onChange={(e) => setAutoatendimentoPix(e.target.checked)}
              disabled={!enabled}
            />
          </Box>
        </Stack>
      </Box>

      {/* Botões de Ações na Base do Formulário */}
      <FormActions
        confirmLabel={UI_STRINGS.common.save}
        onConfirm={handleSave}
        onCancel={onCancel}
      />
    </Stack>
  )
}
