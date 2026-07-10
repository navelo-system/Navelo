"use client"

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Font } from "@/components/store/base/Font"
import { Trash2 } from "lucide-react"

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Remover Item"
      subtitle={`Deseja realmente remover o produto "${productName}" do carrinho?`}
      icon={Trash2}
      successText="Remover"
      onSuccess={onConfirm}
    >
      <Font variant="description" text="Esta ação removerá o produto desta venda e recalculará o total da conta." />
    </Modal>
  )
}
