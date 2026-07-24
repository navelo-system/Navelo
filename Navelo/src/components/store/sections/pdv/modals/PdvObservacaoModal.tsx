"use client"

/* eslint-disable react-hooks/set-state-in-effect */

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Box } from "@/components/store/base/Box"
import { Input } from "@/components/store/base/Input"
import { NotepadTextIcon } from "lucide-react"

interface PdvObservacaoModalProps {
  isOpen: boolean
  onClose: () => void
  initialObservation?: string
  onSaveObservation: (obs: string) => void
}

export const PdvObservacaoModal: React.FC<PdvObservacaoModalProps> = ({
  isOpen,
  onClose,
  initialObservation = "",
  onSaveObservation,
}) => {
  const [observation, setObservation] = React.useState(initialObservation)

  React.useEffect(() => {
    if (isOpen) {
      setObservation(initialObservation)
    }
  }, [isOpen, initialObservation])

  const handleConfirm = () => {
    onSaveObservation(observation)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={NotepadTextIcon}
      title="Observação"
      variant="default"
      showCancelButton={true}
      successText="Confirmar"
      onSuccess={handleConfirm}
    >
      <Box w="full" paddingY={2.5}>
        <Input
          placeholder="Digite a observação da venda..."
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
        />
      </Box>
    </Modal>
  )
}
