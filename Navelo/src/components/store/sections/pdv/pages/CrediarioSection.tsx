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

function GraceDaysSelector({
  graceDays, onIncrement, onDecrement,
}: {
  graceDays: number
  onIncrement: () => void
  onDecrement: () => void
}) {
  return (
    <Stack gap={2.5} w="full">
      <Font variant="body-bold" text={UI_STRINGS.credit.graceDaysTitle} />
      <Box border={true} borderColor="border-border" radius="default" padding={2.5} w="full" bg="bg-white">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Button variant="primary-icon-xs" icon={Minus} onClick={onDecrement} />
          <Font variant="body-bold" text={String(graceDays)} />
          <Button variant="primary-icon-xs" icon={Plus} onClick={onIncrement} />
        </Stack>
      </Box>
    </Stack>
  )
}

function CrediarioFormCard({
  interestType, setInterestType, interestRate, setInterestRate, fineRate, setFineRate, graceDays, setGraceDays,
}: {
  interestType: string; setInterestType: (t: string) => void
  interestRate: string; setInterestRate: (r: string) => void
  fineRate: string; setFineRate: (f: string) => void
  graceDays: number; setGraceDays: React.Dispatch<React.SetStateAction<number>>
}) {
  return (
    <Box bg="bg-white" border={true} borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Stack gap={2.5} w="full">
          <Font variant="body-bold" text={UI_STRINGS.credit.interestTypeTitle} />
          <CustomSelect value={interestType} onChange={setInterestType}>
            <CustomSelectItem value={UI_STRINGS.credit.simpleOption} text={UI_STRINGS.credit.simpleOption} icon={Percent} />
            <CustomSelectItem value={UI_STRINGS.credit.compoundOption} text={UI_STRINGS.credit.compoundOption} icon={Percent} />
          </CustomSelect>
        </Stack>
        <Input mask="percent" label={UI_STRINGS.credit.interestRateLabel} value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
        <Input mask="percent" label={UI_STRINGS.credit.fineRateLabel} value={fineRate} onChange={(e) => setFineRate(e.target.value)} />
        <GraceDaysSelector graceDays={graceDays} onIncrement={() => setGraceDays((prev) => prev + 1)} onDecrement={() => setGraceDays((prev) => Math.max(0, prev - 1))} />
      </Stack>
    </Box>
  )
}

export const CrediarioSection: React.FC<CrediarioSectionProps> = ({
  onCancel, setCustomBack, setCustomTitle,
}) => {
  const [interestType, setInterestType] = React.useState("Simples")
  const [interestRate, setInterestRate] = React.useState("0,00")
  const [fineRate, setFineRate] = React.useState("0,00")
  const [graceDays, setGraceDays] = React.useState(0)
  const s = UI_STRINGS.crediario

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    return () => { setCustomBack?.(null); setCustomTitle?.(null) }
  }, [setCustomBack, setCustomTitle, onCancel, s.title])

  return (
    <Stack gap={5} w="full">
      <CrediarioFormCard
        interestType={interestType} setInterestType={setInterestType}
        interestRate={interestRate} setInterestRate={setInterestRate}
        fineRate={fineRate} setFineRate={setFineRate}
        graceDays={graceDays} setGraceDays={setGraceDays}
      />
      <FormActions confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton} onConfirm={onCancel} onCancel={onCancel} />
    </Stack>
  )
}
