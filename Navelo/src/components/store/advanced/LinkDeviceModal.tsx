"use client"

import * as React from "react"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Modal } from "@/components/store/base/Modal"
import { Barcode, LucideIcon } from "lucide-react"

export interface LinkDeviceModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (code: string, name: string) => void
  appName?: string
  appIcon?: LucideIcon
}

export const LinkDeviceModal: React.FC<LinkDeviceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  appName = "Vincular Dispositivo",
  appIcon = Barcode
}) => {
  const [linkCode, setLinkCode] = React.useState("")
  const [deviceName, setDeviceName] = React.useState("")

  const handleClose = () => {
    setLinkCode("")
    setDeviceName("")
    onClose()
  }

  const handleConfirm = () => {
    if (!linkCode.trim() || !deviceName.trim()) return
    onConfirm(linkCode, deviceName)
    setLinkCode("")
    setDeviceName("")
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={appName}
      subtitle="Vincule um dispositivo ao aplicativo"
      icon={appIcon}
      successText="VINCULAR"
      onSuccess={handleConfirm}
    >
      <Stack gap={5} w="full">
        <Stack gap={2.5} w="full">
          <Input
            label="* Código de vinculação"
            placeholder="Código de vinculação"
            value={linkCode}
            onChange={(e) => setLinkCode(e.target.value)}
          />
          <Font
            variant="description"
            text="Informe o código apresentado no aplicativo"
          />
        </Stack>

        <Input
          label="* Nome do dispositivo"
          placeholder="Nome do dispositivo"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
        />
      </Stack>
    </Modal>
  )
}
