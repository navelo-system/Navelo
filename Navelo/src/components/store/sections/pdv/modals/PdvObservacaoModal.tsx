"use client"

/* eslint-disable react-hooks/set-state-in-effect */

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { NotepadTextIcon, LucideIcon } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface PdvObservacaoModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  placeholder?: string
  icon?: LucideIcon
  initialObservation?: string
  onSaveObservation: (obs: string) => void
}

export const PdvObservacaoModal: React.FC<PdvObservacaoModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  placeholder,
  icon: IconComp = NotepadTextIcon,
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

  const m = UI_STRINGS.pdv.modals
  const displayTitle = title || m.observationTitle
  const displayPlaceholder = placeholder || m.observationPlaceholder

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={IconComp}
      title={displayTitle}
      variant="default"
      showCancelButton={true}
      successText={UI_STRINGS.common.confirm}
      onSuccess={handleConfirm}
    >
      <Stack gap={3.5} w="full" paddingY={2.5}>
        {description && (
          <Font variant="body" text={description} />
        )}
        <Input
          variant="textarea"
          rows={4}
          placeholder={displayPlaceholder}
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
        />
      </Stack>
    </Modal>
  )
}
