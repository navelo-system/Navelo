"use client"


import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Percent, Minus, Plus } from "lucide-react"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { UI_STRINGS } from "@/constants/strings"

export interface CrediarioSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const CrediarioSection: React.FC<CrediarioSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [interestType, setInterestType] = React.useState("Simples")
  const [interestRate, setInterestRate] = React.useState("0,00")
  const [fineRate, setFineRate] = React.useState("0,00")
  const [graceDays, setGraceDays] = React.useState(0)
  const s = UI_STRINGS.crediario

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel, s.title])

  const handleSave = () => {
    // Simulação de salvamento
    onCancel()
  }

  return (
    <Stack gap={5} w="full">
      {/* Card do Formulário de Crediário */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          {/* Tipo de Juros */}
          <Stack gap={2.5} w="full">
            <Font variant="body-bold" text={UI_STRINGS.credit.interestTypeTitle} />
            <CustomSelect
              value={interestType}
              onChange={setInterestType}
            >
              <CustomSelectItem value={UI_STRINGS.credit.simpleOption} text={UI_STRINGS.credit.simpleOption} icon={Percent} />
              <CustomSelectItem value={UI_STRINGS.credit.compoundOption} text={UI_STRINGS.credit.compoundOption} icon={Percent} />
            </CustomSelect>
          </Stack>

          {/* Juros */}
          <Input
            mask="percent"
            label={UI_STRINGS.credit.interestRateLabel}
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />

          {/* Multa */}
          <Input
            mask="percent"
            label={UI_STRINGS.credit.fineRateLabel}
            value={fineRate}
            onChange={(e) => setFineRate(e.target.value)}
          />

          {/* Dias de Carência com Seletor Incremental */}
          <Stack gap={2.5} w="full">
            <Font variant="body-bold" text={UI_STRINGS.credit.graceDaysTitle} />
            <Box
              border={true}
              borderColor="border-border"
              radius="default"
              padding={2.5}
              w="full"
              bg="bg-white"
            >
              <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                <Button
                  variant="primary-icon-xs"
                  icon={Minus}
                  onClick={() => setGraceDays((prev) => Math.max(0, prev - 1))}
                />
                
                <Font variant="body-bold" text={String(graceDays)} />

                <Button
                  variant="primary-icon-xs"
                  icon={Plus}
                  onClick={() => setGraceDays((prev) => prev + 1)}
                />
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Box>

      <FormActions
        confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton}
        onConfirm={handleSave}
        onCancel={onCancel}
      />
    </Stack>
  )
}
