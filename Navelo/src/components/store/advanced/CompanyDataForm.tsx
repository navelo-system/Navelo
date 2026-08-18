"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { Upload, LucideIcon, Building, MapPin, User, Phone, FileText } from "lucide-react"
import { WhatsAppIcon } from "@/components/store/base/WhatsAppIcon"
import { UI_STRINGS } from "@/constants/strings"

export interface CompanyDataFormProps {
  onCancel: () => void
  onSave: (data: Record<string, unknown>) => void
}

export const CompanyDataForm: React.FC<CompanyDataFormProps> = ({
  onCancel,
  onSave
}) => {
  const cd = UI_STRINGS.companyData
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

  const logoFileInputRef = React.useRef<HTMLInputElement>(null)

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
      <Box
        as="input"
        type="file"
        ref={logoFileInputRef}
        accept="image/*"
        onChange={handleLogoChange}
        display="hidden"
      />
      <Stack gap={5} w="full">
        {/* Logo / Upload */}
        <Box padding={5} w="full">
          <Stack align="center" justify="center" w="full">
            {logo ? (
              <Stack gap={2.5} align="center">
                <Box
                  as="img"
                  src={logo}
                  alt={cd.logoAlt}
                  w="h-16"
                  h="h-16"
                  objectFit="contain"
                  cursor="pointer"
                  onClick={() => logoFileInputRef.current?.click()}
                  title={cd.clickToChangeLogoTitle}
                />
                <Button
                  variant="secondary"
                  label={cd.removeLogoButton}
                  onClick={() => setLogo(null)}
                />
              </Stack>
            ) : (
              <Box w="full">
                <Input
                  variant="image-upload"
                  placeholder={cd.uploadLogoPlaceholder}
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
            label={cd.corporateReasonLabel}
            value={razaoSocial}
            onChange={(e) => setRazaoSocial(e.target.value)}
            icon={Building}
          />
          <Input
            label={cd.tradeNameLabel}
            value={nomeFantasia}
            onChange={(e) => setNomeFantasia(e.target.value)}
            icon={Building}
          />
          <Input
            label={cd.cnpjLabel}
            variant="cnpj"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            icon={FileText}
          />
          <Input
            label={cd.ieLabel}
            value={ie}
            onChange={(e) => setIe(e.target.value)}
            icon={FileText}
          />
        </Stack>

        {/* Seção Endereço */}
        <Stack gap={5} w="full">
          <Font variant="body-bold" text={cd.addressSectionTitle} />
          <Stack direction="row" gap={5} w="full">
            <Box w="w-full md:w-1/3">
              <Input
                label={cd.cepLabel}
                variant="cep"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                icon={MapPin}
              />
            </Box>
          </Stack>
          <Input
            label={cd.streetLabel}
            value={logradouro}
            onChange={(e) => setLogradouro(e.target.value)}
            icon={MapPin}
          />
          <Stack direction="row" gap={5} w="full">
            <Box flex="1">
              <Input
                label={cd.numberLabel}
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                icon={MapPin}
              />
            </Box>
            <Box flex="1">
              <Input
                label={cd.complementLabel}
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                icon={MapPin}
              />
            </Box>
          </Stack>
          <Input
            label={cd.neighborhoodLabel}
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            icon={MapPin}
          />
          <Input
            label={cd.cityLabel}
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            icon={MapPin}
          />
        </Stack>

        {/* Seção Contato */}
        <Stack gap={5} w="full">
          <Font variant="body-bold" text={cd.contactSectionTitle} />
          <Input
            label={cd.contactNameLabel}
            value={contatoNome}
            onChange={(e) => setContatoNome(e.target.value)}
            icon={User}
          />
          <Input
            label={cd.contactPhoneLabel}
            variant="phone"
            icon={Phone}
            iconRight={WhatsAppIcon as unknown as LucideIcon}
            value={contatoTelefone}
            onChange={(e) => setContatoTelefone(e.target.value)}
          />
        </Stack>

        <FormActions
          confirmLabel={cd.saveChangesButton}
          onConfirm={() => {}}
          isSubmit={true}
          onCancel={onCancel}
        />
      </Stack>
    </Box>
  )
}
