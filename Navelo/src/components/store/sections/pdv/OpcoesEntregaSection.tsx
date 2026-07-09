"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Checkbox } from "../../base/Checkbox"
import { Button } from "../../base/Button"

export interface OpcoesEntregaSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const OpcoesEntregaSection: React.FC<OpcoesEntregaSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [retirada, setRetirada] = React.useState(true)
  const [entrega, setEntrega] = React.useState(true)
  const [consumirLocal, setConsumirLocal] = React.useState(false)
  const [taxasEntrega, setTaxasEntrega] = React.useState(false)

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Opções de Entrega")
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
      {/* Card 1: Modos de Entrega */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          {/* Retirada */}
          <Stack direction="row" align="start" gap={2.5} w="full">
            <Checkbox
              checked={retirada}
              onChange={(e) => setRetirada(e.target.checked)}
            />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text="Retirada no local" />
              <Font
                variant="description"
                text="O cliente terá a opção de retirada no estabelecimento."
                color="muted"
              />
            </Stack>
          </Stack>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Entrega */}
          <Stack direction="row" align="start" gap={2.5} w="full">
            <Checkbox
              checked={entrega}
              onChange={(e) => setEntrega(e.target.checked)}
            />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text="Entrega" />
              <Font
                variant="description"
                text="O cliente terá a opção de receber o pedido no endereço informado."
                color="muted"
              />
            </Stack>
          </Stack>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Consumir no local */}
          <Stack direction="row" align="start" gap={2.5} w="full">
            <Checkbox
              checked={consumirLocal}
              onChange={(e) => setConsumirLocal(e.target.checked)}
            />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text="Consumir no local" />
              <Font
                variant="description"
                text="O cliente terá a opção de consumir o pedido no local."
                color="muted"
              />
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Card 2: Taxas */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack direction="row" align="start" gap={2.5} w="full">
          <Checkbox
            checked={taxasEntrega}
            onChange={(e) => setTaxasEntrega(e.target.checked)}
          />
          <Stack gap={1} flex="1">
            <Font variant="body-bold" text="Taxas de entrega" />
            <Font
              variant="description"
              text="As taxas serão exibidas como região de entrega no Catálogo Online."
              color="muted"
            />
          </Stack>
        </Stack>
      </Box>

      {/* Botões de Ação */}
      <Box paddingY={2.5} w="full">
        <Stack direction="col" mobileDirection="row" justify="end" gap={2.5} w="full">
          <Button variant="outline" label="Cancelar" onClick={onCancel} />
          <Button type="button" variant="primary" label="Salvar alterações" onClick={handleSave} />
        </Stack>
      </Box>
    </Stack>
  )
}
