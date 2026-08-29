import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Font } from "@/components/store/base/Font"
import { UI_STRINGS } from "@/constants/strings"

export interface PrintTestModalProps {
  isOpen: boolean
  onClose: () => void
}

export const PrintTestModal: React.FC<PrintTestModalProps> = ({
  isOpen,
  onClose
}) => {
  const p = UI_STRINGS.printers

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={p.testPrintTitle}
      successText="OK"
      onSuccess={onClose}
      showCancelButton={false}
    >
      <Font variant="body" text={p.sendingTestPrint} />
    </Modal>
  )
}
