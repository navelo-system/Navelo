"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Switch } from "../../base/Switch"
import { Button } from "../../base/Button"

export interface ComprovantesSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const ComprovantesSection: React.FC<ComprovantesSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [cancelamento, setCancelamento] = React.useState(true)
  const [carne, setCarne] = React.useState(true)
  const [fechamento, setFechamento] = React.useState(true)
  const [danfe, setDanfe] = React.useState(true)
  const [nfce, setNfce] = React.useState(true)
  const [numeroAtendimento, setNumeroAtendimento] = React.useState(false)
  const [pedidoAtendimento, setPedidoAtendimento] = React.useState(true)
  const [pix, setPix] = React.useState(true)
  const [crediario, setCrediario] = React.useState(true)
  const [sangria, setSangria] = React.useState(true)
  const [suprimento, setSuprimento] = React.useState(true)
  const [ticket, setTicket] = React.useState(false)
  const [transacaoPos, setTransacaoPos] = React.useState(true)
  const [venda, setVenda] = React.useState(true)

  const [logomarca, setLogomarca] = React.useState(false)

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Comprovantes")
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
      {/* Card 1: Comprovantes */}
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
            <Font variant="body-bold" text="Comprovantes" />
            <Font
              variant="description"
              text="Os comprovantes habilitados serão impressos automaticamente."
              color="muted"
            />
          </Stack>
        </Box>

        <Box h="h-[1px]" w="full" bg="bg-border" />

        <Stack gap={0} w="full">
          {/* Cancelamento */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack gap={1} flex="1">
                <Font variant="body-bold" text="Cancelamento" />
                <Font
                  variant="description"
                  text="Impresso ao excluir uma negociação, sangria ou suprimento"
                  color="muted"
                />
              </Stack>
              <Switch checked={cancelamento} onChange={(e) => setCancelamento(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Carnê de pagamento */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Font variant="body-bold" text="Carnê de pagamento" />
              <Switch checked={carne} onChange={(e) => setCarne(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Fechamento de caixa */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Font variant="body-bold" text="Fechamento de caixa" />
              <Switch checked={fechamento} onChange={(e) => setFechamento(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* DANFE Simplificado NF-e */}
          <Box padding={5} w="full" bg="bg-surface/50">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack gap={1} flex="1">
                <Font variant="body-bold" text="DANFE Simplificado NF-e" />
                <Font
                  variant="description"
                  text="Impresso ao finalizar a venda quando a nota for NF-e para cliente com CNPJ e a emissão automática de NF-e estiver habilitada."
                  color="muted"
                />
              </Stack>
              <Switch checked={danfe} onChange={(e) => setDanfe(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* NFC-e */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Font variant="body-bold" text="NFC-e" />
              <Switch checked={nfce} onChange={(e) => setNfce(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Número de atendimento */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack gap={1} flex="1">
                <Font variant="body-bold" text="Número de atendimento" />
                <Font
                  variant="description"
                  text="Configure o próximo número no menu do Caixa ou na configuração do Autoatendimento."
                  color="muted"
                />
              </Stack>
              <Switch checked={numeroAtendimento} onChange={(e) => setNumeroAtendimento(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Pedido de atendimento */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack gap={1} flex="1">
                <Font variant="body-bold" text="Pedido de atendimento" />
                <Font
                  variant="description"
                  text="Imprime os itens do pedidos ao realizar um Delivery, Mesas/Comandas ou Autoatendimento."
                  color="muted"
                />
              </Stack>
              <Switch checked={pedidoAtendimento} onChange={(e) => setPedidoAtendimento(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Pix */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Font variant="body-bold" text="Pix" />
              <Switch checked={pix} onChange={(e) => setPix(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Recebimento de crediário */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Font variant="body-bold" text="Recebimento de crediário" />
              <Switch checked={crediario} onChange={(e) => setCrediario(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Sangria */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Font variant="body-bold" text="Sangria" />
              <Switch checked={sangria} onChange={(e) => setSangria(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Suprimento */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Font variant="body-bold" text="Suprimento" />
              <Switch checked={suprimento} onChange={(e) => setSuprimento(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Ticket */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack gap={1} flex="1">
                <Font variant="body-bold" text="Ticket" />
                <Font
                  variant="description"
                  text="Imprime um ticket para cada produto após a venda"
                  color="muted"
                />
              </Stack>
              <Switch checked={ticket} onChange={(e) => setTicket(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Transação POS */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack gap={1} flex="1">
                <Font variant="body-bold" text="Transação POS" />
                <Font
                  variant="description"
                  text="Impresso ao efetuar pagamentos no POS"
                  color="muted"
                />
              </Stack>
              <Switch checked={transacaoPos} onChange={(e) => setTransacaoPos(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Venda */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Font variant="body-bold" text="Venda" />
              <Switch checked={venda} onChange={(e) => setVenda(e.target.checked)} />
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Card 2: Configurações */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        overflow="hidden"
        w="full"
      >
        <Box padding={5} bg="bg-surface" w="full">
          <Font variant="body-bold" text="Configurações" />
        </Box>

        <Box h="h-[1px]" w="full" bg="bg-border" />

        {/* Logomarca */}
        <Box padding={5} w="full">
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text="Logomarca" />
              <Font
                variant="description"
                text="Imprime a logomarca configurada nos dados da empresa nos comprovantes"
                color="muted"
              />
            </Stack>
            <Switch checked={logomarca} onChange={(e) => setLogomarca(e.target.checked)} />
          </Stack>
        </Box>
      </Box>

      {/* Ações de Cancelar / Salvar */}
      <Box paddingY={2.5} w="full">
        <Stack direction="col" mobileDirection="row" justify="end" gap={2.5} w="full">
          <Button variant="outline" label="Cancelar" onClick={onCancel} />
          <Button type="button" variant="primary" label="Salvar alterações" onClick={handleSave} />
        </Stack>
      </Box>
    </Stack>
  )
}
