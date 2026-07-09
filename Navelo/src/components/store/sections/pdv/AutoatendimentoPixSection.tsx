"use client"

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Switch } from "../../base/Switch"
import { Button } from "../../base/Button"

export interface AutoatendimentoPixSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const AutoatendimentoPixSection: React.FC<AutoatendimentoPixSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [enabled, setEnabled] = React.useState(true)

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Pix")
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
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack gap={1} flex="1">
            <Font variant="body-bold" text="Habilitar Pix no Autoatendimento" />
            <Font
              variant="description"
              text="Exibe o QR Code dinâmico do Pix na tela de pagamento para confirmação automática."
              color="muted"
            />
          </Stack>
          <Switch
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
        </Stack>
      </Box>

      {/* Botões de Ação */}
      <Box paddingY={2.5} w="full">
        <Stack direction="row" justify="end" gap={2.5} w="full">
          <Button variant="outline" label="Cancelar" onClick={onCancel} />
          <Button type="button" variant="primary" label="Salvar alterações" onClick={handleSave} />
        </Stack>
      </Box>
    </Stack>
  )
}
