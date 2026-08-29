"use client"

import * as React from "react"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Modal } from "@/components/store/base/Modal"
import { Barcode, LucideIcon } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

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
  appName,
  appIcon = Barcode
}) => {
  const [linkCode, setLinkCode] = React.useState("")
  const [deviceName, setDeviceName] = React.useState("")
  const pl = UI_STRINGS.posLink

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
      title={appName || pl.defaultModalTitle}
      successText={pl.linkButton}
      onSuccess={handleConfirm}
      showCancelButton={true}
    >
      <Stack gap={5} w="full">
        <Stack gap={2.5} w="full">
          <Input
            label={pl.linkingCodeRequiredLabel}
            placeholder={pl.linkingCodeLabel}
            value={linkCode}
            onChange={(e) => setLinkCode(e.target.value)}
          />
          <Font
            variant="description"
            text={pl.linkingCodeHelpText}
          />
        </Stack>

        <Input
          label={pl.deviceNameRequiredLabel}
          placeholder={pl.deviceNamePlaceholder}
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
        />
      </Stack>
    </Modal>
  )
}
