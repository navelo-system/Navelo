"use client"

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { UI_STRINGS } from "@/constants/strings"

interface ExitConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isComanda?: boolean
  onSave?: () => void
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isComanda = false,
  onSave,
}) => {
  const m = UI_STRINGS.pdv.modals

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isComanda ? m.exitConfirmTitle : "Descartar operação e sair do caixa?"}
      successText={isComanda ? m.saveAndExit : "Descartar e sair"}
      onSuccess={isComanda && onSave ? onSave : onConfirm}
      showCancelButton
      cancelVariant="outline"
      variant="bottom"
    >
      {null}
    </Modal>
  )
}
