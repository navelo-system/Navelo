"use client"

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Font } from "@/components/store/base/Font"
import { Trash2 } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

interface RemoveItemConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  productName: string
}

export const RemoveItemConfirmModal: React.FC<RemoveItemConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  productName
}) => {
  const m = UI_STRINGS.pdv.modals
  const c = UI_STRINGS.common

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={m.removeItemTitle}
      subtitle={`Deseja realmente remover o produto "${productName}" do carrinho?`}
      icon={Trash2}
      successText={c.delete}
      onSuccess={onConfirm}
    >
      <Font variant="description" text={m.removeItemDesc} />
    </Modal>
  )
}
