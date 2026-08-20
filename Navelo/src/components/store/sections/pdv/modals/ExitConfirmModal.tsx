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
  mode?: "save-and-exit" | "cancel-operation"
}

function getExitModalTitle(isCancelMode: boolean, isComanda: boolean, fallbackTitle: string): string {
  if (isCancelMode) {
    return isComanda ? "Cancelar comanda e descartar itens?" : "Cancelar operação e descartar itens?"
  }
  return isComanda ? fallbackTitle : "Descartar operação e sair do caixa?"
}

function getExitModalSuccessText(isCancelMode: boolean, isComanda: boolean, fallbackText: string): string {
  if (isCancelMode) return "Cancelar operação"
  return isComanda ? fallbackText : "Descartar e sair"
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isComanda = false,
  onSave,
  mode = "save-and-exit",
}) => {
  const m = UI_STRINGS.pdv.modals
  const isCancelMode = mode === "cancel-operation"
  const title = getExitModalTitle(isCancelMode, isComanda, m.exitConfirmTitle)
  const successText = getExitModalSuccessText(isCancelMode, isComanda, m.saveAndExit)
  const handleSuccess = !isCancelMode && isComanda && onSave ? onSave : onConfirm

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      successText={successText}
      onSuccess={handleSuccess}
      showCancelButton
      cancelVariant="outline"
      variant="bottom"
    >
      {null}
    </Modal>
  )
}
