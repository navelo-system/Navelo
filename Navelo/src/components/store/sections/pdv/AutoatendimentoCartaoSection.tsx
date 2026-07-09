"use client"

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Button } from "../../base/Button"
import { CustomSelect, CustomSelectItem } from "../../base/CustomSelect"
import { Smartphone } from "lucide-react"

export interface AutoatendimentoCartaoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const AutoatendimentoCartaoSection: React.FC<AutoatendimentoCartaoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [device, setDevice] = React.useState("pos-01")

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Cartão")
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
        <Stack gap={5} w="full">
          <Stack gap={1}>
            <Font variant="body-bold" text="Maquininha de Cartão (Smart POS)" />
            <Font
              variant="description"
              text="Selecione o terminal que receberá as requisições de pagamento com cartão no Autoatendimento."
              color="muted"
            />
          </Stack>

          <Stack gap={2.5} w="full">
            <Font variant="description" text="Selecione o terminal Smart POS" color="muted" />
            <CustomSelect
              value={device}
              onChange={(val) => setDevice(val)}
              placeholder="Selecione o POS..."
            >
              <CustomSelectItem value="pos-01" text="Smart POS 01 - Caixa" icon={Smartphone} />
              <CustomSelectItem value="pos-02" text="Smart POS 02 - Autoatendimento" icon={Smartphone} />
              <CustomSelectItem value="pos-balcao" text="Smart POS - Balcão" icon={Smartphone} />
            </CustomSelect>
          </Stack>
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
