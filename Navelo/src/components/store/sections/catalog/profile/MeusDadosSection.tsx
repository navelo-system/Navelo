"use client"

import React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { ArrowLeft, User, Phone, Mail } from "lucide-react"

export function MeusDadosSection() {
  return (
    <Stack align="center" w="full">
      <Box maxW="820" padding={0} w="full">
        {/* Header local */}
        <Box padding={5} borderBottom borderColor="border-border" display="flex" align="center" justify="between">
          <Icon icon={ArrowLeft} cursor="pointer" />
          <Font variant="h4" text="Meus dados" />
          <Box cursor="pointer">
            <Font variant="body-bold" text="Excluir conta" color="danger" />
          </Box>
        </Box>

        {/* Corpo */}
        <Box padding={5}>
          <Stack align="center" w="full">
            <Box w="full" maxW="md" bg="bg-surface" radius="default" border borderColor="border-border">
              {/* Item Nome */}
              <Box padding={5} borderBottom borderColor="border-border">
                <Stack direction="row" align="center" gap={5}>
                  <Icon icon={User} color="primary" />
                  <Stack gap={0}>
                    <Font variant="description" color="muted" text="Nome completo" />
                    <Font variant="body" text="Marcos Gomes" />
                  </Stack>
                </Stack>
              </Box>

              {/* Item Telefone */}
              <Box padding={5} borderBottom borderColor="border-border">
                <Stack direction="row" align="center" gap={5}>
                  <Icon icon={Phone} color="primary" />
                  <Stack gap={0}>
                    <Font variant="description" color="muted" text="Telefone" />
                    <Font variant="body" text="+55 (41) 99836-4028" />
                  </Stack>
                </Stack>
              </Box>

              {/* Item E-mail */}
              <Box padding={5}>
                <Stack direction="row" align="center" gap={5}>
                  <Icon icon={Mail} color="primary" />
                  <Stack gap={0}>
                    <Font variant="description" color="muted" text="E-mail" />
                    <Font variant="body" text="marcoscontatoprof@gmail.com" />
                  </Stack>
                </Stack>
              </Box>
            </Box>
            
            <Box w="full" maxW="md" padding={2.5} cursor="pointer">
              <Font variant="body-bold" text="Editar perfil" color="primary" />
            </Box>
          </Stack>
        </Box>
      </Box>
    </Stack>
  )
}
