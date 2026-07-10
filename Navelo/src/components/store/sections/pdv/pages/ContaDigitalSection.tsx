"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { Switch } from "@/components/store/base/Switch"
import { Checkbox } from "@/components/store/base/Checkbox"
import { Icon } from "@/components/store/base/Icon"
import {
  ShoppingBag,
  Globe,
  Package,
  Smartphone,
  ExternalLink
} from "lucide-react"

export interface ContaDigitalSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const ContaDigitalSection: React.FC<ContaDigitalSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [enabled, setEnabled] = React.useState(false)
  const [caixaPix, setCaixaPix] = React.useState(false)
  const [catalogoCartao, setCatalogoCartao] = React.useState(false)
  const [catalogoPix, setCatalogoPix] = React.useState(false)
  const [entregadorPix, setEntregadorPix] = React.useState(false)
  const [autoatendimentoPix, setAutoatendimentoPix] = React.useState(false)

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Conta Digital")
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel])

  const handleSave = () => {
    // Simulação de salvamento
    onCancel()
  }

  return (
    <Stack gap={5} w="full">
      {/* Card Habilitar */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack gap={1}>
              <Font variant="body-bold" text="Habilitar" />
              <Font variant="description" text="Use a Conta Digital para receber pagamentos" />
            </Stack>
            <Switch
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          </Stack>

          {/* Link de acesso à plataforma */}
          <Box
            bg="bg-surface-sunken"
            border={true}
            borderColor="border-border"
            radius="default"
            padding={2.5}
            w="full"
            display="flex"
            justify="between"
            cursor={enabled ? "pointer" : undefined}
            opacity={enabled ? "100" : "50"}
            onClick={() => {
              if (enabled) {
                window.open("https://contadigital.navelo.com.br", "_blank")
              }
            }}
          >
            <Font variant="body" text="Acessar a plataforma Conta Digital" color={enabled ? "primary" : "muted"} />
            <Icon icon={ExternalLink} size={16} color={enabled ? "primary" : "muted"} />
          </Box>
        </Stack>
      </Box>

      {/* Card Caixa */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
        opacity={enabled ? "100" : "50"}
      >
        <Stack gap={2.5} w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={ShoppingBag} size={20} color="muted" />
            <Stack gap={2.5}>
              <Font variant="body-bold" text="Caixa" />
              <Font variant="description" text="Defina as formas de pagamento que serão aplicadas no Caixa" />
            </Stack>
          </Stack>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Box paddingY={1}>
            <Checkbox
              label="Pix"
              checked={caixaPix}
              onChange={(e) => setCaixaPix(e.target.checked)}
              disabled={!enabled}
            />
          </Box>
        </Stack>
      </Box>

      {/* Card Catálogo Online */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
        opacity={enabled ? "100" : "50"}
      >
        <Stack gap={2.5} w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Globe} size={20} color="muted" />
            <Stack gap={2.5}>
              <Font variant="body-bold" text="Catálogo Online" />
              <Font variant="description" text="Defina as formas de pagamento que serão aplicadas na página do seu Catálogo Online" />
            </Stack>
          </Stack>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Box paddingY={2.5}>
            <Stack gap={2.5}>
              <Checkbox
                label="Cartão"
                checked={catalogoCartao}
                onChange={(e) => setCatalogoCartao(e.target.checked)}
                disabled={!enabled}
              />
              <Checkbox
                label="Pix"
                checked={catalogoPix}
                onChange={(e) => setCatalogoPix(e.target.checked)}
                disabled={!enabled}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Card Conecta Entregador */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
        opacity={enabled ? "100" : "50"}
      >
        <Stack gap={2.5} w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Package} size={20} color="muted" />
            <Stack gap={1}>
              <Font variant="body-bold" text="Conecta Entregador" />
              <Font variant="description" text="Defina as formas de pagamento que serão aplicadas no aplicativo Conecta Entregador" />
            </Stack>
          </Stack>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Box paddingY={1}>
            <Checkbox
              label="Pix"
              checked={entregadorPix}
              onChange={(e) => setEntregadorPix(e.target.checked)}
              disabled={!enabled}
            />
          </Box>
        </Stack>
      </Box>

      {/* Card Autoatendimento */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
        opacity={enabled ? "100" : "50"}
      >
        <Stack gap={2.5} w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Smartphone} size={20} color="muted" />
            <Stack gap={1}>
              <Font variant="body-bold" text="Autoatendimento" />
              <Font variant="description" text="Defina as formas de pagamento que serão aplicadas no Autoatendimento" />
            </Stack>
          </Stack>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Box paddingY={1}>
            <Checkbox
              label="Pix"
              checked={autoatendimentoPix}
              onChange={(e) => setAutoatendimentoPix(e.target.checked)}
              disabled={!enabled}
            />
          </Box>
        </Stack>
      </Box>

      {/* Botões de Ações na Base do Formulário */}
            <FormActions
        confirmLabel="Salvar alterações"
        onConfirm={handleSave}
        onCancel={onCancel}
      />
    </Stack>
  )
}
