import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Modal } from "@/components/store/base/Modal"

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
            label="Código de vinculação"
            value={linkingCode}
            onChange={(e) => setLinkingCode(e.target.value)}
            placeholder="Digite o código de vinculação"
          />
          <Stack direction="row" justify="end" gap={5} w="full">
            <Button variant="ghost-primary" label="CANCELAR" onClick={onClose} />
            <Button variant="ghost-primary" label="VINCULAR" onClick={handleLinkClick} />
          </Stack>
        </Stack>
      </Box>
    </Modal>
  )
}
