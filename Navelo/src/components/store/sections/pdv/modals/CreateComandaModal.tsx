"use client"

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { FormActions } from "@/components/store/intermediary/FormActions"

interface CreateComandaModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string) => void
}

export const CreateComandaModal: React.FC<CreateComandaModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [newComandaName, setNewComandaName] = React.useState("")

  React.useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNewComandaName("")
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComandaName.trim()) return
    onSubmit(newComandaName)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Box padding={5} bg="bg-surface" radius="default">
        <Stack gap={5}>
          <Font variant="h3" text="Novo Atendimento" />
          <Box h="h-[2px]" bg="bg-border" w="full" />
          <Box as="form" onSubmit={handleSubmit} w="full" padding={0}>
            <Stack gap={5}>
              <Stack gap={1}>
                <Font variant="body-sm-semibold" text="Identificador da Comanda" />
                <Input
                  placeholder="Ex: #mesa_14, #pedro..."
                  value={newComandaName}
                  onChange={(e) => setNewComandaName(e.target.value)}
                  autoFocus
                />
              </Stack>
                    <FormActions
        confirmLabel="Confirmar e Abrir"
        onConfirm={() => {}}
        isSubmit={true}
        onCancel={onClose}
      />
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}
