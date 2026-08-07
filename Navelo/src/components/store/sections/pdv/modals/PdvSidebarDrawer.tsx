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
  onNavigate: (view: "negociacoes" | "clientes" | "devolucao" | "totais-em-caixa" | "recebimentos" | "sangrias-suprimentos") => void
  onOpenObservationModal: () => void
  onOpenSangriaModal: (mode?: "sangria" | "suprimento") => void
  onOpenDiscountModal: () => void
  onSyncClick?: () => void
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
}) => {
  const syncStatus = useSyncStatus()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Menu" variant="sidebar">
      <Stack gap={5}>
        {/* Sincronizacao */}
        <Box
          w="full"
          bg="bg-surface-sunken"
          padding={2.5}
          radius="default"
          cursor="pointer"
          onClick={() => {
            onSyncClick?.()
          }}
        >
          <Stack direction="row" align="center" justify="between" w="full">
            <Stack direction="row" align="center" gap={2.5}>
              <Icon icon={syncStatus.isSynced ? Cloud : AlertTriangle} size={16} color={syncStatus.isSynced ? "primary" : "warning"} />
              <Font variant="body-sm-semibold" text="Sincronização" />
            </Stack>
            <Font variant="body-sm-medium" color={syncStatus.isSynced ? "muted" : "warning"} text={syncStatus.statusText} />
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
              hoverBg="surface-sunken"
              onClick={() => { onClose(); onNavigate("negociacoes") }}
            >
              <Font variant="body-sm-semibold" text="Buscar negociacoes" align="left" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="surface-sunken"
              onClick={() => { onClose(); onNavigate("clientes") }}
            >
              <Font variant="body-sm-semibold" text="Ultimas negociacoes" align="left" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="surface-sunken"
              onClick={() => { onClose() }}
            >
              <Font variant="body-sm-semibold" text="Finalizar atendimentos" align="left" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="surface-sunken"
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
              hoverBg="surface-sunken"
              onClick={() => { onClose(); onNavigate("clientes") }}
            >
              <Stack direction="row" align="center" justify="between" w="full">
                <Font variant="body-sm-semibold" text="Cliente" align="left" />
                <Font variant="body-sm-medium" color="muted" text="Nao selecionado" />
              </Stack>
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="surface-sunken"
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
              hoverBg="surface-sunken"
              onClick={() => { onClose(); onOpenObservationModal() }}
            >
              <Font variant="body-sm-semibold" text="Observacao" align="left" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="surface-sunken"
              onClick={() => { onClose(); onNavigate("recebimentos") }}
            >
              <Font variant="body-sm-semibold" text="Recebimentos" align="left" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="surface-sunken"
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
              hoverBg="surface-sunken"
              onClick={() => { onClose(); onOpenSangriaModal("sangria") }}
            >
              <Font variant="body-sm-semibold" text="Sangria" align="left" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="surface-sunken"
              onClick={() => { onClose(); onOpenSangriaModal("suprimento") }}
            >
              <Font variant="body-sm-semibold" text="Suprimento" align="left" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="surface-sunken"
              onClick={() => { onClose(); onNavigate("sangrias-suprimentos") }}
            >
              <Font variant="body-sm-semibold" text="Buscar sangrias/suprimentos" align="left" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              padding={2.5}
              w="full"
              cursor="pointer"
              hoverBg="surface-sunken"
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
              hoverBg="surface-sunken"
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
