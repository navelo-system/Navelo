"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Checkbox } from "@/components/store/base/Checkbox"
import { Button } from "@/components/store/base/Button"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { Check } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
import {
  loadCatalogoOnlineSettings,
  saveCatalogoOnlineSettings,
  CatalogoOnlineDelivery,
} from "@/lib/sync/catalogoOnlineSettings"

export interface OpcoesEntregaSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function DeliveryModesCard({
  retirada,
  onToggleRetirada,
  entrega,
  onToggleEntrega,
  consumirLocal,
  onToggleConsumirLocal,
}: {
  retirada: boolean
  onToggleRetirada: (val: boolean) => void
  entrega: boolean
  onToggleEntrega: (val: boolean) => void
  consumirLocal: boolean
  onToggleConsumirLocal: (val: boolean) => void
}) {
  const s = UI_STRINGS.deliveryOptions
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Stack direction="row" align="start" gap={2.5} w="full">
          <Checkbox checked={retirada} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onToggleRetirada(e.target.checked)} />
          <Stack gap={1} flex="1">
            <Font variant="body-bold" text={s.pickupOptionLabel} />
            <Font variant="description" text={s.pickupOptionDesc} color="muted" />
          </Stack>
        </Stack>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Stack direction="row" align="start" gap={2.5} w="full">
          <Checkbox checked={entrega} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onToggleEntrega(e.target.checked)} />
          <Stack gap={1} flex="1">
            <Font variant="body-bold" text={s.deliveryOptionLabel} />
            <Font variant="description" text={s.deliveryOptionDesc} color="muted" />
          </Stack>
        </Stack>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Stack direction="row" align="start" gap={2.5} w="full">
          <Checkbox checked={consumirLocal} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onToggleConsumirLocal(e.target.checked)} />
          <Stack gap={1} flex="1">
            <Font variant="body-bold" text={s.dineInOptionLabel} />
            <Font variant="description" text={s.dineInOptionDesc} color="muted" />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

function DeliveryFeesToggleCard({
  taxasEntrega,
  onToggleTaxasEntrega,
}: {
  taxasEntrega: boolean
  onToggleTaxasEntrega: (val: boolean) => void
}) {
  const s = UI_STRINGS.deliveryOptions
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack direction="row" align="start" gap={2.5} w="full">
        <Checkbox checked={taxasEntrega} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onToggleTaxasEntrega(e.target.checked)} />
        <Stack gap={1} flex="1">
          <Font variant="body-bold" text={UI_STRINGS.fees.deliveryFeeTitle} />
          <Font variant="description" text={s.deliveryFeeNotice} color="muted" />
        </Stack>
      </Stack>
    </Box>
  )
}

export const OpcoesEntregaSection: React.FC<OpcoesEntregaSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const [initial, setInitial] = React.useState<CatalogoOnlineDelivery>(() => loadCatalogoOnlineSettings().delivery)
  const [draft, setDraft] = React.useState<CatalogoOnlineDelivery>(() => loadCatalogoOnlineSettings().delivery)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)
  const s = UI_STRINGS.deliveryOptions

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
    const full = loadCatalogoOnlineSettings()
    saveCatalogoOnlineSettings({
      ...full,
      delivery: draft,
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
          <DeliveryModesCard
            retirada={draft.retirada}
            onToggleRetirada={(val) => setDraft((p) => ({ ...p, retirada: val }))}
            entrega={draft.entrega}
            onToggleEntrega={(val) => setDraft((p) => ({ ...p, entrega: val }))}
            consumirLocal={draft.consumirLocal}
            onToggleConsumirLocal={(val) => setDraft((p) => ({ ...p, consumirLocal: val }))}
          />
          <DeliveryFeesToggleCard
            taxasEntrega={draft.taxasEntrega}
            onToggleTaxasEntrega={(val) => setDraft((p) => ({ ...p, taxasEntrega: val }))}
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
