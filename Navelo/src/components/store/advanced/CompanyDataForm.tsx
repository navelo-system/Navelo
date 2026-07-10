"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Upload, LucideIcon, Building, MapPin, User, Phone, FileText } from "lucide-react"
import { WhatsAppIcon } from "@/components/store/base/WhatsAppIcon"

export interface CompanyDataFormProps {
  onCancel: () => void
  onSave: (data: Record<string, unknown>) => void
}

export const CompanyDataForm: React.FC<CompanyDataFormProps> = ({
  onCancel,
  onSave
}) => {
  const [logo, setLogo] = React.useState<string | null>("/logo-default.svg")
  const [razaoSocial, setRazaoSocial] = React.useState("NAVELO PDV")
  const [nomeFantasia, setNomeFantasia] = React.useState("NAVELO PDV")
  const [cnpj, setCnpj] = React.useState("36.383.365/0001-90")
  const [ie, setIe] = React.useState("")
  const [cep, setCep] = React.useState("39801-026")
  const [logradouro, setLogradouro] = React.useState("Rua Sagrada Família")
  const [numero, setNumero] = React.useState("94")
  const [complemento, setComplemento] = React.useState("")
  const [bairro, setBairro] = React.useState("Ipiranga")
  const [cidade, setCidade] = React.useState("Teófilo Otoni-MG")
  const [contatoNome, setContatoNome] = React.useState("Navelo")
  const [contatoTelefone, setContatoTelefone] = React.useState("(33) 999565081")

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      logo,
      razaoSocial,
      nomeFantasia,
      cnpj,
      ie,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      contatoNome,
      contatoTelefone
    })
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg="bg-white"
      border={true}
      borderColor="border-border"
      radius="default"
      padding={5}
      w="full"
    >
      <Stack gap={5} w="full">
        {/* Logo / Upload */}
        <Box padding={5} w="full">
          <Stack align="center" justify="center" w="full">
            {logo ? (
              <Stack gap={2.5} align="center">
                <Box
                  as="img"
                  src={logo}
                  alt="Logo da empresa"
                  w="h-16"
                  h="h-16"
                  objectFit="contain"
                />
                <Button
                  variant="danger-sm"
                  label="Remover logo"
                  onClick={() => setLogo(null)}
                />
              </Stack>
            ) : (
              <Box w="full">
                <Input
                  variant="image-upload"
                  placeholder="Clique ou arraste para enviar o logotipo"
                  icon={Upload}
                  onChange={handleLogoChange}
                />
              </Box>
            )}
          </Stack>
        </Box>

        {/* Dados Gerais */}
        <Stack gap={5} w="full">
          <Input
            label="* Razão social"
            value={razaoSocial}
            onChange={(e) => setRazaoSocial(e.target.value)}
            icon={Building}
          />
          <Input
            label="* Nome fantasia"
            value={nomeFantasia}
            onChange={(e) => setNomeFantasia(e.target.value)}
            icon={Building}
          />
          <Input
            label="CNPJ"
            variant="cnpj"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            icon={FileText}
          />
          <Input
            label="IE"
            value={ie}
            onChange={(e) => setIe(e.target.value)}
            icon={FileText}
          />
        </Stack>

        {/* Seção Endereço */}
        <Stack gap={5} w="full">
          <Font variant="body-bold" text="Endereço" />
          <Stack direction="row" gap={5} w="full">
            <Box w="w-full md:w-1/3">
              <Input
                label="* CEP"
                variant="cep"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                icon={MapPin}
              />
            </Box>
          </Stack>
          <Input
            label="* Logradouro"
            value={logradouro}
            onChange={(e) => setLogradouro(e.target.value)}
            icon={MapPin}
          />
          <Stack direction="row" gap={5} w="full">
            <Box flex="1">
              <Input
                label="* Número"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                icon={MapPin}
              />
            </Box>
            <Box flex="1">
              <Input
                label="Complemento"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                icon={MapPin}
              />
            </Box>
          </Stack>
          <Input
            label="* Bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            icon={MapPin}
          />
          <Input
            label="* Cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            icon={MapPin}
          />
        </Stack>

        {/* Seção Contato */}
        <Stack gap={5} w="full">
          <Font variant="body-bold" text="Contato" />
          <Input
            label="Nome"
            value={contatoNome}
            onChange={(e) => setContatoNome(e.target.value)}
            icon={User}
          />
          <Input
            label="Telefone"
            variant="phone"
            icon={Phone}
            iconRight={WhatsAppIcon as unknown as LucideIcon}
            value={contatoTelefone}
            onChange={(e) => setContatoTelefone(e.target.value)}
          />
        </Stack>

        {/* Ações */}
        <Box padding={2.5} w="w-full md:w-auto">
          <Stack direction="col" mobileDirection="row" justify="end" gap={2.5} w="full">
            <Button variant="outline" label="Cancelar" onClick={onCancel} fullWidth />
            <Button type="submit" variant="primary" label="Salvar alterações" fullWidth />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
