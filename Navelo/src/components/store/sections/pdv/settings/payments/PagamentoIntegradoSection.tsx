"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Icon } from "@/components/store/base/Icon"
import { Modal } from "@/components/store/base/Modal"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import {
  IntegratedPaymentSettings,
  loadIntegratedPaymentSettings,
  saveIntegratedPaymentSettings,
  INTEGRATED_PAYMENT_SETTINGS_EVENT,
} from "@/lib/sync/integratedPaymentSettings"
import {
  patchDeviceSyncSettings,
  DEVICE_SYNC_SETTINGS_EVENT,
} from "@/lib/sync/deviceSyncSettings"
import { CreditCard, Plus, Trash2, Check } from "lucide-react"

export interface PagamentoIntegradoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  type?: "integrated" | "order"
}

function isSettingsDirty(current: IntegratedPaymentSettings, initial: IntegratedPaymentSettings): boolean {
  return JSON.stringify(current) !== JSON.stringify(initial)
}

export const PagamentoIntegradoSection: React.FC<PagamentoIntegradoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
  type = "integrated",
}) => {
  const [initialSettings, setInitialSettings] = React.useState<IntegratedPaymentSettings>(loadIntegratedPaymentSettings)
  const [draft, setDraft] = React.useState<IntegratedPaymentSettings>(initialSettings)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  // Modal: Vincular POS (Pagamento Integrado)
  const [isLinkModalOpen, setIsLinkModalOpen] = React.useState(false)
  const [linkingCodeDraft, setLinkingCodeDraft] = React.useState("")
  const [linkingCodeError, setLinkingCodeError] = React.useState<string | undefined>()

  const isDirty = React.useMemo(() => isSettingsDirty(draft, initialSettings), [draft, initialSettings])
  const pageTitle = type === "integrated" ? "Pagamento Integrado" : "Ordem de Pagamento"

  // Sincronização reativa de eventos externos
  React.useEffect(() => {
    const handleSync = () => {
      const fresh = loadIntegratedPaymentSettings()
      setInitialSettings(fresh)
      setDraft((prev) => (isSettingsDirty(prev, initialSettings) ? prev : fresh))
    }
    window.addEventListener(INTEGRATED_PAYMENT_SETTINGS_EVENT, handleSync)
    window.addEventListener(DEVICE_SYNC_SETTINGS_EVENT, handleSync)
    return () => {
      window.removeEventListener(INTEGRATED_PAYMENT_SETTINGS_EVENT, handleSync)
      window.removeEventListener(DEVICE_SYNC_SETTINGS_EVENT, handleSync)
    }
  }, [initialSettings])

  const handleBack = React.useCallback(() => {
    if (isDirty) {
      setIsDiscardModalOpen(true)
    } else {
      onCancel()
    }
  }, [isDirty, onCancel])

  const handleSave = React.useCallback(() => {
    saveIntegratedPaymentSettings(draft)
    patchDeviceSyncSettings({ deviceName: draft.deviceName })
    setInitialSettings(draft)
    onCancel()
  }, [draft, onCancel])

  React.useEffect(() => {
    setCustomBack?.(() => handleBack)
    setCustomTitle?.(pageTitle)
    setCustomActions?.(
      <Button
        variant="primary-pill-icon"
        icon={Check}
        onClick={handleSave}
      />
    )
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, pageTitle, handleBack, handleSave])

  const handleLinkPos = () => {
    const trimmed = linkingCodeDraft.trim()
    if (!trimmed) {
      setLinkingCodeError("Informe o código de vinculação.")
      return
    }
    setLinkingCodeError(undefined)
    setDraft((prev) => ({
      ...prev,
      linkedPosList: [...prev.linkedPosList, trimmed],
    }))
    setLinkingCodeDraft("")
    setIsLinkModalOpen(false)
  }

  const handleUnlinkPos = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      linkedPosList: prev.linkedPosList.filter((_, i) => i !== index),
    }))
  }

  return (
    <>
      <Stack gap={5} w="full">
        {/* 1. Card Superior: Nome do Dispositivo (Editável Inline) */}
        {type === "integrated" && (
          <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
            <Stack gap={1} w="full">
              <Input
                variant="outlined-label"
                label="Nome deste dispositivo"
                placeholder="Nome do dispositivo"
                value={draft.deviceName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDraft((prev) => ({ ...prev, deviceName: e.target.value }))
                }
              />
              <Font
                variant="description"
                color="muted"
                text='Nome que será exibido no aplicativo "Pagamento Integrado".'
                align="left"
              />
            </Stack>
          </Box>
        )}

        {/* 2. Card Principal: POS's vinculados */}
        <Box
          bg="bg-white"
          border
          borderColor="border-border"
          radius="default"
          padding={5}
          w="full"
          display="flex"
          direction="col"
        >
          <Stack gap={5} w="full" flex="1">
            <Font variant="h4" text="POS's vinculados" align="left" />

            {draft.linkedPosList.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="Nenhum POS vinculado."
                subtitle="Vincule um dispositivo POS para realizar pagamentos."
              />
            ) : (
              <Stack gap={2.5} w="full">
                {draft.linkedPosList.map((pos, idx) => (
                  <Box
                    key={`${pos}-${idx}`}
                    border
                    borderColor="border-border"
                    padding={2.5}
                    radius="default"
                    w="full"
                    bg="surface-sunken"
                  >
                    <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                      <Stack direction="row" align="center" gap={2.5}>
                        <Icon icon={CreditCard} size={18} color="muted" />
                        <Font variant="body-sm-medium" text={`POS código: ${pos}`} />
                      </Stack>
                      <Button
                        variant="ghost"
                        icon={Trash2}
                        onClick={() => handleUnlinkPos(idx)}
                      />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </Box>
      </Stack>

      {/* Botão Flutuante de Ação (FAB +) */}
      <Box position="fixed" bottom="24px" right="24px" zIndex="30">
        <Button
          variant="secondary-pill-icon"
          icon={Plus}
          onClick={() => {
            setLinkingCodeDraft("")
            setLinkingCodeError(undefined)
            setIsLinkModalOpen(true)
          }}
          title="Vincular POS"
        />
      </Box>

      {/* Modal: Pagamento Integrado (Vincular POS) */}
      <Modal
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false)
          setLinkingCodeError(undefined)
        }}
        title="Pagamento Integrado"
        cancelText="Cancelar"
        successText="Vincular"
        showCancelButton
        onSuccess={handleLinkPos}
      >
        <Input
          variant="outlined-label"
          label="Código de vinculação"
          placeholder="Código de vinculação"
          value={linkingCodeDraft}
          error={linkingCodeError}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setLinkingCodeDraft(e.target.value)
            if (linkingCodeError) setLinkingCodeError(undefined)
          }}
          autoFocus
        />
      </Modal>

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
