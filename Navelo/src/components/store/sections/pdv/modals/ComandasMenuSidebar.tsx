"use client"

import * as React from "react"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Modal } from "@/components/store/base/Modal"
import { Cloud } from "lucide-react"

interface ComandasMenuSidebarProps {
  isOpen: boolean
  onClose: () => void
  onNewComanda: () => void
  onFinishAll: () => void
}

export const ComandasMenuSidebar: React.FC<ComandasMenuSidebarProps> = ({
  isOpen,
  onClose,
  onNewComanda,
  onFinishAll,
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

        {/* Atendimento */}
        <Stack gap={2.5}>
          <Font variant="body-xs-bold" color="muted" text="ATENDIMENTO" />
          <Box display="flex" direction="col" bg="bg-surface" border={true} borderColor="border-border" radius="default" overflow="hidden">
            <Box
              as="button"
              w="full"
              padding={2.5}
              hoverBg="surface-sunken"
              display="flex"
              justify="start"
              onClick={() => {
                onClose()
                onNewComanda()
              }}
            >
              <Font variant="body-sm-semibold" text="Novo atendimento avulso" />
            </Box>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Box
              as="button"
              w="full"
              padding={2.5}
              hoverBg="surface-sunken"
              display="flex"
              justify="start"
              onClick={() => {
                onClose()
                onFinishAll()
              }}
            >
              <Font variant="body-sm-semibold" text="Finalizar atendimentos" />
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Modal>
  )
}
