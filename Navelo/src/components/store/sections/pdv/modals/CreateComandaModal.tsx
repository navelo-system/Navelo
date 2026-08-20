"use client"

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { UI_STRINGS } from "@/constants/strings"

interface CreateComandaModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string) => void
}

export function CreateComandaModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateComandaModalProps) {
  const [newComandaName, setNewComandaName] = React.useState("")
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen)
  const t = UI_STRINGS.tables
  const c = UI_STRINGS.common

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      setNewComandaName("")
    }
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!newComandaName.trim()) return
    onSubmit(newComandaName.trim())
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.newServiceTitle}
      showCancelButton={true}
      cancelText={c.cancel}
      successText={t.confirmAndOpenButton}
      onSuccess={() => handleSubmit()}
    >
      <Box as="form" onSubmit={handleSubmit} w="full" padding={0}>
        <Stack gap={1} w="full">
          <Font variant="body-sm-semibold" text={t.comandaIdentifierLabel} />
          <Input
            placeholder={t.comandaIdentifierPlaceholder}
            value={newComandaName}
            onChange={(e) => setNewComandaName(e.target.value)}
            autoFocus
          />
        </Stack>
      </Box>
    </Modal>
  )
}
