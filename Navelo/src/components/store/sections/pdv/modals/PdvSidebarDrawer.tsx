/* eslint-disable max-lines-per-function */
"use client"

import * as React from "react"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Modal } from "@/components/store/base/Modal"
import { Cloud } from "lucide-react"

interface PdvSidebarDrawerProps {
  isOpen: boolean
  onClose: () => void
  onBackToDashboard: () => void
}

export const PdvSidebarDrawer: React.FC<PdvSidebarDrawerProps> = ({
  isOpen,
  onClose,
  onBackToDashboard,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Menu" variant="sidebar">
      <Stack gap={5}>
        {/* Sincronizacao */}
        <Box w="full" bg="bg-surface-sunken" padding={2.5} radius="default">
          <Stack direction="row" align="center" justify="between" w="full">
            <Stack direction="row" align="center" gap={2.5}>
              <Icon icon={Cloud} size={16} color="primary" />
              <Font variant="body-sm-semibold" text="Sincronizacao" />
            </Stack>
            <Font variant="body-sm-medium" color="muted" text="Sincronizado" />
          </Stack>
        </Box>

        {/* Negociacao */}
        <Stack gap={2.5}>
          <Font variant="body-xs-bold" color="muted" text="NEGOCIACAO" />
          <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
            <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start">
              <Font variant="body-sm-semibold" text="Buscar negociacoes" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start">
              <Font variant="body-sm-semibold" text="Ultimas negociacoes" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start">
              <Font variant="body-sm-semibold" text="Finalizar atendimentos" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start">
              <Font variant="body-sm-semibold" text="Cancelar operacao" />
            </Box>
          </Box>
        </Stack>

        {/* Detalhes */}
        <Stack gap={2.5}>
          <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
            <Box padding={2.5} w="full">
              <Stack direction="row" align="center" justify="between" w="full">
                <Font variant="body-sm-semibold" text="Cliente" />
                <Font variant="body-sm-medium" color="muted" text="Nao selecionado" />
              </Stack>
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box padding={2.5} w="full">
              <Stack direction="row" align="center" justify="between" w="full">
                <Font variant="body-sm-semibold" text="Desconto na venda" />
                <Font variant="body-sm-medium" color="muted" text="0,00%" />
              </Stack>
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start">
              <Font variant="body-sm-semibold" text="Observacao" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start">
              <Font variant="body-sm-semibold" text="Recebimentos" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start">
              <Font variant="body-sm-semibold" text="Devolucao" />
            </Box>
          </Box>
        </Stack>

        {/* Outras operacoes */}
        <Stack gap={2.5}>
          <Font variant="body-xs-bold" color="muted" text="OUTRAS OPERACOES" />
          <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
            <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start">
              <Font variant="body-sm-semibold" text="Sangria" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start">
              <Font variant="body-sm-semibold" text="Suprimento" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start">
              <Font variant="body-sm-semibold" text="Buscar sangrias/suprimentos" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start">
              <Font variant="body-sm-semibold" text="Totais em caixa" />
            </Box>
          </Box>
        </Stack>

        {/* Opcoes */}
        <Stack gap={2.5}>
          <Font variant="body-xs-bold" color="muted" text="OPCOES" />
          <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
            <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start" onClick={onBackToDashboard}>
              <Font variant="body-sm-semibold" text="Voltar ao Painel Geral" />
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Modal>
  )
}
