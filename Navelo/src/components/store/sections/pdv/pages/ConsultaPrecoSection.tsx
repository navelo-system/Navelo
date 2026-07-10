"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Icon } from "@/components/store/base/Icon"
import { LinkDeviceModal } from "@/components/store/advanced/LinkDeviceModal"
import { Barcode, Monitor, Plus, Trash2 } from "lucide-react"

interface LinkedDevice {
  id: string
  name: string
  code: string
}

export interface ConsultaPrecoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const ConsultaPrecoSection: React.FC<ConsultaPrecoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [password, setPassword] = React.useState("")
  const [devices, setDevices] = React.useState<LinkedDevice[]>([])
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Consulta Preço")
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
              text="Cadastre a senha que será utilizada para acessar as configurações do aplicativo Consulta Preço."
            />
          </Stack>
        </Stack>
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
          {/* Header do card */}
          <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="start" mobileJustify="between" w="full" gap={2.5}>
            <Font variant="body-bold" text="Dispositivos vinculados" />
            <Button
              variant="primary"
              label="Vincular dispositivo"
              icon={Plus}
              onClick={() => setIsModalOpen(true)}
            />
          </Stack>

          {/* Corpo: lista ou empty state */}
          {devices.length === 0 ? (
            <EmptyState
              icon={Monitor}
              title="Nenhum dispositivo vinculado"
              subtitle="Vincule um dispositivo para disponibilizar o Consulta Preço."
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
                      <Box
                        cursor="pointer"
                        onClick={() => handleRemoveDevice(device.id)}
                      >
                        <Icon icon={Trash2} size={16} color="danger" />
                      </Box>
                    </Stack>
                  </Box>
                </React.Fragment>
              ))}
            </Stack>
          )}
        </Stack>
      </Box>

      {/* Botões de Ações */}
      <Box paddingY={2.5} w="full">
        <Stack direction="col" mobileDirection="row" justify="end" gap={2.5} w="full">
          <Button variant="outline" label="Cancelar" onClick={onCancel} />
          <Button type="button" variant="primary" label="Salvar alterações" onClick={handleSave} />
        </Stack>
      </Box>

      {/* Modal de Vinculação */}
      <LinkDeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLinkDevice}
        appName="Consulta Preço"
        appIcon={Barcode}
      />
    </Stack>
  )
}
