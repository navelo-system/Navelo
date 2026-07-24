/* eslint-disable max-lines-per-function */
"use client"

import * as React from "react"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Icon } from "@/components/store/base/Icon"
import { Modal } from "@/components/store/base/Modal"
import { Cloud } from "lucide-react"

interface PdvSidebarDrawerProps {
  isOpen: boolean
  onClose: () => void
  onBackToDashboard: () => void
  onNavigate: (view: "negociacoes" | "clientes" | "devolucao" | "totais-em-caixa" | "recebimentos" | "sangrias-suprimentos") => void
  onOpenObservationModal: () => void
  onOpenSangriaModal: (mode?: "sangria" | "suprimento") => void
  onOpenDiscountModal: () => void
}

export const PdvSidebarDrawer: React.FC<PdvSidebarDrawerProps> = ({
  isOpen,
  onClose,
  onBackToDashboard,
  onNavigate,
  onOpenObservationModal,
  onOpenSangriaModal,
  onOpenDiscountModal,
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
            <Button
              variant="ghost-menu"
              fullWidth
              justify="start"
              label="Buscar negociacoes"
              onClick={() => { onClose(); onNavigate("negociacoes") }}
            />
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Button
              variant="ghost-menu"
              fullWidth
              justify="start"
              label="Ultimas negociacoes"
              onClick={() => { onClose(); onNavigate("clientes") }}
            />
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Button
              variant="ghost-menu"
              fullWidth
              justify="start"
              label="Finalizar atendimentos"
              onClick={() => { onClose() }}
            />
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Button
              variant="ghost-menu"
              fullWidth
              justify="start"
              label="Cancelar operacao"
              onClick={() => { onClose() }}
            />
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
                <Font variant="body-sm-semibold" text="Cliente" />
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
                <Font variant="body-sm-semibold" text="Desconto na venda" />
                <Font variant="body-sm-medium" color="muted" text="0,00%" />
              </Stack>
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Button
              variant="ghost-menu"
              fullWidth
              justify="start"
              label="Observacao"
              onClick={() => { onClose(); onOpenObservationModal() }}
            />
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Button
              variant="ghost-menu"
              fullWidth
              justify="start"
              label="Recebimentos"
              onClick={() => { onClose(); onNavigate("recebimentos") }}
            />
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Button
              variant="ghost-menu"
              fullWidth
              justify="start"
              label="Devolucao"
              onClick={() => { onClose(); onNavigate("devolucao") }}
            />
          </Box>
        </Stack>

        {/* Outras operacoes */}
        <Stack gap={2.5}>
          <Font variant="body-xs-bold" color="muted" text="OUTRAS OPERACOES" />
          <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
            <Button
              variant="ghost-menu"
              fullWidth
              justify="start"
              label="Sangria"
              onClick={() => { onClose(); onOpenSangriaModal("sangria") }}
            />
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Button
              variant="ghost-menu"
              fullWidth
              justify="start"
              label="Suprimento"
              onClick={() => { onClose(); onOpenSangriaModal("suprimento") }}
            />
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Button
              variant="ghost-menu"
              fullWidth
              justify="start"
              label="Buscar sangrias/suprimentos"
              onClick={() => { onClose(); onNavigate("sangrias-suprimentos") }}
            />
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Button
              variant="ghost-menu"
              fullWidth
              justify="start"
              label="Totais em caixa"
              onClick={() => { onClose(); onNavigate("totais-em-caixa") }}
            />
          </Box>
        </Stack>

        {/* Opcoes */}
        <Stack gap={2.5}>
          <Font variant="body-xs-bold" color="muted" text="OPCOES" />
          <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
            <Button
              variant="ghost-menu"
              label="Voltar ao Painel Geral"
              fullWidth
              justify="start"
              onClick={onBackToDashboard}
            />
          </Box>
        </Stack>
      </Stack>
    </Modal>
  )
}
