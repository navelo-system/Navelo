"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Button } from "../../base/Button"
import { Switch } from "../../base/Switch"
import { Checkbox } from "../../base/Checkbox"
import { Input } from "../../base/Input"
import { Modal } from "../../base/Modal"
import { Icon } from "../../base/Icon"
import { Ban, BookOpen, RefreshCw, Trash2, ChevronRight, Copy, ShoppingBag } from "lucide-react"

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
  const [activationCode, setActivationCode] = React.useState("")

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

  const handleCopyCode = () => {
    navigator.clipboard.writeText("PDDD-FPSG")
  }

  const handleConfirmActivation = () => {
    if (activationCode.trim()) {
      setEnabled(true)
      setIsActivationModalOpen(false)
    }
  }

  const handleCancelActivation = () => {
    setIsActivationModalOpen(false)
    setActivationCode("")
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
      <Modal
        isOpen={isActivationModalOpen}
        onClose={handleCancelActivation}
        title="Ativar aplicativo"
        subtitle="Vincule sua conta iFood com o Navelo PDV"
        icon={ShoppingBag}
        successText="CONCLUIR"
        onSuccess={handleConfirmActivation}
      >
        <Stack gap={5} w="full">
          {/* Card do código de ativação */}
          <Box
            bg="bg-surface-sunken"
            border={true}
            borderColor="border-border"
            radius="default"
            padding={5}
            w="full"
          >
            <Stack align="center" gap={2.5} w="full">
              <Font variant="description" text="Código de ativação" />
              <Font variant="h1" text="PDDD-FPSG" />
              
              {/* Botão Copiar */}
              <Button
                variant="primary"
                label="COPIAR"
                icon={Copy}
                onClick={handleCopyCode}
              />
            </Stack>
          </Box>

          {/* Passo 1 instrução */}
          <Font
            variant="body"
            text="Acesse a URL abaixo e cole o código de ativação na plataforma do iFood para ativar o aplicativo."
            align="center"
          />
          
          <Box
            as="a"
            href="https://portal.ifood.com.br/apps/code"
            target="_blank"
            display="block"
          >
            <Font variant="body-bold" color="primary" align="center" text="https://portal.ifood.com.br/apps/code" />
          </Box>

          {/* Passo 2 instrução */}
          <Font
            variant="body"
            text="Para concluir a ativação do aplicativo, informe o código de ativação gerado pelo iFood."
            align="center"
          />

          {/* Input do código gerado */}
          <Input
            label="* Código de ativação"
            value={activationCode}
            onChange={(e) => setActivationCode(e.target.value)}
            placeholder="Cole o código retornado pelo iFood"
          />
        </Stack>
      </Modal>
    </Stack>
  )
}
