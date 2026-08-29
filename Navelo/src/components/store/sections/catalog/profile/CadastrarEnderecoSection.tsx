"use client"

import React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Switch } from "@/components/store/base/Switch"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { ArrowLeft, MapPin, Shield } from "lucide-react"

export function CadastrarEnderecoSection() {
  return (
    <Stack align="center" w="full">
      <Box maxW="820" padding={0} w="full">
        {/* Header local */}
        <Box padding={5} borderBottom borderColor="border-border" display="flex" align="center" justify="between">
          <Icon icon={ArrowLeft} cursor="pointer" />
          <Font variant="h4" text="Cadastrar endereço" />
          <Box w="24px" />
        </Box>

        {/* Corpo - Formulário */}
        <Box padding={5}>
          <Stack gap={5}>
            {/* Linha 1 */}
            <Box display="flex" direction="row" w="full">
              <Stack direction="row" w="full" gap={5}>
                <Box flex="1">
                  <CustomSelect
                    label="Nome do endereço"
                    value="casa"
                    onChange={() => {}}
                  >
                    <CustomSelectItem value="casa" text="Casa" icon={MapPin} />
                    <CustomSelectItem value="trabalho" text="Trabalho" icon={MapPin} />
                  </CustomSelect>
                </Box>
                <Box flex="1">
                  <Input
                    label="CEP"
                    placeholder="00000-000"
                    iconRight={Shield}
                  />
                </Box>
              </Stack>
            </Box>

            {/* Linha 2 */}
            <Box display="flex" direction="row" w="full">
              <Stack direction="row" w="full" gap={5}>
                <Box flex="1">
                  <Input label="Endereço *" placeholder="Digite a rua, avenida, travessa..." />
                </Box>
                <Box flex="1">
                  <Input label="Bairro *" placeholder="Digite o bairro" />
                </Box>
              </Stack>
            </Box>

            {/* Linha 3 */}
            <Box display="flex" direction="row" w="full">
              <Stack direction="row" w="full" gap={5}>
                <Box flex="1">
                  <Input label="Número *" placeholder="Digite o Nº" />
                </Box>
                <Box flex="1">
                  <Input label="Complemento" placeholder="Digite o complemento" />
                </Box>
                <Box flex="1">
                  <Input label="UF *" placeholder="RS, SC..." />
                </Box>
              </Stack>
            </Box>

            {/* Linha 4 */}
            <Box display="flex" direction="row" w="full">
              <Stack direction="row" w="full" gap={5}>
                <Box flex="1">
                  <Input label="Cidade *" placeholder="Digite a cidade" />
                </Box>
                <Box flex="1">
                  <Input label="Referência" placeholder="Digite uma referência" />
                </Box>
              </Stack>
            </Box>

            {/* Toggle Principal */}
            <Box padding={5} border borderColor="border-border" radius="default">
              <Stack direction="row" align="center" justify="between">
                <Stack gap={0}>
                  <Font variant="body-semibold" text="Endereço principal" />
                  <Font variant="description" color="muted" text="Você só pode ter um endereço principal, deseja tornar este?" />
                </Stack>
                <Switch checked={false} onChange={() => {}} />
              </Stack>
            </Box>

            {/* Botão Salvar */}
            <Stack align="center" w="full">
              <Box w="1/2" padding={5}>
                <Button variant="primary" label="Salvar" fullWidth />
              </Box>
            </Stack>

          </Stack>
        </Box>
      </Box>
    </Stack>
  )
}
