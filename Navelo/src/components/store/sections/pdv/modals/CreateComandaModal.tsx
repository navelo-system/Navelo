"use client"

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { UI_STRINGS } from "@/constants/strings"

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
  const t = UI_STRINGS.tables

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
          <Font variant="h3" text={t.newServiceTitle} />
          <Box h="h-[2px]" bg="bg-border" w="full" />
          <Box as="form" onSubmit={handleSubmit} w="full" padding={0}>
            <Stack gap={5}>
              <Stack gap={1}>
                <Font variant="body-sm-semibold" text={t.comandaIdentifierLabel} />
                <Input
                  placeholder={t.comandaIdentifierPlaceholder}
                  value={newComandaName}
                  onChange={(e) => setNewComandaName(e.target.value)}
                  autoFocus
                />
              </Stack>
              <FormActions
                confirmLabel={t.confirmAndOpenButton}
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
