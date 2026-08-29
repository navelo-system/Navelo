"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Checkbox } from "@/components/store/base/Checkbox"
import { Badge } from "@/components/store/base/Badge"
import { Button } from "@/components/store/base/Button"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { CircularIcon } from "@/components/store/intermediary/CircularIcon"
import { Wallet, QrCode, Check } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
import {
  loadContaDigitalSettings,
  patchContaDigitalSettings,
  CONTA_DIGITAL_SETTINGS_EVENT,
} from "@/lib/sync/contaDigitalSettings"
import {
  loadCatalogoOnlineSettings,
  saveCatalogoOnlineSettings,
  CatalogoOnlinePayments,
} from "@/lib/sync/catalogoOnlineSettings"

export interface FormasPagamentoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function loadFormasPagamentoState(): CatalogoOnlinePayments {
  const cd = loadContaDigitalSettings().enabled
  const current = loadCatalogoOnlineSettings().payments
  return {
    ...current,
    contaDigitalEnabled: cd,
  }
}

function AdvancePaymentMethodsCard({
  contaDigitalEnabled,
  setContaDigitalEnabled,
  pixEnabled,
  setPixEnabled,
}: {
  contaDigitalEnabled: boolean
  setContaDigitalEnabled: (val: boolean) => void
  pixEnabled: boolean
  setPixEnabled: (val: boolean) => void
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
          <Box
            padding={5}
            cursor="pointer"
            hoverBg="secondary/10"
            onClick={() => setContaDigitalEnabled(!contaDigitalEnabled)}
            w="full"
          >
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack direction="row" align="center" gap={2.5}>
                <CircularIcon variant="secondary" icon={Wallet} size={20} />
                <Font variant="body-bold" text={s.digitalAccountTitle} />
              </Stack>
              {contaDigitalEnabled && (
                <>
                  <Box display="hidden md:block">
                    <Badge variant="success" label={s.enabledBadge} icon={Check} />
                  </Box>
                  <Box display="block md:hidden">
                    <Badge variant="success" rounded="full" label="" icon={Check} />
                  </Box>
                </>
              )}
            </Stack>
          </Box>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Box
            padding={5}
            cursor="pointer"
            hoverBg="secondary/10"
            onClick={() => setPixEnabled(!pixEnabled)}
            w="full"
          >
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack direction="row" align="center" gap={2.5} flex="1">
                <CircularIcon variant="secondary" icon={QrCode} size={20} />
                <Stack gap={1} flex="1">
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Font variant="body-bold" text={s.pixTitle} align="left" />
                    {pixEnabled && (
                      <Box display="block md:hidden">
                        <Badge variant="success" label="" icon={Check} />
                      </Box>
                    )}
                  </Stack>
                  <Font variant="description" text={s.pixDesc} color="muted" align="left" />
                </Stack>
              </Stack>
              {pixEnabled && (
                <Box display="hidden md:block">
                  <Badge variant="success" label={s.enabledBadge} icon={Check} />
                </Box>
              )}
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}

function DeliveryPaymentMethodsCard({
  dinheiro,
  setDinheiro,
  cartao,
  setCartao,
  entregaPix,
  setEntregaPix,
}: {
  dinheiro: boolean
  setDinheiro: (val: boolean) => void
  cartao: boolean
  setCartao: (val: boolean) => void
  entregaPix: boolean
  setEntregaPix: (val: boolean) => void
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
          <Box padding={5} w="full">
            <Checkbox label={s.moneyTitle} checked={dinheiro} onChange={(e) => setDinheiro(e.target.checked)} />
          </Box>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Box padding={5} w="full">
            <Checkbox label={s.cardTitle} checked={cartao} onChange={(e) => setCartao(e.target.checked)} />
          </Box>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Box padding={5} w="full">
            <Checkbox label={s.pixDeliveryTitle} checked={entregaPix} onChange={(e) => setEntregaPix(e.target.checked)} />
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}

export const FormasPagamentoSection: React.FC<FormasPagamentoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const [initial, setInitial] = React.useState<CatalogoOnlinePayments>(() => loadFormasPagamentoState())
  const [draft, setDraft] = React.useState<CatalogoOnlinePayments>(() => loadFormasPagamentoState())
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)
  const s = UI_STRINGS.settings.formasPagamento

  React.useEffect(() => {
    const handleSync = () => {
      const fresh = loadFormasPagamentoState()
      setInitial(fresh)
    }
    window.addEventListener(CONTA_DIGITAL_SETTINGS_EVENT, handleSync)
    return () => {
      window.removeEventListener(CONTA_DIGITAL_SETTINGS_EVENT, handleSync)
    }
  }, [])

  const isDirty = React.useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(initial),
    [draft, initial]
  )

  const handleBack = React.useCallback(() => {
    if (isDirty) {
      setIsDiscardModalOpen(true)
    } else {
      onCancel()
    }
  }, [isDirty, onCancel])

  const handleSave = React.useCallback(() => {
    patchContaDigitalSettings({ enabled: draft.contaDigitalEnabled })
    const full = loadCatalogoOnlineSettings()
    saveCatalogoOnlineSettings({
      ...full,
      payments: draft,
    })
    setInitial(draft)
    onCancel()
  }, [draft, onCancel])

  const handleBackRef = React.useRef(handleBack)
  const handleSaveRef = React.useRef(handleSave)

  React.useEffect(() => {
    handleBackRef.current = handleBack
    handleSaveRef.current = handleSave
  }, [handleBack, handleSave])

  React.useEffect(() => {
    setCustomBack?.(() => () => handleBackRef.current())
    setCustomTitle?.(s.title)
    setCustomActions?.(
      <Button
        variant="primary-pill-icon"
        icon={Check}
        onClick={() => handleSaveRef.current()}
      />
    )
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, s.title])

  return (
    <>
      <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
        <Stack gap={5} w="full">
          <AdvancePaymentMethodsCard
            contaDigitalEnabled={draft.contaDigitalEnabled}
            setContaDigitalEnabled={(val) => setDraft((p) => ({ ...p, contaDigitalEnabled: val }))}
            pixEnabled={draft.pixEnabled}
            setPixEnabled={(val) => setDraft((p) => ({ ...p, pixEnabled: val }))}
          />
          <DeliveryPaymentMethodsCard
            dinheiro={draft.dinheiro}
            setDinheiro={(val) => setDraft((p) => ({ ...p, dinheiro: val }))}
            cartao={draft.cartao}
            setCartao={(val) => setDraft((p) => ({ ...p, cartao: val }))}
            entregaPix={draft.entregaPix}
            setEntregaPix={(val) => setDraft((p) => ({ ...p, entregaPix: val }))}
          />
        </Stack>
      </Box>

      {/* Modal de Descarte de Alterações */}
      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          setIsDiscardModalOpen(false)
          onCancel()
        }}
      />
    </>
  )
}
