import * as React from "react"
import { Stack } from "@/components/store/base/Stack"
import { Input } from "@/components/store/base/Input"
import { Modal } from "@/components/store/base/Modal"
import { UI_STRINGS } from "@/constants/strings"

export interface LinkPosModalProps {
  isOpen: boolean
  onClose: () => void
  onLink: (code: string) => void
  title: string
}

export function LinkPosModal({
  isOpen,
  onClose,
  onLink,
  title,
}: LinkPosModalProps) {
  const [linkingCode, setLinkingCode] = React.useState("")
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen)
  const p = UI_STRINGS.posLink
  const c = UI_STRINGS.common

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      setLinkingCode("")
    }
  }

  const handleLinkClick = () => {
    if (linkingCode.trim()) {
      onLink(linkingCode.trim())
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      showCancelButton={true}
      cancelText={c.cancel}
      successText={p.linkButton}
      onSuccess={handleLinkClick}
    >
      <Stack gap={5} w="full">
        <Input
          label={p.linkingCodeLabel}
          value={linkingCode}
          onChange={(e) => setLinkingCode(e.target.value)}
          placeholder={p.linkingCodePlaceholder}
          autoFocus
        />
      </Stack>
    </Modal>
  )
}
