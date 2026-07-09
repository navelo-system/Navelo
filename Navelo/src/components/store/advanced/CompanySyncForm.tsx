"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Switch } from "../base/Switch"
import { Icon } from "../base/Icon"
import { Laptop, Server, ChevronRight, CheckCircle } from "lucide-react"

export interface CompanySyncFormProps {
  onCancel?: () => void
}

export const CompanySyncForm: React.FC<CompanySyncFormProps> = () => {
  const [isEnabled, setIsEnabled] = React.useState(true)

  return (
    <Stack gap={5} w="full">
      {/* Card list */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={0}
        w="full"
        overflow="hidden"
      >
        <Stack gap={0} w="full">
          {/* Item 1: Habilitar (Toggle/Switch) */}
          <Box padding={5}>
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack gap={1}>
                <Font variant="body-bold" text="Habilitar" />
                <Font variant="description" text="Sincronize os dados entre dispositivos." />
              </Stack>
              <Switch checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Item 2: Identificação */}
          <Box
            padding={5}
            cursor="pointer"
            hoverBg="primary/10"
            onClick={() => {}}
          >
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack direction="row" align="center" gap={5}>
                <Icon icon={Laptop} size={20} color="muted" />
                <Stack gap={1}>
                  <Font variant="body-bold" text="Identificação" />
                  <Font variant="description" text="Dispositivo 16" />
                </Stack>
              </Stack>
              <Icon icon={ChevronRight} size={20} color="muted" />
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Item 3: Ambiente do servidor */}
          <Box
            padding={5}
            cursor="pointer"
            hoverBg="primary/10"
            onClick={() => {}}
          >
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack direction="row" align="center" gap={5}>
                <Icon icon={Server} size={20} color="muted" />
                <Stack gap={1}>
                  <Font variant="body-bold" text="Ambiente do servidor" />
                  <Font variant="description" text="Nuvem" />
                </Stack>
              </Stack>
              <Icon icon={ChevronRight} size={20} color="muted" />
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Box Sincronizado */}
      <Box
        padding={5}
        radius="default"
        border={true}
        bg="bg-brand-success/10"
        borderColor="border-brand-success/20"
        w="full"
      >
        <Stack direction="row" gap={5} align="start" w="full">
          <Box shrink="0">
            <Icon icon={CheckCircle} color="success" size={20} />
          </Box>
          <Stack gap={1} flex="1">
            <Font variant="body-semibold" color="success" text="Sincronizado" />
            <Font variant="description" color="success" text="Última verificação: 08/07/2026 22:50" />
            <Font variant="description" color="success" text="Última atualização de dados: 05/07/2026 07:28" />
          </Stack>
        </Stack>
      </Box>

      {/* Disclaimer */}
      <Font
        variant="description"
        color="muted"
        text="O sistema verifica periodicamente se há novidades. Caso não haja alterações, a data de atualização permanece a mesma."
      />
    </Stack>
  )
}
