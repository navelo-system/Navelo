"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Switch } from "@/components/store/base/Switch"
import { Checkbox } from "@/components/store/base/Checkbox"
import { Icon } from "@/components/store/base/Icon"
import { IFoodActivationModal } from "@/components/store/sections/pdv/modals/IFoodActivationModal"
import { Ban, BookOpen, RefreshCw, Trash2, ChevronRight } from "lucide-react"

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

  // Activation modal state
  const [isActivationModalOpen, setIsActivationModalOpen] = React.useState(false)

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("iFood")
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel])

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
              <Font variant="body-bold" text="Habilitar integração com o iFood" />
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
                text="Habilite a integração com o iFood para buscar as informações do restaurante."
              />
            </Stack>
          )}

          {/* Aceitar Pedidos Automaticamente */}
          <Box opacity={enabled ? "100" : "50"}>
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack gap={1}>
                <Font variant="body-bold" text="Aceitar pedidos automaticamente" />
                <Font
                  variant="description"
                  text="Quando ativo, todos os pedidos não agendados serão confirmados automaticamente."
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
              <Font variant="body-bold" text="Opções" />

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
                    <Font variant="body" text="Cardápio" />
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
                    <Font variant="body" text="Sincronizar cardápio" />
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
                    <Font variant="body" text="Limpar cardápio no iFood" />
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
                label="Notificação"
                checked={notification}
                onChange={(e) => setNotification(e.target.checked)}
                disabled={!enabled}
              />
              <Box paddingX={5}>
                <Font
                  variant="description"
                  text="Receberá uma notificação quando um novo pedido for recebido do iFood."
                />
              </Box>

              <Checkbox
                label="Habilitar aviso sonoro"
                checked={soundAlert}
                onChange={(e) => setSoundAlert(e.target.checked)}
                disabled={!enabled}
              />
              <Box paddingX={5}>
                <Font
                  variant="description"
                  text="Será emitido um aviso sonoro quando um novo pedido for recebido do iFood."
                />
              </Box>

              {/* Aviso Sonoro Contínuo (Aninhado) */}
              <Box paddingX={5} opacity={enabled && soundAlert ? "100" : "50"}>
                <Stack direction="row" gap={2.5} align="start" w="full">
                  {/* Linha vertical decorativa */}
                  <Box w="[2px]" h="[32px]" bg="bg-border" shrink="0" />

                  <Stack gap={1} flex="1">
                    <Checkbox
                      label="Aviso sonoro contínuo"
                      checked={continuousSound}
                      onChange={(e) => setContinuousSound(e.target.checked)}
                      disabled={!enabled || !soundAlert}
                    />
                    <Box paddingX={5}>
                      <Font
                        variant="description"
                        text='O aviso sonoro será contínuo até que o pedido seja alterado para "Aberto" ou excluído.'
                      />
                    </Box>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Botões de Ações na Base do Formulário */}
      <Box paddingY={2.5} w="full">
        <Stack direction="col" mobileDirection="row" justify="end" gap={2.5} w="full">
          <Button variant="outline" label="Cancelar" onClick={onCancel} />
          <Button type="button" variant="primary" label="Salvar alterações" onClick={handleSave} />
        </Stack>
      </Box>

      {/* Modal de Ativação do iFood */}
      <IFoodActivationModal
        isOpen={isActivationModalOpen}
        onClose={handleCancelActivation}
        onActivate={(_code) => {
          setEnabled(true)
          setIsActivationModalOpen(false)
        }}
      />
    </Stack>
  )
}
