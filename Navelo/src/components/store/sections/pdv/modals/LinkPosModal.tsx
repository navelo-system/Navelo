import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Modal } from "@/components/store/base/Modal"
import { UI_STRINGS } from "@/constants/strings"

export interface LinkPosModalProps {
  isOpen: boolean
  onClose: () => void
  onLink: (code: string) => void
  title: string
}

export const LinkPosModal: React.FC<LinkPosModalProps> = ({
  isOpen,
  onClose,
  onLink,
  title
}) => {
  const [linkingCode, setLinkingCode] = React.useState("")
  const p = UI_STRINGS.posLink
  const c = UI_STRINGS.common

  React.useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLinkingCode("")
    }
  }, [isOpen])

  const handleLinkClick = () => {
    if (linkingCode.trim()) {
      onLink(linkingCode.trim())
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Box padding={5}>
        <Stack gap={5} w="full">
          <Font variant="h3" text={title} />
          <Input
            label={p.linkingCodeLabel}
            value={linkingCode}
            onChange={(e) => setLinkingCode(e.target.value)}
            placeholder={p.linkingCodePlaceholder}
          />
          <Stack direction="row" justify="end" gap={5} w="full">
            <Button variant="ghost-primary" label={c.cancel} onClick={onClose} />
            <Button variant="ghost-primary" label={p.linkButton} onClick={handleLinkClick} />
          </Stack>
        </Stack>
      </Box>
    </Modal>
  )
}
