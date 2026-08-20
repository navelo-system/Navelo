"use client"

import * as React from "react"
import { AlertCircle } from "lucide-react"
import { Modal } from "@/components/store/base/Modal"
import { Font } from "@/components/store/base/Font"
import { Box } from "@/components/store/base/Box"
import { UI_STRINGS } from "@/constants/strings"

export interface DiscardChangesModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirmDiscard: () => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
}

export const DiscardChangesModal: React.FC<DiscardChangesModalProps> = ({
  isOpen,
  onClose,
  onConfirmDiscard,
  title,
  description,
  confirmText,
  cancelText,
}) => {
  const c = UI_STRINGS.common

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || c.discardTitle}
      icon={AlertCircle}
      successText={confirmText || c.discardConfirm}
      onSuccess={onConfirmDiscard}
      showCancelButton
      cancelText={cancelText || c.discardCancel}
      cancelVariant="outline"
      variant="bottom"
    >
      <Box>
        <Font
          variant="description"
          color="muted"
          text={description || c.discardSubtitle}
        />
      </Box>
    </Modal>
  )
}
