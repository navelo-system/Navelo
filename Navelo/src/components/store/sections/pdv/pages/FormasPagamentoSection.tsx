"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Checkbox } from "@/components/store/base/Checkbox"
import { Badge } from "@/components/store/base/Badge"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { Icon } from "@/components/store/base/Icon"
import { Wallet, QrCode, Check } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface FormasPagamentoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

function AdvancePaymentMethodsCard({
  contaDigitalEnabled, setContaDigitalEnabled, pixEnabled, setPixEnabled,
}: {
  contaDigitalEnabled: boolean; setContaDigitalEnabled: React.Dispatch<React.SetStateAction<boolean>>
  pixEnabled: boolean; setPixEnabled: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const s = UI_STRINGS.settings.formasPagamento
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Stack gap={1}>
          <Font variant="body-bold" text={s.advancePaymentTitle} />
          <Font variant="description" text={s.advancePaymentDesc} color="muted" />
        </Stack>
        <Box border borderColor="border-border" radius="default" overflow="hidden" w="full">
          <Box padding={5} cursor="pointer" hoverBg="primary/10" onClick={() => setContaDigitalEnabled((prev) => !prev)} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack direction="row" align="center" gap={2.5}>
                <Icon icon={Wallet} size={20} color="primary" />
                <Font variant="body-bold" text={s.digitalAccountTitle} />
              </Stack>
              {contaDigitalEnabled && <Badge variant="success" label={s.enabledBadge} icon={Check} />}
            </Stack>
          </Box>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Box padding={5} cursor="pointer" hoverBg="primary/10" onClick={() => setPixEnabled((prev) => !prev)} w="full">
            <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" w="full" gap={2.5}>
              <Stack direction="row" align="center" gap={2.5} flex="1">
                <Icon icon={QrCode} size={20} color="primary" />
                <Stack gap={1} flex="1">
                  <Font variant="body-bold" text={s.pixTitle} align="left" />
                  <Font variant="description" text={s.pixDesc} color="muted" align="left" />
                </Stack>
              </Stack>
              {pixEnabled && <Box display="flex" justify="end" w="full"><Badge variant="success" label={s.enabledBadge} icon={Check} /></Box>}
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}

function DeliveryPaymentMethodsCard({
  dinheiro, setDinheiro, cartao, setCartao, entregaPix, setEntregaPix,
}: {
  dinheiro: boolean; setDinheiro: React.Dispatch<React.SetStateAction<boolean>>
  cartao: boolean; setCartao: React.Dispatch<React.SetStateAction<boolean>>
  entregaPix: boolean; setEntregaPix: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const s = UI_STRINGS.settings.formasPagamento
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Stack gap={1}>
          <Font variant="body-bold" text={s.deliveryPaymentTitle} />
          <Font variant="description" text={s.deliveryPaymentDesc} color="muted" />
        </Stack>
        <Box border borderColor="border-border" radius="default" overflow="hidden" w="full">
          <Box padding={5} w="full"><Checkbox label={s.moneyTitle} checked={dinheiro} onChange={(e) => setDinheiro(e.target.checked)} /></Box>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Box padding={5} w="full"><Checkbox label={s.cardTitle} checked={cartao} onChange={(e) => setCartao(e.target.checked)} /></Box>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Box padding={5} w="full"><Checkbox label={s.pixDeliveryTitle} checked={entregaPix} onChange={(e) => setEntregaPix(e.target.checked)} /></Box>
        </Box>
      </Stack>
    </Box>
  )
}

export const FormasPagamentoSection: React.FC<FormasPagamentoSectionProps> = ({
  onCancel, setCustomBack, setCustomTitle,
}) => {
  const [dinheiro, setDinheiro] = React.useState(true)
  const [cartao, setCartao] = React.useState(true)
  const [entregaPix, setEntregaPix] = React.useState(true)
  const [contaDigitalEnabled, setContaDigitalEnabled] = React.useState(false)
  const [pixEnabled, setPixEnabled] = React.useState(true)
  const s = UI_STRINGS.settings.formasPagamento

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    return () => { setCustomBack?.(null); setCustomTitle?.(null) }
  }, [setCustomBack, setCustomTitle, onCancel, s.title])

  return (
    <Stack gap={5} w="full">
      <AdvancePaymentMethodsCard
        contaDigitalEnabled={contaDigitalEnabled} setContaDigitalEnabled={setContaDigitalEnabled}
        pixEnabled={pixEnabled} setPixEnabled={setPixEnabled}
      />
      <DeliveryPaymentMethodsCard
        dinheiro={dinheiro} setDinheiro={setDinheiro}
        cartao={cartao} setCartao={setCartao}
        entregaPix={entregaPix} setEntregaPix={setEntregaPix}
      />
      <FormActions confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton} onConfirm={onCancel} onCancel={onCancel} />
    </Stack>
  )
}
