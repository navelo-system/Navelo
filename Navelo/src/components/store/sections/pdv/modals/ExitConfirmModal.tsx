"use client"

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"

interface ExitConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Descartar operação e sair do caixa?"
      successText="Descartar e sair"
      onSuccess={onConfirm}
      showCancelButton
      cancelVariant="outline"
      variant="bottom"
    >
      {null}
    </Modal>
  )
}
