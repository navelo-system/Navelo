/* eslint-disable max-lines-per-function */
"use client"

import * as React from "react"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Modal } from "@/components/store/base/Modal"
import { Cloud, AlertTriangle } from "lucide-react"
import { useSyncStatus } from "@/lib/dal/hooks"

interface PdvSidebarDrawerProps {
  isOpen: boolean
  onClose: () => void
  onBackToDashboard: () => void
  onNavigate: (view: "negociacoes" | "clientes" | "devolucao" | "totais-em-caixa" | "recebimentos" | "sangrias-suprimentos" | "ultimas-negociacoes") => void
  onOpenObservationModal: () => void
  onOpenSangriaModal: (mode?: "sangria" | "suprimento") => void
  onOpenDiscountModal: () => void
  onSyncClick?: () => void
  customerName?: string
  showOutOfStockProducts?: boolean
  onToggleShowOutOfStock?: (val: boolean) => void
}

export const PdvSidebarDrawer: React.FC<PdvSidebarDrawerProps> = ({
  isOpen,
  onClose,
  onBackToDashboard,
  onNavigate,
  onOpenObservationModal,
  onOpenSangriaModal,
  onOpenDiscountModal,
  onSyncClick,
  customerName,
  showOutOfStockProducts = true,
  onToggleShowOutOfStock,
}) => {
  const syncStatus = useSyncStatus()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Menu" variant="sidebar">
      <Stack gap={5}>
        {/* Sincronizacao */}
        <Box
          w="full"
          bg="bg-brand-secondary/10"
          padding={2.5}
          radius="default"
          cursor={syncStatus.pendingCount > 0 ? "pointer" : undefined}
          onClick={syncStatus.pendingCount > 0 ? onSyncClick : undefined}
        >
          <Stack gap={1}>
            <Stack direction="row" align="center" gap={2.5}>
              <Icon icon={syncStatus.pendingCount > 0 ? AlertTriangle : Cloud} size={16} color="primary" />
              <Font variant="body-bold" color="primary" text="Sincronização" align="left" />
            </Stack>

            <Font
              variant="auxiliary"
              color="muted"
              text={
                syncStatus.pendingCount > 0
                  ? `${syncStatus.pendingCount} alteração(ões) pendente(s)`
                  : "Todos os dados estão sincronizados"
              }
              align="left"
            />
          </Stack>
        </Box>

        {/* Negociacao */}
        <Stack gap={2.5}>
          <Font variant="body-xs-bold" color="muted" text="NEGOCIACAO" />
          <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="secondary/10"
              onClick={() => { onClose(); onNavigate("negociacoes") }}
            >
              <Font variant="body-sm-semibold" text="Buscar negociacoes" align="left" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="secondary/10"
              onClick={() => { onClose(); onNavigate("ultimas-negociacoes") }}
            >
              <Font variant="body-sm-semibold" text="Ultimas negociacoes" align="left" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="secondary/10"
              onClick={() => { onClose() }}
            >
              <Font variant="body-sm-semibold" text="Finalizar atendimentos" align="left" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="secondary/10"
              onClick={() => { onClose() }}
            >
              <Font variant="body-sm-semibold" text="Cancelar operacao" align="left" />
            </Box>
          </Box>
        </Stack>

        {/* Detalhes */}
        <Stack gap={2.5}>
          <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="secondary/10"
              onClick={() => { onClose(); onNavigate("clientes") }}
            >
              <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
                <Box shrink="0">
                  <Font variant="body-sm-semibold" text="Cliente" align="left" />
                </Box>
                <Box flex="1" minW="0" overflow="hidden" display="flex" justify="end">
                  <Font as="div" variant="body-sm-medium" color="muted" align="right" truncate={true} lineClamp={1} text={customerName || "Nao selecionado"} />
                </Box>
              </Stack>
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="secondary/10"
              onClick={() => { onClose(); onOpenDiscountModal() }}
            >
              <Stack direction="row" align="center" justify="between" w="full">
                <Font variant="body-sm-semibold" text="Desconto na venda" align="left" />
                <Font variant="body-sm-medium" color="muted" text="0,00%" />
              </Stack>
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="secondary/10"
              onClick={() => { onClose(); onOpenObservationModal() }}
            >
              <Font variant="body-sm-semibold" text="Observacao" align="left" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="secondary/10"
              onClick={() => { onClose(); onNavigate("recebimentos") }}
            >
              <Font variant="body-sm-semibold" text="Recebimentos" align="left" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="secondary/10"
              onClick={() => { onClose(); onNavigate("devolucao") }}
            >
              <Font variant="body-sm-semibold" text="Devolucao" align="left" />
            </Box>
          </Box>
        </Stack>

        {/* Outras operacoes */}
        <Stack gap={2.5}>
          <Font variant="body-xs-bold" color="muted" text="OUTRAS OPERACOES" />
          <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="secondary/10"
              onClick={() => { onClose(); onOpenSangriaModal("sangria") }}
            >
              <Font variant="body-sm-semibold" text="Sangria" align="left" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="secondary/10"
              onClick={() => { onClose(); onOpenSangriaModal("suprimento") }}
            >
              <Font variant="body-sm-semibold" text="Suprimento" align="left" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="secondary/10"
              onClick={() => { onClose(); onNavigate("sangrias-suprimentos") }}
            >
              <Font variant="body-sm-semibold" text="Buscar sangrias/suprimentos" align="left" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="secondary/10"
              onClick={() => { onClose(); onNavigate("totais-em-caixa") }}
            >
              <Font variant="body-sm-semibold" text="Totais em caixa" align="left" />
            </Box>
          </Box>
        </Stack>

        {/* Opcoes */}
        <Stack gap={2.5}>
          <Font variant="body-xs-bold" color="muted" text="OPCOES" />
          <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="secondary/10"
              onClick={() => onToggleShowOutOfStock?.(!showOutOfStockProducts)}
            >
              <Stack direction="row" align="center" justify="between" w="full">
                <Font variant="body-sm-semibold" text="Exibir produtos sem estoque" align="left" />
                <Font variant="body-sm-medium" color={showOutOfStockProducts ? "success" : "muted"} text={showOutOfStockProducts ? "Sim" : "Não"} />
              </Stack>
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="secondary/10"
              onClick={onBackToDashboard}
            >
              <Font variant="body-sm-semibold" text="Voltar ao Painel Geral" align="left" />
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Modal>
  )
}
