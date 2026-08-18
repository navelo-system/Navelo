"use client"

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Font } from "@/components/store/base/Font"
import { Cloud } from "lucide-react"

import { UI_STRINGS } from "@/constants/strings"

interface BackupSuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export const BackupSuccessModal: React.FC<BackupSuccessModalProps> = ({
  isOpen,
  onClose
}) => {
  const s = UI_STRINGS.backup

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={s.backupSuccessTitle}
      subtitle={s.backupSuccessSubtitle}
      icon={Cloud}
      successText="Ok"
      onSuccess={onClose}
      showCancelButton={false}
    >
      <Font variant="body" text={s.backupSuccessText} />
    </Modal>
  )
}
