"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { Switch } from "@/components/store/base/Switch"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Icon } from "@/components/store/base/Icon"
import { ShoppingBag, Globe, Info, Key } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface PixSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

function PixChannelsCard({
  caixaEnabled,
  setCaixaEnabled,
  catalogoEnabled,
  setCatalogoEnabled,
}: {
  caixaEnabled: boolean
  setCaixaEnabled: (v: boolean) => void
  catalogoEnabled: boolean
  setCatalogoEnabled: (v: boolean) => void
}) {
  const s = UI_STRINGS.pix
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Stack gap={1}>
          <Font variant="body-bold" text={s.keyTitle} />
          <Font variant="description" text={s.autoConfirmDesc} />
        </Stack>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Stack gap={5} w="full">
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack direction="row" align="center" gap={2.5}>
              <Icon icon={ShoppingBag} size={20} color="muted" />
              <Font variant="body" text={UI_STRINGS.modules.caixa} />
            </Stack>
            <Switch checked={caixaEnabled} onChange={(e) => setCaixaEnabled(e.target.checked)} />
          </Stack>
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack direction="row" align="center" gap={2.5}>
              <Icon icon={Globe} size={20} color="muted" />
              <Font variant="body" text={UI_STRINGS.onlineCatalog.title} />
            </Stack>
            <Switch checked={catalogoEnabled} onChange={(e) => setCatalogoEnabled(e.target.checked)} />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

function PixKeyDetailsCard({
  keyType, setKeyType,
  pixKey, setPixKey,
  beneficiaryName, setBeneficiaryName,
  beneficiaryCity, setBeneficiaryCity,
  additionalInfo, setAdditionalInfo,
}: {
  keyType: string; setKeyType: (v: string) => void
  pixKey: string; setPixKey: (v: string) => void
  beneficiaryName: string; setBeneficiaryName: (v: string) => void
  beneficiaryCity: string; setBeneficiaryCity: (v: string) => void
  additionalInfo: string; setAdditionalInfo: (v: string) => void
}) {
  const s = UI_STRINGS.pix
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Box bg="bg-surface-sunken" border borderColor="border-border" radius="default" padding={5} w="full">
          <Stack direction="row" gap={2.5} align="start" w="full">
            <Box shrink="0">
              <Icon icon={Info} size={20} color="muted" />
            </Box>
            <Font variant="description" text={s.autoConfirmDesc} />
          </Stack>
        </Box>

        <Stack gap={2.5} w="full">
          <Font variant="body-bold" text={s.keyTypeLabel} />
          <CustomSelect value={keyType} onChange={setKeyType}>
            <CustomSelectItem value="CPF/CNPJ" text={s.cpfCnpjOption} icon={Key} />
            <CustomSelectItem value="E-mail" text={s.emailOption} icon={Key} />
            <CustomSelectItem value="Telefone" text={s.phoneOption} icon={Key} />
            <CustomSelectItem value="Chave Aleatória" text={s.randomKeyOption} icon={Key} />
          </CustomSelect>
        </Stack>

        <Input label={s.keyLabel} value={pixKey} onChange={(e) => setPixKey(e.target.value)} placeholder={s.keyPlaceholder} />

        <Stack gap={1} w="full">
          <Input label={s.holderNameLabel} value={beneficiaryName} onChange={(e) => setBeneficiaryName(e.target.value.slice(0, 25))} placeholder={s.holderNamePlaceholder} />
          <Stack direction="row" justify="end" w="full" gap={0}>
            <Font variant="description" text={`${beneficiaryName.length}/25`} />
          </Stack>
        </Stack>

        <Stack gap={1} w="full">
          <Input label={s.cityLabel} value={beneficiaryCity} onChange={(e) => setBeneficiaryCity(e.target.value.slice(0, 15))} placeholder={s.cityPlaceholder} />
          <Stack direction="row" justify="end" w="full" gap={0}>
            <Font variant="description" text={`${beneficiaryCity.length}/15`} />
          </Stack>
        </Stack>

        <Input label={UI_STRINGS.fiscal.additionalInfoLabel} value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} placeholder={UI_STRINGS.fiscal.additionalInfoLabel} />
      </Stack>
    </Box>
  )
}

export const PixSection: React.FC<PixSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
}) => {
  const [caixaEnabled, setCaixaEnabled] = React.useState(true)
  const [catalogoEnabled, setCatalogoEnabled] = React.useState(true)
  const [keyType, setKeyType] = React.useState("CPF/CNPJ")
  const [pixKey, setPixKey] = React.useState("38.383.365/0001-90")
  const [beneficiaryName, setBeneficiaryName] = React.useState("js soluções")
  const [beneficiaryCity, setBeneficiaryCity] = React.useState("Teófilo Otoni")
  const [additionalInfo, setAdditionalInfo] = React.useState("")
  const s = UI_STRINGS.pix

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel, s.title])

  return (
    <Stack gap={5} w="full">
      <PixChannelsCard
        caixaEnabled={caixaEnabled} setCaixaEnabled={setCaixaEnabled}
        catalogoEnabled={catalogoEnabled} setCatalogoEnabled={setCatalogoEnabled}
      />
      <PixKeyDetailsCard
        keyType={keyType} setKeyType={setKeyType}
        pixKey={pixKey} setPixKey={setPixKey}
        beneficiaryName={beneficiaryName} setBeneficiaryName={setBeneficiaryName}
        beneficiaryCity={beneficiaryCity} setBeneficiaryCity={setBeneficiaryCity}
        additionalInfo={additionalInfo} setAdditionalInfo={setAdditionalInfo}
      />
      <FormActions confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton} onConfirm={onCancel} onCancel={onCancel} />
    </Stack>
  )
}
