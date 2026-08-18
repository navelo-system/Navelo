"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { Switch } from "@/components/store/base/Switch"
import { Checkbox } from "@/components/store/base/Checkbox"
import { Icon } from "@/components/store/base/Icon"
import { IFoodActivationModal } from "@/components/store/sections/pdv/modals/IFoodActivationModal"
import { Ban, BookOpen, RefreshCw, Trash2, ChevronRight } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface IFoodSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const IFoodSection: React.FC<IFoodSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [enabled, setEnabled] = React.useState(false)
  const [autoAccept, setAutoAccept] = React.useState(false)
  const [notification, setNotification] = React.useState(false)
  const [soundAlert, setSoundAlert] = React.useState(false)
  const [continuousSound, setContinuousSound] = React.useState(false)
  const s = UI_STRINGS.ifood

  // Activation modal state
  const [isActivationModalOpen, setIsActivationModalOpen] = React.useState(false)

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

  const handleCancelActivation = () => {
    setIsActivationModalOpen(false)
  }

  return (
    <Stack gap={5} w="full">
      {/* Card Único iFood */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          {/* Habilitar Integração */}
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack gap={1}>
              <Font variant="body-bold" text={s.title} />
            </Stack>
            <Switch
              checked={enabled}
              onChange={(e) => {
                const targetChecked = e.target.checked
                if (targetChecked) {
                  setIsActivationModalOpen(true)
                } else {
                  setEnabled(false)
                  setAutoAccept(false)
                  setNotification(false)
                  setSoundAlert(false)
                  setContinuousSound(false)
                }
              }}
            />
          </Stack>

          {/* Aviso quando desabilitado */}
          {!enabled && (
            <Stack direction="row" align="center" gap={2.5} w="full">
              <Icon icon={Ban} size={16} color="muted" />
              <Font
                variant="description"
                text={s.disabledNotice}
              />
            </Stack>
          )}

          {/* Aceitar Pedidos Automaticamente */}
          <Box opacity={enabled ? "100" : "50"}>
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack gap={1}>
                <Font variant="body-bold" text={s.autoAcceptToggle} />
                <Font
                  variant="description"
                  text={s.autoAcceptDesc}
                />
              </Stack>
              <Switch
                checked={autoAccept}
                onChange={(e) => setAutoAccept(e.target.checked)}
                disabled={!enabled}
              />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Seção Opções */}
          <Box w="full" opacity={enabled ? "100" : "50"}>
            <Stack gap={2.5} w="full">
              <Font variant="body-bold" text={s.optionsTitle} />

              {/* Item Cardápio */}
              <Box
                padding={2.5}
                w="full"
                cursor={enabled ? "pointer" : undefined}
                onClick={() => {
                  if (enabled) {
                    // Ação cardápio
                  }
                }}
              >
                <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
                  <Stack direction="row" align="center" gap={2.5}>
                    <Icon icon={BookOpen} size={16} color="muted" />
                    <Font variant="body" text={s.menuItemTitle} />
                  </Stack>
                  <Icon icon={ChevronRight} size={16} color="muted" />
                </Stack>
              </Box>

              {/* Item Sincronizar */}
              <Box
                padding={2.5}
                w="full"
                cursor={enabled ? "pointer" : undefined}
                onClick={() => {
                  if (enabled) {
                    // Ação sincronizar
                  }
                }}
              >
                <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
                  <Stack direction="row" align="center" gap={2.5}>
                    <Icon icon={RefreshCw} size={16} color="muted" />
                    <Font variant="body" text={s.syncMenuTitle} />
                  </Stack>
                  <Icon icon={ChevronRight} size={16} color="muted" />
                </Stack>
              </Box>

              {/* Item Limpar */}
              <Box
                padding={2.5}
                w="full"
                cursor={enabled ? "pointer" : undefined}
                onClick={() => {
                  if (enabled) {
                    // Ação limpar
                  }
                }}
              >
                <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
                  <Stack direction="row" align="center" gap={2.5}>
                    <Icon icon={Trash2} size={16} color="muted" />
                    <Font variant="body" text={s.cleanMenuTitle} />
                  </Stack>
                  <Icon icon={ChevronRight} size={16} color="muted" />
                </Stack>
              </Box>
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Opções de Notificação */}
          <Box w="full" opacity={enabled ? "100" : "50"}>
            <Stack gap={5} w="full">
              <Checkbox
                label={s.notificationCheckboxLabel}
                checked={notification}
                onChange={(e) => setNotification(e.target.checked)}
                disabled={!enabled}
              />
              <Box paddingX={5}>
                <Font
                  variant="description"
                  text={s.notificationDesc}
                />
              </Box>

              <Checkbox
                label={s.soundAlertCheckboxLabel}
                checked={soundAlert}
                onChange={(e) => setSoundAlert(e.target.checked)}
                disabled={!enabled}
              />
              <Box paddingX={5}>
                <Font
                  variant="description"
                  text={s.soundAlertDesc}
                />
              </Box>

              {/* Aviso Sonoro Contínuo (Aninhado) */}
              <Box paddingX={5} opacity={enabled && soundAlert ? "100" : "50"}>
                <Stack direction="row" gap={2.5} align="start" w="full">
                  {/* Linha vertical decorativa */}
                  <Box w="[2px]" h="[32px]" bg="bg-border" shrink="0" />

                  <Stack gap={1} flex="1">
                    <Checkbox
                      label={s.continuousSoundCheckboxLabel}
                      checked={continuousSound}
                      onChange={(e) => setContinuousSound(e.target.checked)}
                      disabled={!enabled || !soundAlert}
                    />
                    <Box paddingX={5}>
                      <Font
                        variant="description"
                        text={s.continuousSoundDesc}
                      />
                    </Box>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <FormActions
        confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton}
        onConfirm={handleSave}
        onCancel={onCancel}
      />

      {/* Modal de Ativação do iFood */}
      <IFoodActivationModal
        isOpen={isActivationModalOpen}
        onClose={handleCancelActivation}
        onActivate={() => {
          setEnabled(true)
          setIsActivationModalOpen(false)
        }}
      />
    </Stack>
  )
}
