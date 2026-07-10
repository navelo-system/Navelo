"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Checkbox } from "@/components/store/base/Checkbox"
import { Badge } from "@/components/store/base/Badge"
import { Button } from "@/components/store/base/Button"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { Icon } from "@/components/store/base/Icon"
import { Wallet, QrCode, Check } from "lucide-react"

export interface FormasPagamentoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const FormasPagamentoSection: React.FC<FormasPagamentoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [dinheiro, setDinheiro] = React.useState(true)
  const [cartao, setCartao] = React.useState(true)
  const [entregaPix, setEntregaPix] = React.useState(true)
  const [contaDigitalEnabled, setContaDigitalEnabled] = React.useState(false)
  const [pixEnabled, setPixEnabled] = React.useState(true)

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Formas de pagamento")
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel])

  const handleSave = () => {
    onCancel()
  }

  return (
    <Stack gap={5} w="full">
      {/* Card: Pagamento antecipado */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          <Stack gap={1}>
            <Font variant="body-bold" text="Pagamento antecipado" />
            <Font
              variant="description"
              text="Habilite os meios de pagamento disponíveis na finalização do pedido."
              color="muted"
            />
          </Stack>

          <Box border={true} borderColor="border-border" radius="default" overflow="hidden" w="full">
            {/* Conta Digital */}
            <Box
              padding={5}
              cursor="pointer"
              hoverBg="primary/10"
              onClick={() => setContaDigitalEnabled(!contaDigitalEnabled)}
              w="full"
            >
              <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                <Stack direction="row" align="center" gap={2.5}>
                  <Icon icon={Wallet} size={20} color="primary" />
                  <Font variant="body-bold" text="Conta Digital" />
                </Stack>
                {contaDigitalEnabled && (
                  <Badge variant="success" label="habilitado" icon={Check} />
                )}
              </Stack>
            </Box>

            <Box h="h-[1px]" w="full" bg="bg-border" />

            {/* Pix */}
            <Box
              padding={5}
              cursor="pointer"
              hoverBg="primary/10"
              onClick={() => setPixEnabled(!pixEnabled)}
              w="full"
            >
              <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" w="full" gap={2.5}>
                <Stack direction="row" align="center" gap={2.5} flex="1">
                  <Icon icon={QrCode} size={20} color="primary" />
                  <Stack gap={1} flex="1">
                    <Font variant="body-bold" text="Pix" align="left" />
                    <Font
                      variant="description"
                      text="Necessária conferência na instituição bancária"
                      color="muted"
                      align="left"
                    />
                  </Stack>
                </Stack>
                {pixEnabled && (
                  <Box display="flex" justify="end" className="w-full md:w-auto">
                    <Badge variant="success" label="habilitado" icon={Check} />
                  </Box>
                )}
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* Card: Pagamento na entrega/retirada */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          <Stack gap={1}>
            <Font variant="body-bold" text="Pagamento na entrega/retirada" />
            <Font
              variant="description"
              text="Informe os meios de pagamento aceitos no momento da entrega ou retirada."
              color="muted"
            />
          </Stack>

          <Box border={true} borderColor="border-border" radius="default" overflow="hidden" w="full">
            {/* Dinheiro */}
            <Box padding={5} w="full">
              <Checkbox
                label="Dinheiro"
                checked={dinheiro}
                onChange={(e) => setDinheiro(e.target.checked)}
              />
            </Box>

            <Box h="h-[1px]" w="full" bg="bg-border" />

            {/* Cartão */}
            <Box padding={5} w="full">
              <Checkbox
                label="Cartão"
                checked={cartao}
                onChange={(e) => setCartao(e.target.checked)}
              />
            </Box>

            <Box h="h-[1px]" w="full" bg="bg-border" />

            {/* Pix */}
            <Box padding={5} w="full">
              <Checkbox
                label="Pix"
                checked={entregaPix}
                onChange={(e) => setEntregaPix(e.target.checked)}
              />
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* Botões de Ação */}
            <FormActions
        confirmLabel="Salvar alterações"
        onConfirm={handleSave}
        onCancel={onCancel}
      />
    </Stack>
  )
}
