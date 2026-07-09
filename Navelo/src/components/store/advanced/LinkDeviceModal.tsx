"use client"

import * as React from "react"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Input } from "../base/Input"
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../base/Modal"
import { Barcode, Link2, LucideIcon } from "lucide-react"

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
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalHeader
        title={appName}
        subtitle="Vincule um dispositivo ao aplicativo"
        icon={appIcon}
      />
      <ModalBody>
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
      </ModalBody>
      <ModalFooter
        cancelLabel="CANCELAR"
        confirmLabel="VINCULAR"
        confirmIcon={Link2}
        onCancel={handleClose}
        onConfirm={handleConfirm}
      />
    </Modal>
  )
}
