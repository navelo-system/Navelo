"use client"

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Font } from "@/components/store/base/Font"
import { Cloud } from "lucide-react"

interface BackupSuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export const BackupSuccessModal: React.FC<BackupSuccessModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Backup Concluído"
      subtitle="Seus dados foram salvos com sucesso"
      icon={Cloud}
      successText="Ok"
      onSuccess={onClose}
      showCancelButton={false}
    >
      <Font variant="body" text="Backup realizado com sucesso!" />
    </Modal>
  )
}
