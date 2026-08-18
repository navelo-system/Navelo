"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { UI_STRINGS } from "@/constants/strings"

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
  const s = UI_STRINGS.receipts

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel, s.title])

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
            <Font variant="body-bold" text={s.title} />
            <Font
              variant="description"
              text={s.headerDesc}
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
                <Font variant="body-bold" text={s.cancellationTitle} />
                <Font
                  variant="description"
                  text={s.cancellationDesc}
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
              <Font variant="body-bold" text={s.carneTitle} />
              <Switch checked={carne} onChange={(e) => setCarne(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Fechamento de caixa */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Font variant="body-bold" text={s.cashClosingTitle} />
              <Switch checked={fechamento} onChange={(e) => setFechamento(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* DANFE Simplificado NF-e */}
          <Box padding={5} w="full" bg="bg-surface/50">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack gap={1} flex="1">
                <Font variant="body-bold" text={s.danfeSimplifiedTitle} />
                <Font
                  variant="description"
                  text={s.danfeSimplifiedDesc}
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
              <Font variant="body-bold" text={s.nfceTitle} />
              <Switch checked={nfce} onChange={(e) => setNfce(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Número de atendimento */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack gap={1} flex="1">
                <Font variant="body-bold" text={s.orderNumberTitle} />
                <Font
                  variant="description"
                  text={s.orderNumberDesc}
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
                <Font variant="body-bold" text={s.orderServiceTitle} />
                <Font
                  variant="description"
                  text={s.orderServiceDesc}
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
              <Font variant="body-bold" text={s.pixTitle} />
              <Switch checked={pix} onChange={(e) => setPix(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Recebimento de crediário */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Font variant="body-bold" text={s.crediarioTitle} />
              <Switch checked={crediario} onChange={(e) => setCrediario(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Sangria */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Font variant="body-bold" text={s.sangriaTitle} />
              <Switch checked={sangria} onChange={(e) => setSangria(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Suprimento */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Font variant="body-bold" text={s.suprimentoTitle} />
              <Switch checked={suprimento} onChange={(e) => setSuprimento(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Ticket */}
          <Box padding={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack gap={1} flex="1">
                <Font variant="body-bold" text={s.ticketTitle} />
                <Font
                  variant="description"
                  text={s.ticketDesc}
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
                <Font variant="body-bold" text={s.posTransactionTitle} />
                <Font
                  variant="description"
                  text={s.posTransactionDesc}
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
              <Font variant="body-bold" text={s.saleTitle} />
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
          <Font variant="body-bold" text={s.settingsCardTitle} />
        </Box>

        <Box h="h-[1px]" w="full" bg="bg-border" />

        {/* Logomarca */}
        <Box padding={5} w="full">
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text={s.logoTitle} />
              <Font
                variant="description"
                text={s.logoDesc}
                color="muted"
              />
            </Stack>
            <Switch checked={logomarca} onChange={(e) => setLogomarca(e.target.checked)} />
          </Stack>
        </Box>
      </Box>

      {/* Ações de Cancelar / Salvar */}
      <FormActions
        confirmLabel={UI_STRINGS.common.save}
        onConfirm={handleSave}
        onCancel={onCancel}
      />
    </Stack>
  )
}
