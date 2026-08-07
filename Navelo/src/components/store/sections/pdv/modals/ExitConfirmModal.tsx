"use client"

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isComanda ? "Salvar alterações na comanda e sair?" : "Descartar operação e sair do caixa?"}
      successText={isComanda ? "Salvar e sair" : "Descartar e sair"}
      onSuccess={isComanda && onSave ? onSave : onConfirm}
      showCancelButton
      cancelVariant="outline"
      variant="bottom"
    >
      {null}
    </Modal>
  )
}
