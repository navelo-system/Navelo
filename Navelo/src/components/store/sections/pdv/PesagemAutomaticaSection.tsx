"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Input } from "../../base/Input"
import { Button } from "../../base/Button"
import { Switch } from "../../base/Switch"
import { Icon } from "../../base/Icon"
import { EmptyState } from "../../intermediary/EmptyState"
import { LinkDeviceModal } from "../../advanced/LinkDeviceModal"
import { Scale, Monitor, ChevronRight, LayoutGrid, Plus, Trash2 } from "lucide-react"

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

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Pesagem Automática")
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel])

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
          <Font variant="body-bold" text="Autenticação" />
          <Stack gap={2.5} w="full">
            <Input
              label="* Senha"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Font
              variant="description"
              text="Cadastre a senha que será utilizada para acessar as configurações do aplicativo Pesagem Automática."
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
                <Font variant="body-bold" text="Produto Principal" />
                <Font variant="description" text="Selecione um produto" color="muted" />
              </Stack>
            </Stack>
            <Icon icon={ChevronRight} size={16} color="muted" />
          </Stack>
        </Box>

        <Box h="h-[1px]" w="full" bg="bg-border" />

        {/* Linha: Habilitar buffet livre */}
        <Box padding={5} w="full">
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Font variant="body" text="Habilitar buffet livre" />
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
                <Font variant="body-bold" text="Buffet Livre" />
                <Font variant="description" text="Selecione um produto" color="muted" />
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
            <Font variant="body-bold" text="Dispositivos vinculados" />
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
                  title="Nenhum dispositivo vinculado"
                  subtitle="Vincule um dispositivo para disponibilizar a Pesagem Automática."
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
                          <Box cursor="pointer" onClick={() => handleRemoveDevice(device.id)}>
                            <Icon icon={Trash2} size={16} color="danger" />
                          </Box>
                        </Stack>
                      </Box>
                    </React.Fragment>
                  ))}
                </Stack>
              )}
              <Box>
                <Button
                  variant="primary"
                  label="Vincular dispositivo"
                  icon={Plus}
                  onClick={() => setIsModalOpen(true)}
                />
              </Box>
            </Stack>
          ) : (
            <EmptyState
              icon={Scale}
              title="Dispositivos desabilitados"
              subtitle="Ative a chave acima para gerenciar dispositivos vinculados à Pesagem Automática."
            />
          )}
        </Stack>
      </Box>

      {/* Botões de Ação */}
      <Box paddingY={2.5} w="full">
        <Stack direction="row" justify="end" gap={2.5} w="full">
          <Button variant="outline" label="Cancelar" onClick={onCancel} />
          <Button type="button" variant="primary" label="Salvar alterações" onClick={handleSave} />
        </Stack>
      </Box>

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
