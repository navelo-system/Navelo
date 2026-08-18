"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Checkbox } from "@/components/store/base/Checkbox"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { UI_STRINGS } from "@/constants/strings"

export interface OpcoesEntregaSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const OpcoesEntregaSection: React.FC<OpcoesEntregaSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [retirada, setRetirada] = React.useState(true)
  const [entrega, setEntrega] = React.useState(true)
  const [consumirLocal, setConsumirLocal] = React.useState(false)
  const [taxasEntrega, setTaxasEntrega] = React.useState(false)
  const s = UI_STRINGS.deliveryOptions

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
      {/* Card 1: Modos de Entrega */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          {/* Retirada */}
          <Stack direction="row" align="start" gap={2.5} w="full">
            <Checkbox
              checked={retirada}
              onChange={(e) => setRetirada(e.target.checked)}
            />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text={s.pickupOptionLabel} />
              <Font
                variant="description"
                text={s.pickupOptionDesc}
                color="muted"
              />
            </Stack>
          </Stack>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Entrega */}
          <Stack direction="row" align="start" gap={2.5} w="full">
            <Checkbox
              checked={entrega}
              onChange={(e) => setEntrega(e.target.checked)}
            />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text={s.deliveryOptionLabel} />
              <Font
                variant="description"
                text={s.deliveryOptionDesc}
                color="muted"
              />
            </Stack>
          </Stack>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Consumir no local */}
          <Stack direction="row" align="start" gap={2.5} w="full">
            <Checkbox
              checked={consumirLocal}
              onChange={(e) => setConsumirLocal(e.target.checked)}
            />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text={s.dineInOptionLabel} />
              <Font
                variant="description"
                text={s.dineInOptionDesc}
                color="muted"
              />
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Card 2: Taxas */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack direction="row" align="start" gap={2.5} w="full">
          <Checkbox
            checked={taxasEntrega}
            onChange={(e) => setTaxasEntrega(e.target.checked)}
          />
          <Stack gap={1} flex="1">
            <Font variant="body-bold" text={UI_STRINGS.fees.deliveryFeeTitle} />
            <Font
              variant="description"
              text={s.deliveryFeeNotice}
              color="muted"
            />
          </Stack>
        </Stack>
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
