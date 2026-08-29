"use client"

import React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Button } from "@/components/store/base/Button"
import { ArrowLeft, Home, User, Mail, Phone, MapPin, Edit3, Smartphone } from "lucide-react"

export function RevisaoPedidoSection() {
  return (
    <Stack align="center" w="full">
      <Box maxW="820" padding={0} w="full">
        {/* Header */}
        <Box padding={5} borderBottom borderColor="border-border" display="flex" align="center" justify="between">
          <Icon icon={ArrowLeft} cursor="pointer" />
          <Font variant="h4" text="Revisar pedido" />
          <Icon icon={Home} color="primary" cursor="pointer" />
        </Box>

        {/* Corpo */}
        <Box padding={5}>
          <Stack gap={5}>
            
            {/* Bloco Usuário */}
            <Box padding={5} borderBottom borderColor="border-border">
              <Stack gap={2.5}>
                <Stack direction="row" align="center" gap={2.5}>
                  <Icon icon={User} size={16} />
                  <Font variant="body-semibold" text="Marcos Gomes" />
                </Stack>
                <Stack direction="row" align="center" gap={2.5}>
                  <Icon icon={Mail} color="muted" size={16} />
                  <Font variant="description" color="muted" text="marcoscontatoprof@gmail.com" />
                </Stack>
                <Stack direction="row" align="center" gap={2.5}>
                  <Icon icon={Phone} color="muted" size={16} />
                  <Font variant="description" color="muted" text="+55 (41) 99836-4028" />
                </Stack>
              </Stack>
            </Box>

            {/* Bloco Entrega */}
            <Box padding={5} borderBottom borderColor="border-border">
              <Stack direction="row" align="start" justify="between">
                <Stack gap={5} w="full">
                  <Stack direction="row" align="center" justify="between">
                    <Stack direction="row" align="center" gap={2.5}>
                      <Icon icon={MapPin} size={16} />
                    <Font variant="body-bold" text="Entrega" />
                    </Stack>
                    <Box cursor="pointer">
                      <Font variant="body-bold" color="primary" text="Alterar" />
                    </Box>
                  </Stack>
                  <Stack direction="row" align="start" justify="between">
                    <Stack gap={0}>
                      <Stack direction="row" align="center" gap={1}>
                        <Icon icon={MapPin} size={12} color="muted" />
                        <Font variant="description" color="muted" text="Casa" />
                      </Stack>
                      <Font variant="description" color="muted" text="Rua Acre, 288, APTO 210 BL4" />
                      <Font variant="description" color="muted" text="Boneca do Iguaçu, São José dos Pinhais - PR" />
                    </Stack>
                    <Icon icon={Edit3} color="primary" size={16} cursor="pointer" />
                  </Stack>
                </Stack>
              </Stack>
            </Box>

            {/* Bloco Pagamento */}
            <Box padding={5} borderBottom borderColor="border-border">
              <Stack direction="row" align="start" justify="between">
                <Stack gap={5} w="full">
                  <Stack direction="row" align="center" justify="between">
                    <Stack direction="row" align="center" gap={2.5}>
                      <Icon icon={Smartphone} size={16} />
                      <Font variant="body-bold" text="Pagar agora" />
                    </Stack>
                    <Box cursor="pointer">
                      <Font variant="body-bold" color="primary" text="Alterar" />
                    </Box>
                  </Stack>
                  <Stack direction="row" align="start" justify="between">
                    <Stack gap={0}>
                      <Stack direction="row" align="center" gap={2.5}>
                        <Icon icon={MapPin} size={16} color="muted" /> {/* placeholder pro ícone do pix */}
                        <Font variant="description" color="muted" text="Pagamento com PIX" />
                      </Stack>
                      <Font variant="description" color="muted" text="Pague agora com PIX" />
                    </Stack>
                    <Icon icon={Edit3} color="primary" size={16} cursor="pointer" />
                  </Stack>
                </Stack>
              </Stack>
            </Box>

            {/* Bloco Itens do Pedido */}
            <Box padding={5}>
              <Stack gap={5}>
                <Stack direction="row" align="center" justify="between">
                  <Font variant="body-bold" text="Itens do pedido | 1 item" />
                  <Box cursor="pointer">
                    <Font variant="body-bold" color="primary" text="Alterar itens" />
                  </Box>
                </Stack>
                <Stack direction="row" align="center" justify="between">
                  <Stack direction="row" align="center" gap={2.5}>
                    <Font variant="body-bold" text="1x" />
                    <Font variant="body" text="COCA COLA 2L" />
                  </Stack>
                  <Font variant="body-bold" text="R$ 14,00" />
                </Stack>
              </Stack>
            </Box>

          </Stack>
        </Box>

        {/* Rodapé Fixo (simulado dentro do container) */}
        <Box padding={5} borderTop borderColor="border-border" display="flex" align="center" justify="between">
          <Stack gap={0}>
            <Font variant="description" color="muted" text="Subtotal" />
            <Font variant="h3" text="R$ 14,00" />
          </Stack>
          <Button variant="primary" label="Fazer pedido" />
        </Box>
      </Box>
    </Stack>
  )
}
