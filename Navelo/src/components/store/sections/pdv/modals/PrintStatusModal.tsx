import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Font } from "@/components/store/base/Font"
import { Printer } from "lucide-react"

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Aviso"
      subtitle="Status da operação"
      icon={Printer}
      successText="Fechar"
      onSuccess={onClose}
      showCancelButton={false}
    >
      <Font variant="body" text={message} />
    </Modal>
  )
}
