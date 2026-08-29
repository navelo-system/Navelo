"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Icon } from "@/components/store/base/Icon"
import { Upload, LucideIcon, Building, MapPin, User, Phone, FileText, Image as ImageIcon, Trash2, Check } from "lucide-react"
import { WhatsAppIcon } from "@/components/store/base/WhatsAppIcon"
import { UI_STRINGS } from "@/constants/strings"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { ActionMenu } from "@/components/store/intermediary/ActionMenu"
import { useLiveQuery } from "dexie-react-hooks"
import { db, Company } from "@/lib/dal/db"
import { supabase } from "@/lib/supabase/client"

export interface CompanyDataFormProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

interface CompanyDraft {
  logo: string | null
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  ie: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  contatoNome: string
  contatoTelefone: string
}

function emptyDraft(): CompanyDraft {
  return {
    logo: null, razaoSocial: "", nomeFantasia: "", cnpj: "", ie: "",
    cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "",
    contatoNome: "", contatoTelefone: "",
  }
}

function textOrEmpty(value?: string | null): string {
  return value ?? ""
}

function draftFromCompany(company: Company): CompanyDraft {
  return {
    logo: company.logo_url || null,
    razaoSocial: textOrEmpty(company.name),
    nomeFantasia: textOrEmpty(company.trade_name),
    cnpj: textOrEmpty(company.document),
    ie: textOrEmpty(company.state_registration),
    cep: textOrEmpty(company.address_cep),
    logradouro: textOrEmpty(company.address_street),
    numero: textOrEmpty(company.address_number),
    complemento: textOrEmpty(company.address_complement),
    bairro: textOrEmpty(company.address_neighborhood),
    cidade: textOrEmpty(company.address_city),
    contatoNome: textOrEmpty(company.email),
    contatoTelefone: textOrEmpty(company.phone),
  }
}

function isDraftDirty(draft: CompanyDraft, company: Company): boolean {
  const baseline = draftFromCompany(company)
  return (Object.keys(baseline) as Array<keyof CompanyDraft>).some((key) => draft[key] !== baseline[key])
}

function CompanyLogoMenu({
  fileInputRef,
  onRemoveLogo,
  onClose,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onRemoveLogo: () => void
  onClose: () => void
}) {
  return (
    <ActionMenu
      items={[
        { id: "galeria", label: "Galeria", icon: ImageIcon, onClick: () => fileInputRef.current?.click() },
        { id: "remover", label: "Remover Imagem", icon: Trash2, onClick: onRemoveLogo, danger: true },
      ]}
      onClose={onClose}
      top="100%"
      left="20px"
    />
  )
}

function CompanyLogoSection({
  logo,
  onRemoveLogo,
  fileInputRef,
}: {
  logo: string | null
  onRemoveLogo: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}) {
  const cd = UI_STRINGS.companyData
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <Box position="relative" w="full">
      <Box
        display="flex"
        align="center"
        justify="center"
        cursor="pointer"
        bg={logo ? "bg-transparent" : "bg-surface-sunken"}
        borderBottom
        borderColor="border-border"
        position="relative"
        h="min-h-[160px]"
        onClick={(e) => {
          if (!logo) {
            fileInputRef.current?.click()
            return
          }
          e.stopPropagation()
          setIsMenuOpen((prev) => !prev)
        }}
      >
        {logo ? (
          <Box as="img" src={logo} alt={cd.logoAlt} maxH="140px" w="w-[80%]" objectFit="contain" />
        ) : (
          <Stack align="center" justify="center" gap={2.5}>
            <Icon icon={Upload} size={24} color="muted" />
            <Font variant="description" color="muted" text={cd.uploadLogoPlaceholder} />
          </Stack>
        )}
      </Box>
      {isMenuOpen && (
        <CompanyLogoMenu fileInputRef={fileInputRef} onRemoveLogo={onRemoveLogo} onClose={() => setIsMenuOpen(false)} />
      )}
    </Box>
  )
}

