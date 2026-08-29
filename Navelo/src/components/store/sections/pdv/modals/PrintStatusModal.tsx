import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Font } from "@/components/store/base/Font"
import { UI_STRINGS } from "@/constants/strings"

export interface PrintStatusModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
}

export const PrintStatusModal: React.FC<PrintStatusModalProps> = ({
  isOpen,
  onClose,
  message
}) => {
  const c = UI_STRINGS.common

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={c.notice}
      successText={c.close}
      onSuccess={onClose}
      showCancelButton={false}
    >
      <Font variant="body" text={message} />
    </Modal>
  )
}
