"use client"

/* eslint-disable max-lines-per-function */

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

export const OpcoesPedidoMenuDigitalSection: React.FC<OpcoesPedidoMenuDigitalSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
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

  const handleSave = () => {
    onCancel()
  }

  return (
    <Stack gap={5} w="full">
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          {/* Aceitar pedidos */}
          <Stack direction="row" align="start" gap={2.5} w="full">
            <Checkbox
              checked={aceitarPedidos}
              onChange={(e) => setAceitarPedidos(e.target.checked)}
            />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text={UI_STRINGS.digitalMenu.allowOnlineOrdersToggle} />
              <Font
                variant="description"
                text={UI_STRINGS.orderOptions.allowOnlineOrdersDesc}
                color="muted"
              />
            </Stack>
          </Stack>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Selecionar dispositivo */}
          <Stack gap={2.5} w="full">
            <Font variant="description" text={UI_STRINGS.orderOptions.deviceReceivingOrdersLabel} color="muted" />
            <CustomSelect
              value={dispositivo}
              onChange={(val) => setDispositivo(val)}
              placeholder={UI_STRINGS.orderOptions.selectDevicePlaceholder}
            >
              <CustomSelectItem value="dev-06" text={UI_STRINGS.orderOptions.device06} icon={Monitor} />
              <CustomSelectItem value="dev-01" text={UI_STRINGS.orderOptions.device01} icon={Monitor} />
              <CustomSelectItem value="dev-caixa" text={UI_STRINGS.orderOptions.mainCashierDevice} icon={Monitor} />
            </CustomSelect>
          </Stack>
        </Stack>
      </Box>

      {/* Nota informativa */}
      <Box
        bg="bg-surface"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Font
          variant="description"
          text={UI_STRINGS.orderOptions.deviceReceivingNotice}
          color="muted"
        />
      </Box>

      {/* Botões de Ação */}
      <FormActions
        confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton}
        onConfirm={handleSave}
        onCancel={onCancel}
      />
    </Stack>
  )
}
