"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Input } from "../../base/Input"
import { Button } from "../../base/Button"
import { Switch } from "../../base/Switch"
import { CustomSelect, CustomSelectItem } from "../../base/CustomSelect"
import { Icon } from "../../base/Icon"
import { ShoppingBag, Globe, Info, Key } from "lucide-react"

export interface PixSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const PixSection: React.FC<PixSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [caixaEnabled, setCaixaEnabled] = React.useState(true)
  const [catalogoEnabled, setCatalogoEnabled] = React.useState(true)

  const [keyType, setKeyType] = React.useState("CPF/CNPJ")
  const [pixKey, setPixKey] = React.useState("38.383.365/0001-90")
  const [beneficiaryName, setBeneficiaryName] = React.useState("js soluções")
  const [beneficiaryCity, setBeneficiaryCity] = React.useState("Teófilo Otoni")
  const [additionalInfo, setAdditionalInfo] = React.useState("")

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Pix")
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel])

  const handleSave = () => {
    // Simulação de salvamento
    onCancel()
  }

  return (
    <Stack gap={5} w="full">
      {/* Card QR Code Pix */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          <Stack gap={1}>
            <Font variant="body-bold" text="QR Code Pix" />
            <Font
              variant="description"
              text="Quando habilitado, o sistema apresentará o QR Code da chave Pix na finalização da compra."
            />
          </Stack>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Opções por Canal */}
          <Stack gap={5} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack direction="row" align="center" gap={2.5}>
                <Icon icon={ShoppingBag} size={20} color="muted" />
                <Font variant="body" text="Caixa" />
              </Stack>
              <Switch
                checked={caixaEnabled}
                onChange={(e) => setCaixaEnabled(e.target.checked)}
              />
            </Stack>

            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack direction="row" align="center" gap={2.5}>
                <Icon icon={Globe} size={20} color="muted" />
                <Font variant="body" text="Catálogo Online" />
              </Stack>
              <Switch
                checked={catalogoEnabled}
                onChange={(e) => setCatalogoEnabled(e.target.checked)}
              />
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Card Dados da Chave */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          {/* Banner Informativo */}
          <Box
            bg="bg-surface-sunken"
            border={true}
            borderColor="border-border"
            radius="default"
            padding={5}
            w="full"
          >
            <Stack direction="row" gap={2.5} align="start" w="full">
              <Box shrink="0">
                <Icon icon={Info} size={20} color="muted" />
              </Box>
              <Font
                variant="description"
                text="A confirmação do pagamento deve ser feita por ferramenta própria da sua instituição financeira."
              />
            </Stack>
          </Box>

          {/* Campos do Formulário */}
          <Stack gap={2.5} w="full">
            <Font variant="body-bold" text="Tipo de chave" />
            <CustomSelect
              value={keyType}
              onChange={setKeyType}
            >
              <CustomSelectItem value="CPF/CNPJ" text="CPF/CNPJ" icon={Key} />
              <CustomSelectItem value="E-mail" text="E-mail" icon={Key} />
              <CustomSelectItem value="Telefone" text="Telefone" icon={Key} />
              <CustomSelectItem value="Chave Aleatória" text="Chave Aleatória" icon={Key} />
            </CustomSelect>
          </Stack>

          <Input
            label="* Chave pix"
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            placeholder="Digite a sua chave Pix"
          />

          <Stack gap={1} w="full">
            <Input
              label="* Nome do beneficiário"
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value.slice(0, 25))}
              placeholder="Nome do beneficiário"
            />
            <Stack direction="row" justify="end" w="full" gap={0}>
              <Font
                variant="description"
                text={`${beneficiaryName.length}/25`}
              />
            </Stack>
          </Stack>

          <Stack gap={1} w="full">
            <Input
              label="* Cidade do beneficiário"
              value={beneficiaryCity}
              onChange={(e) => setBeneficiaryCity(e.target.value.slice(0, 15))}
              placeholder="Cidade do beneficiário"
            />
            <Stack direction="row" justify="end" w="full" gap={0}>
              <Font
                variant="description"
                text={`${beneficiaryCity.length}/15`}
              />
            </Stack>
          </Stack>

          <Input
            label="Informação adicional"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Informação adicional para o Pix"
          />
        </Stack>
      </Box>

      {/* Botões de Ações na Base do Formulário */}
      <Box paddingY={2.5} w="full">
        <Stack direction="row" justify="end" gap={2.5} w="full">
          <Button variant="outline" label="Cancelar" onClick={onCancel} />
          <Button type="button" variant="primary" label="Salvar alterações" onClick={handleSave} />
        </Stack>
      </Box>
    </Stack>
  )
}
