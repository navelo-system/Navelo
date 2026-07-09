"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Switch } from "../../base/Switch"
import { Input } from "../../base/Input"
import { Button } from "../../base/Button"
import { RotateCcw } from "lucide-react"

export interface AutoatendimentoNumeroSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const AutoatendimentoNumeroSection: React.FC<AutoatendimentoNumeroSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [enabled, setEnabled] = React.useState(false)
  const [nextNumber, setNextNumber] = React.useState("")

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Número de atendimento")
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel])

  const handleSave = () => {
    onCancel()
  }

  const handleReset = () => {
    setNextNumber("1")
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
        <Stack gap={5} w="full">
          {/* Habilitar */}
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Font variant="body-bold" text="Habilitar" />
            <Switch
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          </Stack>

          {enabled && (
            <>
              <Box h="h-[1px]" w="full" bg="bg-border" />

              {/* Input com botão Reiniciar integrado */}
              <Stack direction="row" align="end" gap={2.5} w="full">
                <Box flex="1">
                  <Input
                    label="* Próximo número"
                    value={nextNumber}
                    onChange={(e) => setNextNumber(e.target.value)}
                    placeholder="Digite o próximo número..."
                    required
                  />
                </Box>
                <Button
                  type="button"
                  variant="outline"
                  label="Reiniciar"
                  icon={RotateCcw}
                  onClick={handleReset}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Box>

      {/* Rodapé Informativo */}
      <Box
        bg="bg-surface"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Font
          variant="description"
          text="ℹ️ A configuração de número de atendimento será aplicada no Caixa, Delivery, Mesas e comandas e Autoatendimento. Outros dispositivos não serão afetados."
          color="muted"
        />
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
