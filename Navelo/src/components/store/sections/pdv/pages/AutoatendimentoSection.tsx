"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { Checkbox } from "@/components/store/base/Checkbox"
import { Icon } from "@/components/store/base/Icon"
import {
  LayoutGrid,
  CreditCard,
  QrCode,
  Smartphone,
  Hash,
  ChevronRight
} from "lucide-react"

export interface AutoatendimentoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  onNavigate: (subView: string) => void
}

export const AutoatendimentoSection: React.FC<AutoatendimentoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  onNavigate
}) => {
  const [enabled, setEnabled] = React.useState(false)
  const [habilitarOpcoesEntrega, setHabilitarOpcoesEntrega] = React.useState(false)

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Autoatendimento")
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel])

  return (
    <Stack gap={5} w="full">
      {/* Card 1: Habilitar */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Font variant="body-bold" text="Habilitar" />
          <Switch
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
        </Stack>
      </Box>

      {enabled && (
        <>
          {/* Card 2: Produtos */}
          <Box
            bg="bg-white"
            border={true}
            borderColor="border-border"
            radius="default"
            overflow="hidden"
            w="full"
          >
            <Box padding={2.5} paddingX={5} bg="bg-surface" w="full">
              <Font variant="description" text="Produtos" color="muted" />
            </Box>
            <Box
              padding={5}
              cursor="pointer"
              hoverBg="primary/10"
              onClick={() => onNavigate("catalogo-produtos")}
              w="full"
            >
              <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                <Stack direction="row" align="center" gap={2.5}>
                  <Icon icon={LayoutGrid} size={20} color="primary" />
                  <Stack gap={1}>
                    <Font variant="body-bold" text="Produtos" />
                    <Font variant="description" text="61 produtos selecionados." color="muted" />
                  </Stack>
                </Stack>
                <Icon icon={ChevronRight} size={16} color="muted" />
              </Stack>
            </Box>
          </Box>

          {/* Card 3: Formas de Pagamento */}
          <Box
            bg="bg-white"
            border={true}
            borderColor="border-border"
            radius="default"
            overflow="hidden"
            w="full"
          >
            <Box padding={5} bg="bg-surface" w="full">
              <Stack gap={1} w="full">
                <Font variant="body-bold" text="Formas de pagamento" />
                <Font
                  variant="description"
                  text="Para utilizar o Autoatendimento é necessário configurar pelo menos uma forma de pagamento antecipada com confirmação automática."
                  color="muted"
                />
              </Stack>
            </Box>

            <Box h="h-[1px]" w="full" bg="bg-border" />

            {/* Cartão */}
            <Box
              padding={5}
              cursor="pointer"
              hoverBg="primary/10"
              onClick={() => onNavigate("autoatendimento-cartao")}
              w="full"
            >
              <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                <Stack direction="row" align="center" gap={2.5}>
                  <Icon icon={CreditCard} size={20} color="primary" />
                  <Stack gap={1}>
                    <Font variant="body-bold" text="Cartão" />
                    <Font
                      variant="description"
                      text="Selecione o POS que realizará a cobrança no Pagamento Integrado."
                      color="muted"
                    />
                  </Stack>
                </Stack>
                <Icon icon={ChevronRight} size={16} color="muted" />
              </Stack>
            </Box>

            <Box h="h-[1px]" w="full" bg="bg-border" />

            {/* Pix */}
            <Box
              padding={5}
              cursor="pointer"
              hoverBg="primary/10"
              onClick={() => onNavigate("autoatendimento-pix")}
              w="full"
            >
              <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                <Stack direction="row" align="center" gap={2.5}>
                  <Icon icon={QrCode} size={20} color="primary" />
                  <Stack gap={1}>
                    <Font variant="body-bold" text="Pix" />
                    <Font variant="description" text="Habilitar o Pix na Conta Digital." color="muted" />
                  </Stack>
                </Stack>
                <Icon icon={ChevronRight} size={16} color="muted" />
              </Stack>
            </Box>
          </Box>

          {/* Card 4: Opções */}
          <Box
            bg="bg-white"
            border={true}
            borderColor="border-border"
            radius="default"
            overflow="hidden"
            w="full"
          >
            <Box padding={2.5} paddingX={5} bg="bg-surface" w="full">
              <Font variant="description" text="Opções" color="muted" />
            </Box>

            {/* Customização PDV */}
            <Box
              padding={5}
              cursor="pointer"
              hoverBg="primary/10"
              onClick={() => onNavigate("autoatendimento-customizacao")}
              w="full"
            >
              <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                <Stack direction="row" align="center" gap={2.5}>
                  <Icon icon={Smartphone} size={20} color="primary" />
                  <Font variant="body-bold" text="Customização PDV" />
                </Stack>
                <Icon icon={ChevronRight} size={16} color="muted" />
              </Stack>
            </Box>

            <Box h="h-[1px]" w="full" bg="bg-border" />

            {/* Número de atendimento */}
            <Box
              padding={5}
              cursor="pointer"
              hoverBg="primary/10"
              onClick={() => onNavigate("autoatendimento-numero")}
              w="full"
            >
              <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                <Stack direction="row" align="center" gap={2.5}>
                  <Icon icon={Hash} size={20} color="primary" />
                  <Font variant="body-bold" text="Número de atendimento" />
                </Stack>
                <Icon icon={ChevronRight} size={16} color="muted" />
              </Stack>
            </Box>

            <Box h="h-[1px]" w="full" bg="bg-border" />

            {/* Habilitar opções de entrega */}
            <Box padding={5} w="full">
              <Stack direction="row" align="start" gap={2.5} w="full">
                <Checkbox
                  checked={habilitarOpcoesEntrega}
                  onChange={(e) => setHabilitarOpcoesEntrega(e.target.checked)}
                />
                <Stack gap={1} flex="1">
                  <Font variant="body-bold" text="Habilitar opções de entrega" />
                  <Font
                    variant="description"
                    text="Permita que o cliente escolha entre Retirar ou Consumir no local antes de finalizar o atendimento."
                    color="muted"
                  />
                </Stack>
              </Stack>
            </Box>
          </Box>
        </>
      )}
    </Stack>
  )
}
