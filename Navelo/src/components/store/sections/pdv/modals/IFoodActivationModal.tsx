import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Modal } from "@/components/store/base/Modal"
import { ShoppingBag, Copy } from "lucide-react"

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
      title="Ativar aplicativo"
      subtitle="Vincule sua conta iFood com o Navelo PDV"
      icon={ShoppingBag}
      successText="CONCLUIR"
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
            <Font variant="description" text="Código de ativação" />
            <Font variant="h1" text="PDDD-FPSG" />
            
            {/* Botão Copiar */}
            <Button
              variant="primary"
              label="COPIAR"
              icon={Copy}
              onClick={handleCopyCode}
            />
          </Stack>
        </Box>

        {/* Passo 1 instrução */}
        <Font
          variant="body"
          text="Acesse a URL abaixo e cole o código de ativação na plataforma do iFood para ativar o aplicativo."
          align="center"
        />
        
        <Box
          as="a"
          href="https://portal.ifood.com.br/apps/code"
          target="_blank"
          display="block"
        >
          <Font variant="body-bold" color="primary" align="center" text="https://portal.ifood.com.br/apps/code" />
        </Box>

        {/* Passo 2 instrução */}
        <Font
          variant="body"
          text="Para concluir a ativação do aplicativo, informe o código de ativação gerado pelo iFood."
          align="center"
        />

        {/* Input do código gerado */}
        <Input
          label="* Código de ativação"
          value={activationCode}
          onChange={(e) => setActivationCode(e.target.value)}
          placeholder="Cole o código retornado pelo iFood"
        />
      </Stack>
    </Modal>
  )
}
