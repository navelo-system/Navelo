import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Modal } from "@/components/store/base/Modal"
import { Copy } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface IFoodActivationModalProps {
  isOpen: boolean
  onClose: () => void
  onActivate: (code: string) => void
}

export const IFoodActivationModal: React.FC<IFoodActivationModalProps> = ({
  isOpen,
  onClose,
  onActivate
}) => {
  const [activationCode, setActivationCode] = React.useState("")
  const s = UI_STRINGS.ifood
  const c = UI_STRINGS.common

  const handleCopyCode = () => {
    navigator.clipboard.writeText("PDDD-FPSG")
  }

  const handleConfirm = () => {
    if (activationCode.trim()) {
      onActivate(activationCode.trim())
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={s.activationModalTitle}
      successText={c.finish}
      onSuccess={handleConfirm}
    >
      <Stack gap={5} w="full">
        {/* Card do código de ativação */}
        <Box
          bg="bg-surface-sunken"
          border={true}
          borderColor="border-border"
          radius="default"
          padding={5}
          w="full"
        >
          <Stack align="center" gap={2.5} w="full">
            <Font variant="description" text={s.activationCodeLabel} />
            <Font variant="h1" text={s.mockActivationCode} />
            
            {/* Botão Copiar */}
            <Button
              variant="primary"
              label={c.copy}
              icon={Copy}
              onClick={handleCopyCode}
            />
          </Stack>
        </Box>

        {/* Passo 1 instrução */}
        <Font
          variant="body"
          text={s.step1Instruction}
          align="center"
        />
        
        <Box
          as="a"
          href={s.portalUrl}
          target="_blank"
          display="block"
        >
          <Font variant="body-bold" color="primary" align="center" text={s.portalUrl} />
        </Box>

        {/* Passo 2 instrução */}
        <Font
          variant="body"
          text={s.step2Instruction}
          align="center"
        />

        {/* Input do código gerado */}
        <Input
          label={s.activationCodeInputLabel}
          value={activationCode}
          onChange={(e) => setActivationCode(e.target.value)}
          placeholder={s.activationCodeInputPlaceholder}
        />
      </Stack>
    </Modal>
  )
}
