import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Font } from "@/components/store/base/Font"

export interface ScaleStatusModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  message: string
}

export const ScaleStatusModal: React.FC<ScaleStatusModalProps> = ({
  isOpen,
  onClose,
  title,
  message
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      successText="Ok"
      onSuccess={onClose}
      showCancelButton={false}
    >
      <Font variant="body" text={message} />
    </Modal>
  )
}
