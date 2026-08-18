"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { Switch } from "@/components/store/base/Switch"
import { Icon } from "@/components/store/base/Icon"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { LinkDeviceModal } from "@/components/store/advanced/LinkDeviceModal"
import { Scale, Monitor, ChevronRight, LayoutGrid, Plus } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

interface LinkedDevice {
  id: string
  name: string
  code: string
}

export interface PesagemAutomaticaSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const PesagemAutomaticaSection: React.FC<PesagemAutomaticaSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [password, setPassword] = React.useState("")
  const [buffetEnabled, setBuffetEnabled] = React.useState(false)
  const [devicesEnabled, setDevicesEnabled] = React.useState(false)
  const [devices, setDevices] = React.useState<LinkedDevice[]>([])
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const s = UI_STRINGS.weighing

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel, s.title])

  const handleSave = () => { onCancel() }

  const handleLinkDevice = (code: string, name: string) => {
    setDevices((prev) => [...prev, { id: Date.now().toString(), name, code }])
  }

  const handleRemoveDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <Stack gap={5} w="full">
      {/* Card de Autenticação */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          <Font variant="body-bold" text={UI_STRINGS.weighing.authSectionTitle} />
          <Stack gap={2.5} w="full">
            <Input
              label={UI_STRINGS.weighing.passwordLabel}
              type="password"
              placeholder={UI_STRINGS.weighing.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Font
              variant="description"
              text={UI_STRINGS.weighing.authDesc}
            />
          </Stack>
        </Stack>
      </Box>

      {/* Card de Configurações de Produto */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        overflow="hidden"
        w="full"
      >
        {/* Linha: Produto Principal */}
        <Box
          padding={5}
          cursor="pointer"
          hoverBg="primary/10"
          w="full"
        >
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack direction="row" align="center" gap={5}>
              <Icon icon={LayoutGrid} size={20} color="primary" />
              <Stack gap={1}>
                <Font variant="body-bold" text={UI_STRINGS.weighing.mainProductTitle} />
                <Font variant="description" text={UI_STRINGS.weighing.selectProductPlaceholder} color="muted" />
              </Stack>
            </Stack>
            <Icon icon={ChevronRight} size={16} color="muted" />
          </Stack>
        </Box>

        <Box h="h-[1px]" w="full" bg="bg-border" />

        {/* Linha: Habilitar buffet livre */}
        <Box padding={5} w="full">
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Font variant="body" text={UI_STRINGS.weighing.enableBuffetToggle} />
            <Switch
              checked={buffetEnabled}
              onChange={(e) => setBuffetEnabled(e.target.checked)}
            />
          </Stack>
        </Box>

        <Box h="h-[1px]" w="full" bg="bg-border" />

        {/* Linha: Buffet Livre (desabilitado quando switch off) */}
        <Box
          padding={5}
          cursor={buffetEnabled ? "pointer" : undefined}
          hoverBg={buffetEnabled ? "primary/10" : undefined}
          w="full"
          opacity={buffetEnabled ? "100" : "50"}
        >
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack direction="row" align="center" gap={5}>
              <Icon icon={LayoutGrid} size={20} color={buffetEnabled ? "primary" : "muted"} />
              <Stack gap={1}>
                <Font variant="body-bold" text={UI_STRINGS.weighing.buffetFreeTitle} />
                <Font variant="description" text={UI_STRINGS.weighing.selectProductPlaceholder} color="muted" />
              </Stack>
            </Stack>
            <Icon icon={ChevronRight} size={16} color="muted" />
          </Stack>
        </Box>
      </Box>

      {/* Card de Dispositivos Vinculados */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          {/* Header */}
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Font variant="body-bold" text={UI_STRINGS.priceCheck.linkedDevicesTitle} />
            <Switch
              checked={devicesEnabled}
              onChange={(e) => setDevicesEnabled(e.target.checked)}
            />
          </Stack>

          {/* Corpo */}
          {devicesEnabled ? (
            <Stack gap={2.5} w="full">
              {devices.length === 0 ? (
                <EmptyState
                  icon={Monitor}
                  title={UI_STRINGS.priceCheck.emptyTitle}
                  subtitle={UI_STRINGS.weighing.emptyDevicesSubtitle}
                />
              ) : (
                <Stack gap={0} w="full">
                  {devices.map((device, idx) => (
                    <React.Fragment key={device.id}>
                      {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
                      <Box padding={2.5} w="full">
                        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                          <Stack direction="row" align="center" gap={2.5}>
                            <Icon icon={Monitor} size={16} color="muted" />
                            <Stack gap={1}>
                              <Font variant="body-bold" text={device.name} />
                              <Font variant="description" text={`Código: ${device.code}`} />
                            </Stack>
                          </Stack>
                          <Button
                            variant="danger-icon-xs-confirm"
                            confirmTitle="Remover Balança"
                            confirmSubtitle="Confirmar remoção de dispositivo"
                            confirmParagraph="Tem certeza que deseja desvincular este dispositivo de pesagem?"
                            onConfirm={() => handleRemoveDevice(device.id)}
                          />
                        </Stack>
                      </Box>
                    </React.Fragment>
                  ))}
                </Stack>
              )}
              <Box>
                <Button
                  variant="primary"
                  label={UI_STRINGS.priceCheck.linkDeviceButton}
                  icon={Plus}
                  onClick={() => setIsModalOpen(true)}
                />
              </Box>
            </Stack>
          ) : (
            <EmptyState
              icon={Scale}
              title={UI_STRINGS.weighing.disabledDevicesTitle}
              subtitle={UI_STRINGS.weighing.disabledDevicesSubtitle}
            />
          )}
        </Stack>
      </Box>

      {/* Botões de Ação */}
      <FormActions
        confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton}
        onConfirm={handleSave}
        onCancel={onCancel}
      />

      {/* Modal reutilizável */}
      <LinkDeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLinkDevice}
        appName="Pesagem Automática"
        appIcon={Scale}
      />
    </Stack>
  )
}
