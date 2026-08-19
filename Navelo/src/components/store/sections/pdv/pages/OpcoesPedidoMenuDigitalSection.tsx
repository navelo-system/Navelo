"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Checkbox } from "@/components/store/base/Checkbox"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Monitor } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface OpcoesPedidoMenuDigitalSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

function OpcoesPedidoMenuDigitalCard({
  aceitarPedidos,
  setAceitarPedidos,
  dispositivo,
  setDispositivo,
}: {
  aceitarPedidos: boolean
  setAceitarPedidos: (v: boolean) => void
  dispositivo: string
  setDispositivo: (v: string) => void
}) {
  const o = UI_STRINGS.orderOptions
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Stack direction="row" align="start" gap={2.5} w="full">
          <Checkbox checked={aceitarPedidos} onChange={(e) => setAceitarPedidos(e.target.checked)} />
          <Stack gap={1} flex="1">
            <Font variant="body-bold" text={UI_STRINGS.digitalMenu.allowOnlineOrdersToggle} />
            <Font variant="description" text={o.allowOnlineOrdersDesc} color="muted" />
          </Stack>
        </Stack>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Stack gap={2.5} w="full">
          <Font variant="description" text={o.deviceReceivingOrdersLabel} color="muted" />
          <CustomSelect value={dispositivo} onChange={setDispositivo} placeholder={o.selectDevicePlaceholder}>
            <CustomSelectItem value="dev-06" text={o.device06} icon={Monitor} />
            <CustomSelectItem value="dev-01" text={o.device01} icon={Monitor} />
            <CustomSelectItem value="dev-caixa" text={o.mainCashierDevice} icon={Monitor} />
          </CustomSelect>
        </Stack>
      </Stack>
    </Box>
  )
}

export const OpcoesPedidoMenuDigitalSection: React.FC<OpcoesPedidoMenuDigitalSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
}) => {
  const [aceitarPedidos, setAceitarPedidos] = React.useState(false)
  const [dispositivo, setDispositivo] = React.useState("dev-06")
  const s = UI_STRINGS.orderOptions

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
      <OpcoesPedidoMenuDigitalCard
        aceitarPedidos={aceitarPedidos}
        setAceitarPedidos={setAceitarPedidos}
        dispositivo={dispositivo}
        setDispositivo={setDispositivo}
      />
      <Box bg="bg-surface" border borderColor="border-border" radius="default" padding={5} w="full">
        <Font variant="description" text={s.deviceReceivingNotice} color="muted" />
      </Box>
      <FormActions confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton} onConfirm={onCancel} onCancel={onCancel} />
    </Stack>
  )
}