function CompanyGeneralFields({
  razaoSocial, setRazaoSocial, nomeFantasia, setNomeFantasia, cnpj, setCnpj, ie, setIe
}: {
  razaoSocial: string; setRazaoSocial: (v: string) => void
  nomeFantasia: string; setNomeFantasia: (v: string) => void
  cnpj: string; setCnpj: (v: string) => void
  ie: string; setIe: (v: string) => void
}) {
  const cd = UI_STRINGS.companyData
  return (
    <Stack gap={5} w="full">
      <Input variant="outlined-label" label={cd.corporateReasonLabel} value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} icon={Building} />
      <Input variant="outlined-label" label={cd.tradeNameLabel} value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} icon={Building} />
      <Stack direction="col" mobileDirection="row" gap={5} w="full">
        <Box flex="1">
          <Input variant="outlined-label" label={cd.cnpjLabel} value={cnpj} onChange={(e) => setCnpj(e.target.value)} icon={FileText} />
        </Box>
        <Box flex="1">
          <Input variant="outlined-label" label={cd.ieLabel} value={ie} onChange={(e) => setIe(e.target.value)} icon={FileText} />
        </Box>
      </Stack>
    </Stack>
  )
}

function CompanyAddressFields({
  cep, setCep, logradouro, setLogradouro, numero, setNumero, complemento, setComplemento, bairro, setBairro, cidade, setCidade
}: {
  cep: string; setCep: (v: string) => void
  logradouro: string; setLogradouro: (v: string) => void
  numero: string; setNumero: (v: string) => void
  complemento: string; setComplemento: (v: string) => void
  bairro: string; setBairro: (v: string) => void
  cidade: string; setCidade: (v: string) => void
}) {
  const cd = UI_STRINGS.companyData
  return (
    <Stack gap={5} w="full">
      <Font variant="body-bold" text={cd.addressSectionTitle} />
      <Stack direction="col" mobileDirection="row" gap={5} w="full">
        <Box flex="1">
          <Input variant="outlined-label" label={cd.cepLabel} value={cep} onChange={(e) => setCep(e.target.value)} icon={MapPin} />
        </Box>
        <Box flex="1">
          <Input variant="outlined-label" label={cd.streetLabel} value={logradouro} onChange={(e) => setLogradouro(e.target.value)} icon={MapPin} />
        </Box>
      </Stack>
      <Stack direction="col" mobileDirection="row" gap={5} w="full">
        <Box flex="1">
          <Input variant="outlined-label" label={cd.numberLabel} value={numero} onChange={(e) => setNumero(e.target.value)} icon={MapPin} />
        </Box>
        <Box flex="1">
          <Input variant="outlined-label" label={cd.complementLabel} value={complemento} onChange={(e) => setComplemento(e.target.value)} icon={MapPin} />
        </Box>
      </Stack>
      <Stack direction="col" mobileDirection="row" gap={5} w="full">
        <Box flex="1">
          <Input variant="outlined-label" label={cd.neighborhoodLabel} value={bairro} onChange={(e) => setBairro(e.target.value)} icon={MapPin} />
        </Box>
        <Box flex="1">
          <Input variant="outlined-label" label={cd.cityLabel} value={cidade} onChange={(e) => setCidade(e.target.value)} icon={MapPin} />
        </Box>
      </Stack>
    </Stack>
  )
}

function CompanyContactFields({
  contatoNome, setContatoNome, contatoTelefone, setContatoTelefone
}: {
  contatoNome: string; setContatoNome: (v: string) => void
  contatoTelefone: string; setContatoTelefone: (v: string) => void
}) {
  const cd = UI_STRINGS.companyData
  return (
    <Stack gap={5} w="full">
      <Font variant="body-bold" text={cd.contactSectionTitle} />
      <Input variant="outlined-label" label={cd.contactNameLabel} value={contatoNome} onChange={(e) => setContatoNome(e.target.value)} icon={User} />
      <Input
        variant="outlined-label"
        label={cd.contactPhoneLabel}
        icon={Phone}
        iconRight={WhatsAppIcon as unknown as LucideIcon}
        value={contatoTelefone}
        onChange={(e) => setContatoTelefone(e.target.value)}
      />
    </Stack>
  )
}

function useCompanyDraft(company: Company | undefined) {
  const [draft, setDraft] = React.useState<CompanyDraft | null>(null)
  if (company && draft === null) {
    setDraft(draftFromCompany(company))
  }
  return { draft: draft ?? emptyDraft(), setDraft, ready: draft !== null }
}

function patchDraft(setDraft: React.Dispatch<React.SetStateAction<CompanyDraft | null>>, key: keyof CompanyDraft, value: string) {
  setDraft((prev) => ({ ...(prev ?? emptyDraft()), [key]: value }))
}

