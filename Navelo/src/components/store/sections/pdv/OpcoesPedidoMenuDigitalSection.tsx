"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Checkbox } from "../../base/Checkbox"
import { Button } from "../../base/Button"
import { CustomSelect, CustomSelectItem } from "../../base/CustomSelect"
import { Monitor } from "lucide-react"

export interface OpcoesPedidoMenuDigitalSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const OpcoesPedidoMenuDigitalSection: React.FC<OpcoesPedidoMenuDigitalSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [aceitarPedidos, setAceitarPedidos] = React.useState(false)
  const [dispositivo, setDispositivo] = React.useState("dev-06")

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Opções de Pedido")
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
          {/* Aceitar pedidos */}
          <Stack direction="row" align="start" gap={2.5} w="full">
            <Checkbox
              checked={aceitarPedidos}
              onChange={(e) => setAceitarPedidos(e.target.checked)}
            />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text="Aceitar pedidos" />
              <Font
                variant="description"
                text="O cliente fará pedidos para a mesa ou comanda através do Menu Digital."
                color="muted"
              />
            </Stack>
          </Stack>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Selecionar dispositivo */}
          <Stack gap={2.5} w="full">
            <Font variant="description" text="Dispositivo que receberá os pedidos" color="muted" />
            <CustomSelect
              value={dispositivo}
              onChange={(val) => setDispositivo(val)}
              placeholder="Selecione um dispositivo"
            >
              <CustomSelectItem value="dev-06" text="Dispositivo 06" icon={Monitor} />
              <CustomSelectItem value="dev-01" text="Dispositivo 01" icon={Monitor} />
              <CustomSelectItem value="dev-caixa" text="Caixa Principal" icon={Monitor} />
            </CustomSelect>
          </Stack>
        </Stack>
      </Box>

      {/* Nota informativa */}
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
          text="ℹ️ O dispositivo selecionado receberá tanto os pedidos do Menu Digital, quanto do Catálogo Online."
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
