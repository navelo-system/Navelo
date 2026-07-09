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

export interface OpcoesPedidoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const OpcoesPedidoSection: React.FC<OpcoesPedidoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [login, setLogin] = React.useState(true)
  const [bloquearForaHorario, setBloquearForaHorario] = React.useState(true)
  const [notificacao, setNotificacao] = React.useState(true)
  const [avisoSonoro, setAvisoSonoro] = React.useState(true)
  const [avisoContinuo, setAvisoContinuo] = React.useState(false)
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
          {/* Login */}
          <Stack direction="row" align="start" gap={2.5} w="full">
            <Checkbox
              checked={login}
              onChange={(e) => setLogin(e.target.checked)}
            />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text="Login do usuário" />
              <Font
                variant="description"
                text="Será obrigatório o login para realizar pedidos e acessar histórico, cartões e endereços."
                color="muted"
              />
            </Stack>
          </Stack>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Bloquear fora do horário */}
          <Stack direction="row" align="start" gap={2.5} w="full">
            <Checkbox
              checked={bloquearForaHorario}
              onChange={(e) => setBloquearForaHorario(e.target.checked)}
            />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text="Bloquear pedidos fora do horário" />
              <Font
                variant="description"
                text="Não será possível realizar pedidos fora do horário de atendimento."
                color="muted"
              />
            </Stack>
          </Stack>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Notificação */}
          <Stack direction="row" align="start" gap={2.5} w="full">
            <Checkbox
              checked={notificacao}
              onChange={(e) => setNotificacao(e.target.checked)}
            />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text="Notificação" />
              <Font
                variant="description"
                text="Receberá uma notificação quando um novo pedido for recebido do Catálogo Online."
                color="muted"
              />
            </Stack>
          </Stack>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Aviso Sonoro */}
          <Stack direction="row" align="start" gap={2.5} w="full">
            <Checkbox
              checked={avisoSonoro}
              onChange={(e) => setAvisoSonoro(e.target.checked)}
            />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text="Aviso sonoro" />
              <Font
                variant="description"
                text="Será emitido um aviso sonoro quando um novo pedido for recebido."
                color="muted"
              />
            </Stack>
          </Stack>

          {/* Aviso Sonoro Contínuo (Recuado) */}
          {avisoSonoro && (
            <Stack direction="row" gap={5} w="full">
              {/* Linha vertical de recuo */}
              <Box w="w-[2px]" bg="bg-border" shrink="0" />
              <Stack direction="row" align="start" gap={2.5} flex="1">
                <Checkbox
                  checked={avisoContinuo}
                  onChange={(e) => setAvisoContinuo(e.target.checked)}
                />
                <Stack gap={1} flex="1">
                  <Font variant="body-bold" text="Aviso sonoro contínuo" />
                  <Font
                    variant="description"
                    text='O aviso sonoro será contínuo até que o pedido do Catálogo Online seja alterado para "Aberto" ou excluído.'
                    color="muted"
                  />
                </Stack>
              </Stack>
            </Stack>
          )}

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
          text="ℹ️ O dispositivo selecionado receberá tanto os pedidos do Catálogo Online, quanto do Menu Digital."
          color="muted"
        />
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
