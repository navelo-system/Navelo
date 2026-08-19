"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { Checkbox } from "@/components/store/base/Checkbox"
import { Icon } from "@/components/store/base/Icon"
import {
  LayoutGrid,
  CreditCard,
  QrCode,
  Smartphone,
  Hash,
  ChevronRight,
} from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface AutoatendimentoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  onNavigate: (subView: string) => void
}

function AutoatendimentoProductsCard({ onNavigate }: { onNavigate: (subView: string) => void }) {
  const s = UI_STRINGS.selfService
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" overflow="hidden" w="full">
      <Box padding={2.5} paddingX={5} bg="bg-surface" w="full">
        <Font variant="description" text={s.productsSectionTitle} color="muted" />
      </Box>
      <Box padding={5} cursor="pointer" hoverBg="primary/10" onClick={() => onNavigate("catalogo-produtos")} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={LayoutGrid} size={20} color="primary" />
            <Stack gap={1}>
              <Font variant="body-bold" text={s.productsSectionTitle} />
              <Font variant="description" text={s.productsSelectedDesc} color="muted" />
            </Stack>
          </Stack>
          <Icon icon={ChevronRight} size={16} color="muted" />
        </Stack>
      </Box>
    </Box>
  )
}

function AutoatendimentoPaymentsCard({ onNavigate }: { onNavigate: (subView: string) => void }) {
  const s = UI_STRINGS.selfService
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" overflow="hidden" w="full">
      <Box padding={5} bg="bg-surface" w="full">
        <Stack gap={1} w="full">
          <Font variant="body-bold" text={s.paymentMethodsTitle} />
          <Font variant="description" text={s.paymentMethodsDesc} color="muted" />
        </Stack>
      </Box>
      <Box h="h-[1px]" w="full" bg="bg-border" />
      <Box padding={5} cursor="pointer" hoverBg="primary/10" onClick={() => onNavigate("autoatendimento-cartao")} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={CreditCard} size={20} color="primary" />
            <Stack gap={1}>
              <Font variant="body-bold" text={s.cardTitle} />
              <Font variant="description" text={s.cardDesc} color="muted" />
            </Stack>
          </Stack>
          <Icon icon={ChevronRight} size={16} color="muted" />
        </Stack>
      </Box>
      <Box h="h-[1px]" w="full" bg="bg-border" />
      <Box padding={5} cursor="pointer" hoverBg="primary/10" onClick={() => onNavigate("autoatendimento-pix")} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={QrCode} size={20} color="primary" />
            <Stack gap={1}>
              <Font variant="body-bold" text={s.pixTitle} />
              <Font variant="description" text={s.pixDesc} color="muted" />
            </Stack>
          </Stack>
          <Icon icon={ChevronRight} size={16} color="muted" />
        </Stack>
      </Box>
    </Box>
  )
}

function AutoatendimentoOptionsCard({
  onNavigate,
  habilitarOpcoesEntrega,
  setHabilitarOpcoesEntrega,
}: {
  onNavigate: (subView: string) => void
  habilitarOpcoesEntrega: boolean
  setHabilitarOpcoesEntrega: (v: boolean) => void
}) {
  const s = UI_STRINGS.selfService
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" overflow="hidden" w="full">
      <Box padding={2.5} paddingX={5} bg="bg-surface" w="full">
        <Font variant="description" text={s.optionsSectionTitle} color="muted" />
      </Box>
      <Box padding={5} cursor="pointer" hoverBg="primary/10" onClick={() => onNavigate("autoatendimento-customizacao")} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Smartphone} size={20} color="primary" />
            <Font variant="body-bold" text={s.customizationPdvTitle} />
          </Stack>
          <Icon icon={ChevronRight} size={16} color="muted" />
        </Stack>
      </Box>
      <Box h="h-[1px]" w="full" bg="bg-border" />
      <Box padding={5} cursor="pointer" hoverBg="primary/10" onClick={() => onNavigate("autoatendimento-numero")} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Hash} size={20} color="primary" />
            <Font variant="body-bold" text={s.orderNumberTitle} />
          </Stack>
          <Icon icon={ChevronRight} size={16} color="muted" />
        </Stack>
      </Box>
      <Box h="h-[1px]" w="full" bg="bg-border" />
      <Box padding={5} w="full">
        <Stack direction="row" align="start" gap={2.5} w="full">
          <Checkbox checked={habilitarOpcoesEntrega} onChange={(e) => setHabilitarOpcoesEntrega(e.target.checked)} />
          <Stack gap={1} flex="1">
            <Font variant="body-bold" text={s.enableDeliveryOptionsTitle} />
            <Font variant="description" text={s.enableDeliveryOptionsDesc} color="muted" />
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

export const AutoatendimentoSection: React.FC<AutoatendimentoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  onNavigate,
}) => {
  const [enabled, setEnabled] = React.useState(false)
  const [habilitarOpcoesEntrega, setHabilitarOpcoesEntrega] = React.useState(false)
  const s = UI_STRINGS.selfService

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel, s.title])

  return (
    <Stack gap={5} w="full">
      <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Font variant="body-bold" text={s.enableToggle} />
          <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        </Stack>
      </Box>

      {enabled && (
        <>
          <AutoatendimentoProductsCard onNavigate={onNavigate} />
          <AutoatendimentoPaymentsCard onNavigate={onNavigate} />
          <AutoatendimentoOptionsCard
            onNavigate={onNavigate}
            habilitarOpcoesEntrega={habilitarOpcoesEntrega}
            setHabilitarOpcoesEntrega={setHabilitarOpcoesEntrega}
          />
        </>
      )}
    </Stack>
  )
}
