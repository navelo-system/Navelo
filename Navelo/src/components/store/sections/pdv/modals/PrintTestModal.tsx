import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Font } from "@/components/store/base/Font"
import { Printer } from "lucide-react"

export interface PrintTestModalProps {
  isOpen: boolean
  onClose: () => void
}

export const PrintTestModal: React.FC<PrintTestModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Impressão de teste"
      subtitle="Simulação"
      icon={Printer}
      successText="OK"
      onSuccess={onClose}
      showCancelButton={false}
    >
      <Font variant="body" text="Enviando impressão de teste..." />
    </Modal>
  )
}
