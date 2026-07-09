"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../../base/Box"
import { Stack } from "../../../base/Stack"
import { Font } from "../../../base/Font"
import { Button } from "../../../base/Button"
import { Icon } from "../../../base/Icon"
import { Maximize2, X, Cloud } from "lucide-react"

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
  if (!isOpen) return null

  return (
    <Box position="fixed" top={0} left={0} right={0} bottom={0} zIndex="50" display="flex" justify="end">
      {/* Backdrop */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="bg-black/50"
        onClick={onClose}
      />
      {/* Drawer Body */}
      <Box
        w="w-full max-w-xs"
        h="full"
        bg="bg-surface"
        display="flex"
        direction="col"
        position="relative"
        zIndex="50"
        border={true}
        borderColor="border-border"
        shadow="default"
      >
        {/* Header */}
        <Box padding={5}>
          <Stack direction="row" align="center" justify="between" w="full">
            <Font variant="h3" text="Menu" />
            <Stack direction="row" gap={2.5}>
              <Button variant="outline-pill-icon-xs" icon={Maximize2} />
              <Button variant="outline-pill-icon-xs" icon={X} onClick={onClose} />
            </Stack>
          </Stack>
        </Box>
        <Box h="h-[1px]" w="full" bg="bg-border" />

        {/* Scrollable Content */}
        <Box flex="1" overflow="x-hidden y-auto" padding={5}>
          <Stack gap={5}>
            {/* Sincronização */}
            <Box w="full" bg="bg-surface-sunken" padding={2.5} radius="default">
              <Stack direction="row" align="center" justify="between" w="full">
                <Stack direction="row" align="center" gap={2.5}>
                  <Icon icon={Cloud} size={16} color="primary" />
                  <Font variant="body-sm-semibold" text="Sincronização" />
                </Stack>
                <Font variant="body-sm-medium" color="muted" text="Sincronizado" />
              </Stack>
            </Box>

            {/* Negociação */}
            <Stack gap={2.5}>
              <Font variant="body-xs-bold" color="muted" text="NEGOCIAÇÃO" />
              <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
                <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start">
                  <Font variant="body-sm-semibold" text="Buscar negociações" />
                </Box>
                <Box h="h-[1px]" w="full" bg="bg-border" />
                <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start">
                  <Font variant="body-sm-semibold" text="Últimas negociações" />
                </Box>
                <Box h="h-[1px]" w="full" bg="bg-border" />
                <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start">
                  <Font variant="body-sm-semibold" text="Finalizar atendimentos" />
                </Box>
                <Box h="h-[1px]" w="full" bg="bg-border" />
                <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start">
                  <Font variant="body-sm-semibold" text="Cancelar operação" />
                </Box>
              </Box>
            </Stack>

            {/* Detalhes */}
            <Stack gap={2.5}>
              <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
                <Box padding={2.5} w="full">
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Font variant="body-sm-semibold" text="Cliente" />
                    <Font variant="body-sm-medium" color="muted" text="Não selecionado" />
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
                  <Font variant="body-sm-semibold" text="Observação" />
                </Box>
                <Box h="h-[1px]" w="full" bg="bg-border" />
                <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start">
                  <Font variant="body-sm-semibold" text="Recebimentos" />
                </Box>
                <Box h="h-[1px]" w="full" bg="bg-border" />
                <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start">
                  <Font variant="body-sm-semibold" text="Devolução" />
                </Box>
              </Box>
            </Stack>

            {/* Outras operações */}
            <Stack gap={2.5}>
              <Font variant="body-xs-bold" color="muted" text="OUTRAS OPERAÇÕES" />
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

            {/* Opções */}
            <Stack gap={2.5}>
              <Font variant="body-xs-bold" color="muted" text="OPÇÕES" />
              <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
                <Box as="button" w="full" padding={2.5} hoverBg="surface-sunken" display="flex" justify="start" onClick={onBackToDashboard}>
                  <Font variant="body-sm-semibold" text="Voltar ao Painel Geral" />
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