async function persistCompanyDraft(companyId: string, draft: CompanyDraft) {
  const updates = {
    name: draft.razaoSocial,
    trade_name: draft.nomeFantasia,
    document: draft.cnpj,
    state_registration: draft.ie,
    address_cep: draft.cep,
    address_street: draft.logradouro,
    address_number: draft.numero,
    address_complement: draft.complemento,
    address_neighborhood: draft.bairro,
    address_city: draft.cidade,
    phone: draft.contatoTelefone,
    email: draft.contatoNome,
    logo_url: draft.logo || undefined,
  }
  await db.companies.update(companyId, updates)
  try {
    await supabase.from("companies").upsert({ id: companyId, ...updates })
  } catch {
    // Falha de rede/remoto não deve bloquear o save local
  }
}

function useCompanyFormChrome({
  handleBack,
  handleSave,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}: {
  handleBack: () => void
  handleSave: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}) {
  const handleBackRef = React.useRef(handleBack)
  const handleSaveRef = React.useRef(handleSave)
  React.useEffect(() => {
    handleBackRef.current = handleBack
    handleSaveRef.current = handleSave
  })

  React.useEffect(() => {
    setCustomTitle?.("Dados da empresa")
    setCustomBack?.(() => () => handleBackRef.current())
    setCustomActions?.(
      <Button
        variant="primary-pill-icon"
        icon={Check}
        title={UI_STRINGS.common.confirm}
        onClick={() => handleSaveRef.current()}
      />
    )
    return () => {
      setCustomTitle?.(null)
      setCustomBack?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions])
}

function CompanyDataFields({ draft, setDraft }: { draft: CompanyDraft; setDraft: React.Dispatch<React.SetStateAction<CompanyDraft | null>> }) {
  const set = (key: keyof CompanyDraft) => (value: string) => patchDraft(setDraft, key, value)
  return (
    <Stack gap={5} w="full">
      <CompanyGeneralFields
        razaoSocial={draft.razaoSocial} setRazaoSocial={set("razaoSocial")}
        nomeFantasia={draft.nomeFantasia} setNomeFantasia={set("nomeFantasia")}
        cnpj={draft.cnpj} setCnpj={set("cnpj")}
        ie={draft.ie} setIe={set("ie")}
      />
      <CompanyAddressFields
        cep={draft.cep} setCep={set("cep")}
        logradouro={draft.logradouro} setLogradouro={set("logradouro")}
        numero={draft.numero} setNumero={set("numero")}
        complemento={draft.complemento} setComplemento={set("complemento")}
        bairro={draft.bairro} setBairro={set("bairro")}
        cidade={draft.cidade} setCidade={set("cidade")}
      />
      <CompanyContactFields
        contatoNome={draft.contatoNome} setContatoNome={set("contatoNome")}
        contatoTelefone={draft.contatoTelefone} setContatoTelefone={set("contatoTelefone")}
      />
    </Stack>
  )
}

export function CompanyDataForm({ onCancel, setCustomBack, setCustomTitle, setCustomActions }: CompanyDataFormProps) {
  const company = useLiveQuery(() => db.companies.toCollection().first())
  const { draft, setDraft, ready } = useCompanyDraft(company)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)
  const logoFileInputRef = React.useRef<HTMLInputElement>(null)
  const isDirty = ready && company ? isDraftDirty(draft, company) : false

  const handleBack = React.useCallback(() => {
    if (isDirty) setIsDiscardModalOpen(true)
    else onCancel()
  }, [isDirty, onCancel])

  const handleSave = React.useCallback(async () => {
    if (!company) return
    await persistCompanyDraft(company.id, draft)
    onCancel()
  }, [company, draft, onCancel])

  useCompanyFormChrome({ handleBack, handleSave, setCustomBack, setCustomTitle, setCustomActions })

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setDraft((prev) => ({ ...(prev ?? emptyDraft()), logo: reader.result as string }))
    reader.readAsDataURL(file)
  }

  return (
    <>
      <Box bg="bg-white" border borderColor="border-border" radius="default" overflow="hidden" w="full">
        <Box as="input" type="file" ref={logoFileInputRef} accept="image/*" onChange={handleLogoChange} display="hidden" />
        <CompanyLogoSection
          logo={draft.logo}
          onRemoveLogo={() => setDraft((prev) => ({ ...(prev ?? emptyDraft()), logo: null }))}
          fileInputRef={logoFileInputRef}
        />
        <Box padding={5} w="full">
          <CompanyDataFields draft={draft} setDraft={setDraft} />
        </Box>
      </Box>
      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          setIsDiscardModalOpen(false)
          onCancel()
        }}
      />
    </>
  )
}
