"use client"

import React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { ArrowLeft, User, MapPin, ChevronRight, LogOut } from "lucide-react"

export function MeuPerfilSection() {
  return (
    <Stack align="center" w="full">
      <Box maxW="820" padding={0} w="full">
        {/* Header local */}
        <Box padding={5} borderBottom borderColor="border-border" display="flex" align="center" justify="between">
          <Icon icon={ArrowLeft} cursor="pointer" />
          <Font variant="h4" text="Meu perfil" />
          <Box w="24px" /> {/* Placeholder para centralizar */}
        </Box>
      </Box>

      {/* Corpo */}
      <Box padding={5}>
        <Stack gap={5} direction="row" align="stretch">
          {/* Card Dados pessoais */}
          <Box
            flex="1"
            bg="bg-surface"
            padding={5}
            radius="default"
            border
            borderColor="border-border"
            cursor="pointer"
            hoverBg="surface-sunken"
          >
            <Stack direction="row" align="center" justify="between">
              <Stack direction="row" align="center" gap={5}>
                <Box bg="bg-brand-primary/10" padding={2.5} radius="full">
                  <Icon icon={User} color="primary" />
                </Box>
                <Stack gap={0}>
                  <Font variant="body-semibold" text="Dados pessoais" />
                  <Font variant="description" color="muted" text="Nome, e-mail, telefone, cpf/cnpj" />
                </Stack>
              </Stack>
              <Icon icon={ChevronRight} color="muted" />
            </Stack>
          </Box>

          {/* Card Endereços */}
          <Box
            flex="1"
            bg="bg-surface"
            padding={5}
            radius="default"
            border
            borderColor="border-border"
            cursor="pointer"
            hoverBg="surface-sunken"
          >
            <Stack direction="row" align="center" justify="between">
              <Stack direction="row" align="center" gap={5}>
                <Box bg="bg-brand-primary/10" padding={2.5} radius="full">
                  <Icon icon={MapPin} color="primary" />
                </Box>
                <Stack gap={0}>
                  <Font variant="body-semibold" text="Endereços" />
                  <Font variant="description" color="muted" text="Endereços de entrega" />
                </Stack>
              </Stack>
              <Icon icon={ChevronRight} color="muted" />
            </Stack>
          </Box>
        </Stack>

        <Box padding={5}>
          <Stack direction="row" align="center" gap={2.5} cursor="pointer">
            <Icon icon={LogOut} color="primary" />
            <Box cursor="pointer">
              <Font variant="body-bold" color="primary" text="Encerrar sessão" />
            </Box>
          </Stack>
        </Box>
      </Box>
    </Stack>
  )
}
